import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PlaylistUsuario, Musica } from '../models';
import { ApiGroovyService } from '../api-groovy.service';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-navegacao',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navegacao.component.html',
  styleUrl: './navegacao.component.css'
})
export class NavegacaoComponent {
  @Output() menuItemSelected = new EventEmitter<string>(); //evento disparado ao selecionar um item da navbar
  @Output() playlistSelected = new EventEmitter<PlaylistUsuario>(); //evento disparado ao selecionar uma playlist
  playlists: PlaylistUsuario[] = [];
  songs: any[] = [];

  authStatus: boolean = false;
  constructor(private api: ApiGroovyService, private auth: AuthService, private router:Router) {
  }

  ngOnInit() {
    this.getUserPlaylists();
  }


  onItemClick(item: string): void {
    this.menuItemSelected.emit(item);
  }

  onPlaylistClick(playlist: PlaylistUsuario):void {
    this.playlistSelected.emit(playlist);
  }

  getUserPlaylists() {
    this.api.getPlaylists()
    .subscribe({
      next: (data:any) => { 
        for (let i=0; i<data.length; i++) {
          let songs = [];
          for (let j=0; j<data[i].songs.length; j++) {
            let songdata = data[i].songs[j];
            let song = new Musica(songdata._id, songdata.titulo, songdata.artista, data[i]._id, songdata.ano, songdata.genero, songdata.duracao, [], [], data[i].linkCifra);
            songs.push(song);
          }
          let playlist = new PlaylistUsuario(data[i]._id, data[i].titulo, songs, data[i].descricao, 0, data[i].privada);
          this.playlists.push(playlist);
        }
        this.authStatus = true;
      }, 
      error: error => {
        this.authStatus = false;
      }
    })
  }
  
  logOut() {
    this.auth.removeToken();
    window.location.reload();
  }
 
}