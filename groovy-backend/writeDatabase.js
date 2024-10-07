//Execute este script uma vez para preencher todo o banco de dados com os dados necessários
//Adiciona álbuns e músicas ao banco de dados


//Conexão com o banco de dados
const mongoose = require('mongoose');
const MONGODB_IP_ADDRESS = "127.0.0.1";
mongoose.connect(`mongodb://${MONGODB_IP_ADDRESS}:27017/groovy-db`, {});

//Importando os modelos
const AlbumModel = require("./models/album");
const SongModel = require("./models/song");

criaBD();

async function criaBD() {
    //Adicionando o primeiro álbum
    let newAlbum = new AlbumModel({
        titulo: "Acústico (Ao Vivo)",
        artist:"Charlie Brown Jr.",
        ano: "2003",
        genero: "Rock"
    })
    await newAlbum.save();

    let album = await AlbumModel.find().sort({ _id: -1 }).limit(1);
    let albumId = album[0]._id; //Pegando o ID do álbum recém-adicionado

    let newSong = new SongModel({
        titulo: "Zoio de Lula",
        artist: "Charlie Brown Jr.",
        album: albumId,
        linkCifra: "https://www.cifraclub.com.br/charlie-brown-jr/zoio-de-lula/",
        ano: "2003",
        genero: "Rock",
        duracao: "3:44",
    })

    await newSong.save();

    newSong = new SongModel({
        titulo: "Vícios e Virtudes",
        artist: "Charlie Brown Jr.",
        album: albumId,
        linkCifra: "https://www.cifraclub.com.br/charlie-brown-jr/vicios-virtudes/",
        ano: "2003",
        genero: "Rock",
        duracao: "3:09",
    })

    await newSong.save();

    newSong = new SongModel({
        titulo: "O Preço",
        artist: "Charlie Brown Jr.",
        album: albumId,
        linkCifra: "https://www.cifraclub.com.br/charlie-brown-jr/o-preco/",
        ano: "2003",
        genero: "Rock",
        duracao: "3:13",
    })

    await newSong.save();

    newSong = new SongModel({
        titulo: "Não Uso Sapato",
        artist: "Charlie Brown Jr.",
        album: albumId,
        linkCifra: "https://www.cifraclub.com.br/charlie-brown-jr/nao-uso-sapato/",
        ano: "2003",
        genero: "Rock",
        duracao: "2:52",
    })

    await newSong.save();


    newSong = new SongModel({
        titulo: "Tudo que ela gosta de escutar",
        artist: "Charlie Brown Jr.",
        album: albumId,
        linkCifra: "https://www.cifraclub.com.br/charlie-brown-jr/tudo-que-ela-gosta-de-escutar/",
        ano: "2003",
        genero: "Rock",
        duracao: "3:10",
    })

    await newSong.save();

    newSong = new SongModel({
        titulo: "Quinta-feira",
        artist: "Charlie Brown Jr.",
        album: albumId,
        linkCifra: "https://www.cifraclub.com.br/charlie-brown-jr/quinta-feira/",
        ano: "2003",
        genero: "Rock",
        duracao: "5:17",
    })

    await newSong.save();

    newSong = new SongModel({
        titulo: "Só por uma noite",
        artist: "Charlie Brown Jr.",
        album: albumId,
        linkCifra: "https://www.cifraclub.com.br/charlie-brown-jr/so-por-uma-noite/",
        ano: "2003",
        genero: "Rock",
        duracao: "3:10",
    })

    await newSong.save();



    //Adicionando o segundo álbum
    newAlbum = new AlbumModel({
        titulo: "Tim Maia 1970",
        artist:"Tim Maia",
        ano: "1970",
        genero: "Soul"
    })
    await newAlbum.save();

    album = await AlbumModel.find().sort({ _id: -1 }).limit(1);
    albumId = album[0]._id; //Pegando o ID do álbum recém-adicionado

    newSong = new SongModel({
        titulo: "Eu amo você",
        artist: "Tim Maia",
        album: albumId,
        linkCifra: "https://www.cifraclub.com.br/tim-maia/eu-amo-voce/",
        ano: "1970",
        genero: "Soul",
        duracao: "4:03",
    })

    await newSong.save();

    newSong = new SongModel({
        titulo: "Azul da cor do mar",
        artist: "Tim Maia",
        album: albumId,
        linkCifra: "https://www.cifraclub.com.br/tim-maia/azul-da-cor-do-mar/",
        ano: "1970",
        genero: "Soul",
        duracao: "4:03",
      })
    
    await newSong.save();
    
    newSong = new SongModel({
        titulo: "Você",
        artist: "Tim Maia",
        album: albumId,
        linkCifra: "https://www.cifraclub.com.br/tim-maia/voce/",
        ano: "1970",
        genero: "Soul",
        duracao: "4:04",
      })
    
    await newSong.save();
    
    
    newSong = new SongModel({
        titulo: "Não quero dinheiro",
        artist: "Tim Maia",
        album: albumId,
        linkCifra: "https://www.cifraclub.com.br/tim-maia/nao-quero-dinheiro/",
        ano: "1970",
        genero: "Soul",
        duracao: "2:33",
      })

    await newSong.save();

    console.log("Banco de dados criado!");
}

