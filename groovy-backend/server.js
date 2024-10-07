const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

const MONGODB_IP_ADDRESS = "127.0.0.1";
const SERVER_IP_ADDRESS = "127.0.0.1";

//Conexão ao Banco de Dados
mongoose.connect(`mongodb://${MONGODB_IP_ADDRESS}:27017/groovy-db`, {});

//Importando os modelos do Banco de Dados
const UserModel = require("./models/user");
const PlaylistModel = require("./models/playlist");
const SongModel = require("./models/song");
const RatingModel = require("./models/rating");
const CommentModel = require("./models/comment");
const AlbumModel = require("./models/album");

//Middleware para conversão do body em json
app.use(bodyParser.json());

/* Parte de autenticação do Token */ 
const secretKey = 'groovy-key'; // Chave secreta para assinatura dos Tokens

/* Função para verificar um token na requisição
   Esta função deve ser passada como parâmetro em uma requisição que se deseja realizar autenticação
*/
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = user;
    next();
  });
};

//Servindo a aplicação angular
app.use(express.static('../groovy-frontend/dist/groovy-frontend/browser'));
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../groovy-frontend/dist/groovy-frontend/browser/index.html'));
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../groovy-frontend/dist/groovy-frontend/browser/index.html'));
});

// API para login de usuário
app.post('/api-groovy/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //Procura usuário pelo nome de usuário
    const user = await UserModel.findOne({ username }) || await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verifica senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    //Se a senha é válida, envia o token de autenticação
    const token = jwt.sign({ userId: user._id, username: user.username }, secretKey, { expiresIn: '30 days' });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API para registro de novo usuário
app.post('/api-groovy/register', async (req, res) => {
  try {
    const { name, username, email, password, generos } = req.body;
    const newUser = new UserModel({
      name,
      username,
      email,
      password,
      generos,
    });
    await newUser.save();

    res.status(201).json({ message: 'Success' });
  } catch (error) {
    if (error.code == 11000) { //código de erro de duplicate key
      let duplicatedKey;
      if (Object.keys(error.keyValue)[0] == "username")
        duplicatedKey = "username";
      else 
        duplicatedKey = "email";
      res.status(500).json({ message: 'Duplicate Key', key: duplicatedKey});
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

//Retorna dados de cadastro de um usuário
app.post('/api-groovy/user', authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.user.userId });
    if (user) {
      res.status(200).json({ 
        name: user.name,
        username: user.username,
        email: user.email
      });
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Adiciona playlist na conta de um usuário
app.post('/api-groovy/add-playlist', authenticateToken, async (req, res) => {
  try {
    //Adicionando a Playlist
    const { titulo, descricao, privada } = req.body;
    const userId = req.user.userId; //recebido pelo Token de autenticação
    const user = await UserModel.findById(userId);
    if (user) {
      const newPlaylist = new PlaylistModel({
        titulo: titulo,
        user: userId,
        songs: [],
        descricao: descricao,
        privada: privada
      })
      await newPlaylist.save();

      //Vinculando a Playlist ao usuário
      user.playlists.push(newPlaylist._id);
      await user.save();
      res.status(201).json({ message: 'Success' });
    } else {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//Retorna playlists de um usuário
app.post('/api-groovy/userplaylists', authenticateToken, async (req, res) => {
  try {
    //console.log(req.user);
    const userId = req.user.userId;
    const user = await UserModel.findById(userId).populate('playlists');
    if (user) {
      res.json(user.playlists);
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//Retorna músicas do catálogo
//Se receber um parametro de busca, retorna baseado no parametro
//Caso contrário, retorna todas as músicas do catálogo
app.post('/api-groovy/song', async (req, res) => {
  let search = req.body.search || null;
  try {
    if (search) {
      const query = {titulo: {$regex: search, $options: 'i' }};
      const songs = await SongModel.find(query, {__v:0, album:0});
      res.status(200).json(songs);
    }
    else {
      const songs = await SongModel.find({}, {__v:0, album:0});
      res.status(200).json(songs);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//Recebe como parametros da requisição um título de uma música e um artista
//Daí, acessa a API da MusixMatch para conseguir a letra e a API do spotify para conseguir a track id para o widget
//Retorna a letra e o id
app.post('/api-groovy/getsongdata', async (req, res) => {
  const titulo = req.body.songName;
  const artista = req.body.artistName;

  try {
    const letra = await getLyric(titulo, artista);
    const widgetId = await getWidgetId(titulo + ' ' + artista);
    res.status(200).json({ letra: letra, widgetId: widgetId});
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


//Retorna a pontuação que um usuário deu em uma música ou álbum
app.post('/api-groovy/rating', authenticateToken, async (req, res) => {
  try {
    //console.log(req.user);
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const entityId = new mongoose.Types.ObjectId(req.body.entityId);
    const entity_type = req.body.entity_type;

    const rating = await RatingModel.findOne({
      userId: userId, 
      entityId: entityId,
      entity_type: entity_type 
    });
    if (rating) {
      res.status(200).json(rating);
    } else {
      res.status(200).json({ message: 'Usuário ainda não avaliou' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//API para um usuário adicionar (ou atualizar) uma pontuação em uma música ou álbum
app.post('/api-groovy/add-rating', authenticateToken, async (req, res) => {
  try {
    //console.log(req.user);
    const userId = req.user.userId;
    const entityId = req.body.entityId;
    const entity_type = req.body.entity_type;
    const pontuacao = req.body.pontuacao;

    const rating = await RatingModel.findOne({
      userId: new mongoose.Types.ObjectId(userId), 
      entityId: new mongoose.Types.ObjectId(entityId), 
      entity_type: entity_type
    });

    if (rating) {
      rating.pontuacao = pontuacao;
      await rating.save();
    } else {
      const newRating = await new RatingModel({
        pontuacao: pontuacao,
        userId: new mongoose.Types.ObjectId(userId),
        entityId: new mongoose.Types.ObjectId(entityId),
        entity_type: entity_type,
      })
      newRating.save();
    }
    res.status(201).json({message: "Success"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//API para conseguir os comentários e ratings de uma música
app.post('/api-groovy/get-comments-ratings', async (req, res) => {
  try {
    const entityId = req.body.entityId;
    const entity_type = req.body.entity_type;

    const ratings = await RatingModel.find({
      entityId: new mongoose.Types.ObjectId(entityId), 
      entity_type: entity_type
    });

    const comments = await CommentModel.aggregate([
      {
        $match: {
          entityId: new mongoose.Types.ObjectId(entityId),
          entity_type: entity_type
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user_info"
        }
      },
      {
        $unwind: {
          path: "$user_info",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          "_id": 1,
          "texto": 1,
          "data": 1,
          "userId": 1,
          "entityId": 1,
          "user_name": "$user_info.name"
        }
      }
    ]).sort({data:-1});
    
    res.status(200).json({ratings: ratings, comments: comments});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//API para um usuário adicionar um comentário em uma música ou álbum
app.post('/api-groovy/add-comment', authenticateToken, async (req, res) => {
  try {
    //console.log(req.user);
    const userId = req.user.userId;
    const entityId = req.body.entityId;
    const entity_type = req.body.entity_type;
    const texto = req.body.texto;
    const dataComentario = req.body.dataComentario;

    const newComment = await new CommentModel({
      texto: texto,
      data: dataComentario,
      userId: new mongoose.Types.ObjectId(userId),
      entityId: new mongoose.Types.ObjectId(entityId),
      entity_type: entity_type,
    })
    newComment.save();
    
    res.status(201).json({message: "Success"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Adiciona música a uma playlist de um usuário
app.post('/api-groovy/add-song-to-playlist', authenticateToken, async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    const playlist = await PlaylistModel.findById(playlistId);
    if (playlist) {
      playlist.songs.push(new mongoose.Types.ObjectId(songId));
      playlist.save();
      res.status(201).json({ message: 'Success' });
    } else {
      return res.status(404).json({ message: 'Playlist não encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//Retorna músicas de uma playlist
app.post('/api-groovy/get-playlist-songs', async (req, res) => {
  try {
    const playlistId = req.body.playlistId;
    const playlist = await PlaylistModel.findById(playlistId).populate('songs');
    if (playlist) {
      res.json(playlist.songs);
    } else {
      res.status(404).json({ message: 'Playlist não encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Exclui uma música de uma playlist de um usuário
app.post('/api-groovy/delete-song-from-playlist', authenticateToken, async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    await PlaylistModel.updateOne({
      _id: new mongoose.Types.ObjectId(playlistId),
    },
    { 
      $pull: { songs: new mongoose.Types.ObjectId(songId) } 
    });
    res.status(200).json({ message: 'Success' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Exclui uma playlist de um usuário
app.post('/api-groovy/delete-playlist', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { playlistId } = req.body;

    await UserModel.updateOne({
      _id: new mongoose.Types.ObjectId(userId),
    },
    { 
      $pull: { playlists: new mongoose.Types.ObjectId(playlistId) } 
    });

    await PlaylistModel.deleteOne({
      _id: new mongoose.Types.ObjectId(playlistId),
    });
    res.status(200).json({ message: 'Success' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//Retorna álbuns
//Se receber um parametro de busca, retorna baseado no parametro
//Caso contrário, retorna todos os álbuns do catálogo
app.post('/api-groovy/get-albums', async (req, res) => {
  let search = req.body.search || null;
  try {
    if (search) {
      const query = {titulo: {$regex: search, $options: 'i' }};

      const albums = await AlbumModel.find(query, {__v:0});
      res.status(200).json(albums);
    }
    else {
      const albums = await AlbumModel.find({}, {__v:0});
      res.status(200).json(albums);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



//Retorna músicas de uma playlist de um usuário
app.post('/api-groovy/get-album-songs', async (req, res) => {
  try {
    const albumId = req.body.albumId;
    const songs = await SongModel.find({
      album: new mongoose.Types.ObjectId(albumId)
    });
    res.status(200).json(songs);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//Retorna todas as playlists públicas disponíveis
app.post('/api-groovy/get-public-playlists', async (req, res) => {
  try {
    const playlists = await PlaylistModel.find({
      privada: false
    });
    res.json(playlists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//Verifica se um usuário é dono de uma playlist
app.post('/api-groovy/playlist-authenticate', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const playlistId = req.body.playlistId;
    const playlist = await PlaylistModel.findOne({
      _id: new mongoose.Types.ObjectId(playlistId),
      user: new mongoose.Types.ObjectId(userId)
    });
    if (playlist) {
      res.status(200).json({message: "Usuário é dono desta playlist"});
    } else {
      res.status(404).json({message: "Playlist não encontrada para este usuário"});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



//Iniciando o servidor
const port = process.env.PORT || 3000;

app.listen(port, `${SERVER_IP_ADDRESS}`, () => {
  console.log(`Server is running on http://${SERVER_IP_ADDRESS}:${port}/`);
  console.log(`MongoDB running on mongodb://${MONGODB_IP_ADDRESS}:27017/groovy-db`)
});


async function getLyric(songName, artistName) {
  const apiKey = '17704c27bc49d9811cbe327443183138';
  const baseUrl = 'https://api.musixmatch.com/ws/1.1/';
  const searchEndpoint = `track.search?q_track=${encodeURIComponent(songName)}&q_artist=${encodeURIComponent(artistName)}&apikey=${apiKey}`;
  const searchUrl = baseUrl + searchEndpoint;

  try {
    const buscaResposta = await fetch(searchUrl);
    const buscaDados = await buscaResposta.json();
    const trackId = buscaDados.message.body.track_list[0].track.track_id;
    const letraEndpoint = `track.lyrics.get?track_id=${trackId}&apikey=${apiKey}`;
    const letraUrl = baseUrl + letraEndpoint;
    const letraResposta = await fetch(letraUrl);
    const letraDados = await letraResposta.json();
    const letra = letraDados.message.body.lyrics.lyrics_body;
    return letra;

  } catch (error) {
    console.error('Error:', error);
  }
}

async function getWidgetId(search) {
  //credenciais cadastradas no spotify
  const clientId = '8501d000f2c84fc4b91ed7a388b86b8e';
  const clientSecret = '0a31e17516c14c7ca4576e5c2b0ea6ba';

  //api para conseguir o token
  const apiUrlToken = 'https://accounts.spotify.com/api/token';

  const requestBody = new URLSearchParams();
  requestBody.append('grant_type', 'client_credentials');
  requestBody.append('client_id', clientId);
  requestBody.append('client_secret', clientSecret);

  let token;
  await fetch(apiUrlToken, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: requestBody,
  })
  .then(response => response.json())
    .then(data => {
      token = data.access_token; 
    })
  .catch(error => console.error('Error:', error));

  //depois de conseguir o token, busca pelo id da música
  const apiUrl = `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(search)}`;
  let id;
  await fetch(apiUrl, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
    },
  })
  .then(response => response.json())
  .then(data => {
      id = data.tracks.items[0].id;
  })
  .catch(error => console.error('Error:', error));
  return id;
}