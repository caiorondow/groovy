const AlbumModel = require("./models/album");
const mongoose = require('mongoose');
const MONGODB_IP_ADDRESS = "127.0.0.1";
mongoose.connect(`mongodb://${MONGODB_IP_ADDRESS}:27017/groovy-db`, {});

const newAlbum = new AlbumModel({
    titulo: "Acústico (Ao Vivo)",
    artist:"Charlie Brown Jr.",
    ano: "2003",
    genero: "Rock"
  })

newAlbum.save().then(() => {console.log("Inserido")});