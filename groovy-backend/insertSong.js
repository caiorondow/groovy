// 6579a66794d7e4373c75cc5a

const SongModel = require("./models/song");

const mongoose = require('mongoose');
const MONGODB_IP_ADDRESS = "127.0.0.1";
mongoose.connect(`mongodb://${MONGODB_IP_ADDRESS}:27017/groovy-db`, {});

const newSong = new SongModel({
    titulo: "Zoio de Lula",
    artist: "Charlie Brown Jr.",
    album: new mongoose.Types.ObjectId('6579a66794d7e4373c75cc5a'),
    linkCifra: "https://www.cifraclub.com.br/charlie-brown-jr/zoio-de-lula/",
    ano: "2003",
    genero: "Rock",
    duracao: "3:44",
    avaliacoes: [],
  })

newSong.save().then(() => {console.log("Inserido")});

const newSong1 = new SongModel({
    titulo: "Vícios e Virtudes",
    artist: "Charlie Brown Jr.",
    album: new mongoose.Types.ObjectId('6579a66794d7e4373c75cc5a'),
    linkCifra: "https://www.cifraclub.com.br/charlie-brown-jr/vicios-virtudes/",
    ano: "2003",
    genero: "Rock",
    duracao: "3:09",
    avaliacoes: [],
  })

newSong1.save().then(() => {console.log("Inserido")});

const newSong2 = new SongModel({
    titulo: "O Preço",
    artist: "Charlie Brown Jr.",
    album: new mongoose.Types.ObjectId('6579a66794d7e4373c75cc5a'),
    linkCifra: "https://www.cifraclub.com.br/charlie-brown-jr/o-preco/",
    ano: "2003",
    genero: "Rock",
    duracao: "3:13",
    avaliacoes: [],
  })

newSong2.save().then(() => {console.log("Inserido")});

const newSong3 = new SongModel({
    titulo: "Não Uso Sapato",
    artist: "Charlie Brown Jr.",
    album: new mongoose.Types.ObjectId('6579a66794d7e4373c75cc5a'),
    linkCifra: "https://www.cifraclub.com.br/charlie-brown-jr/nao-uso-sapato/",
    ano: "2003",
    genero: "Rock",
    duracao: "2:52",
    avaliacoes: [],
  })

newSong3.save().then(() => {console.log("Inserido")});


const newSong4 = new SongModel({
    titulo: "Tudo que ela gosta de escutar",
    artist: "Charlie Brown Jr.",
    album: new mongoose.Types.ObjectId('6579a66794d7e4373c75cc5a'),
    linkCifra: "https://www.cifraclub.com.br/charlie-brown-jr/tudo-que-ela-gosta-de-escutar/",
    ano: "2003",
    genero: "Rock",
    duracao: "3:10",
    avaliacoes: [],
  })

newSong4.save().then(() => {console.log("Inserido")});


const newSong5 = new SongModel({
    titulo: "Quinta-feira",
    artist: "Charlie Brown Jr.",
    album: new mongoose.Types.ObjectId('6579a66794d7e4373c75cc5a'),
    linkCifra: "https://www.cifraclub.com.br/charlie-brown-jr/quinta-feira/",
    ano: "2003",
    genero: "Rock",
    duracao: "5:17",
    avaliacoes: [],
  })

newSong5.save().then(() => {console.log("Inserido")});


const newSong6 = new SongModel({
    titulo: "Só por uma noite",
    artist: "Charlie Brown Jr.",
    album: new mongoose.Types.ObjectId('6579a66794d7e4373c75cc5a'),
    linkCifra: "https://www.cifraclub.com.br/charlie-brown-jr/so-por-uma-noite/",
    ano: "2003",
    genero: "Rock",
    duracao: "3:10",
    avaliacoes: [],
  })

newSong6.save().then(() => {console.log("Inserido")});