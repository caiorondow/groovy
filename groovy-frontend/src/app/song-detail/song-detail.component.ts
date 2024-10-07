import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Input } from '@angular/core'; 
import { Musica } from '../models';
import { ApiGroovyService } from '../api-groovy.service';
import { Comentario } from '../models';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-song-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './song-detail.component.html',
  styleUrl: './song-detail.component.css'
})
export class SongDetailComponent {
  @Input() song:any; //input recebido do componente pai
  letra: string = "";
  authStatus: boolean = true;
  userRating: number = 0;
  songRating: number = 0;
  comentarios: Comentario[] = [];
  userName: string = "";
  textoComentario: string = "";
  numRatings: number = 0;
  constructor(private api:ApiGroovyService) {
  }

  ngOnInit() {
    this.getSongData(); //retorna a letra da música e o id da música no spotify para o widget
    this.getUserRating(); //retorna a pontuação que o usuário deu nesta música
    this.getUserName(); //Nome do usuário logado para mostrar em cima da text-area do comentário
    this.getAllCommentsAndRatings(); //retorna todas as pontuações e comentários que essa música tem
  }

  getSongData() {
    this.api.getSongData({songName: this.song.titulo, artistName: this.song.artista})
    .subscribe((data:any) => {
      this.letra = data['letra'];
      let spinner = document.getElementById('lyricsSpinner');
      if (spinner)
        spinner.style.display = 'none';

      let widgetId = data['widgetId'];
      let link = `https://open.spotify.com/embed/track/${widgetId}?utm_source=generator`;

      //construindo o frame para colocar na página
      let frame = document.createElement('iframe');
      frame.setAttribute("style", "border-radius:12px");
      frame.setAttribute("width", "100%");
      frame.setAttribute("height", "152");
      frame.setAttribute("frameBorder", "0");
      frame.setAttribute("allowfullscreen", "");
      frame.setAttribute("allow", "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture");
      frame.setAttribute("loading", "lazy");
      frame.setAttribute("src", link)
      document.getElementById('frame')?.appendChild(frame);
      spinner = document.getElementById('frameSpinner');
      /*let botcifra = document.createElement('a');
      botcifra.setAttribute('href', this.song.linkCifra);
      botcifra.setAttribute('target', '_blank');
      let textoBotCifra = document.createTextNode("Acesse a cifra");
      let icon = document.createElement('i');
      icon.classList.add('m-3');
      icon.classList.add('bi');
      icon.classList.add('bi-music-note-beamed');
      botcifra.appendChild(textoBotCifra);
      botcifra.appendChild(icon);
      let divCifra = document.getElementById('cifra');
      if (divCifra) {
        divCifra.appendChild(botcifra);
        divCifra.style.display = 'block';
      }*/
      let divCifra = document.getElementById('cifra');
      if (divCifra) {
        document.getElementById('aCifra')?.setAttribute('href', this.song.linkCifra);
        divCifra.style.display = 'block';
      }
      if (spinner)
        spinner.style.display = 'none';
    })
  }

  submitRating() {
    let dados = {
      entityId: this.song.id,
      entity_type: 'song',
      pontuacao: this.userRating,
    }
    this.api.submitRating(dados)
    .subscribe({
      next: (data: any) => {
        this.getAllCommentsAndRatings();
      },
      error: error => {
        console.error(error);
      }
    })
  }

  getUserRating() {
    let dados = {
      entityId: this.song.id,
      entity_type: 'song',
    }
    this.api.getUserRating(dados)
    .subscribe({
      next: (data: any) => {
        this.authStatus = true;
        this.userRating = data['pontuacao'];
        let elem = document.getElementById(this.userRating.toString())
        elem?.setAttribute('checked', "true");
      },
      error: error => {
        console.error(error);
        this.authStatus = false;
      }
    })
  }

  changed(event:any) {
    this.userRating = event.target.value;
    this.submitRating();
  }

  getAllCommentsAndRatings() {
    let dados = {
      entityId: this.song.id,
      entity_type: 'song',
    }
    this.api.getAllCommentsAndRatings(dados)
    .subscribe({
      next: (data: any) => {
        let comments = data['comments'];
        let ratings = data['ratings'];
        this.comentarios = [];
        for (let i=0; i<comments.length; i++) {
          let dataComentario = new Date(comments[i].data);
          let comentario = new Comentario(comments[i]._id, comments[i].texto, dataComentario, comments[i].user_name, comments[i].entityId);
          this.comentarios.push(comentario);
        }

        let soma = 0;
        for (let i=0; i<ratings.length; i++) {
          soma += Number(ratings[i]['pontuacao']);
        }
        if (ratings.length > 0) {
          this.numRatings = ratings.length;
          let pontuacao = soma/ratings.length;
          this.songRating = Math.round(pontuacao * 10) / 10;
        }
      },
      error: error => {
        console.error(error);
      }
    })
  }

  getUserName() {
    this.api.getUserData()
    .subscribe({
      next: (data:any) => {
        this.userName = data['name'];
      },
      error: (error) => {
      }
    })
  }

  submitComment() {

    let dados = {
      entityId: this.song.id,
      entity_type: 'song',
      texto: this.textoComentario,
      dataComentario: new Date(),
      pontuacao: this.userRating,
    }

    this.api.submitComment(dados)
    .subscribe({
      next: (data: any) => {

        this.getAllCommentsAndRatings();
        this.textoComentario = "";
      },
      error: error => {
        console.error(error);
      }
    })
  }

}
