export class Playlist {
    id: number;
    titulo: string;
    musicas: Musica[];

    constructor(id:number, titulo:string, musicas:Musica[]){
        this.id = id;
        this.titulo = titulo;
        this.musicas = musicas;
    }
};

export class Album extends Playlist {
    artista: string;
    anoLancamento: string;
    genero: string;
    avaliacoes: Avaliacao[];
    comentarios: Comentario[];

    constructor(id:number, titulo:string, musicas:Musica[], artista:string, ano:string, genero:string, avaliacoes:Avaliacao[], comentarios:Comentario[]) {
        super(id, titulo, musicas);
        this.artista = artista;
        this.anoLancamento = ano;
        this.genero = genero;
        this.avaliacoes = avaliacoes;
        this.comentarios = comentarios;
    }
};

export class PlaylistUsuario extends Playlist{
    descricao: string;
    idUsuario: number;
    privada: boolean;

    constructor(id:number, titulo:string, musicas:Musica[], descricao:string, idUsuario:number, privada:boolean) {
        super(id, titulo, musicas);
        this.descricao = descricao;
        this.idUsuario = idUsuario;
        this.privada = privada;
    }


    adicionarMusica(musica:Musica) {
       this.musicas.push(musica);
    }

    removerMusica() {

    }
}

export class Avaliacao {
    id: number;
    pontuacao: number;
    idUsuario: number;
    idMusica: number;

    constructor(id:number, pontuacao:number, idUsuario:number, idMusica:number) {
        this.id = id;
        this.pontuacao = pontuacao;
        this.idUsuario = idUsuario;
        this.idMusica = idMusica;
    }
};

export class Comentario {
    id: number;
    texto: string;
    data: Date;
    username: string;
    idConteudo: number;

    constructor(id:number, texto:string, data:Date, username:string, idConteudo:number) {
        this.id = id;
        this.texto = texto;
        this.data = data;
        this.username = username;
        this.idConteudo = idConteudo;
    }
};

export class Musica {
    id: string;
    titulo: string;
    artista: string;
    idPlaylist: number;
    anoLancamento: string;
    genero: string;
    duracao: string;
    avaliacoes: Avaliacao[];
    comentarios: Comentario[];
    linkCifra: string;

    constructor(id:string, titulo:string, artista:string, idPlaylist:number, anoLancamento:string, genero:string, duracao:string, avaliacoes:Avaliacao[], comentarios:Comentario[], linkCifra:string) {
        this.id = id;
        this.titulo = titulo;
        this.artista = artista;
        this.idPlaylist = idPlaylist;
        this.anoLancamento = anoLancamento;
        this.genero = genero;
        this.duracao = duracao;
        this.avaliacoes = avaliacoes;
        this.comentarios = comentarios;
        this.linkCifra = linkCifra;
    }
};

export class Usuario {
    id: number;
    nome: string;
    senha: string;
    email: string;
    playlists: PlaylistUsuario[];
    avaliacoes: Avaliacao[];
    comentarios: Comentario[];

    constructor(id:number, nome:string, senha:string, email:string, playlists:PlaylistUsuario[], avaliacoes:Avaliacao[], comentarios:Comentario[]) {
        this.id = id;
        this.nome = nome;
        this.senha = senha;
        this.email = email;
        this.playlists = playlists;
        this.avaliacoes = avaliacoes;
        this.comentarios = comentarios;
    }
}
