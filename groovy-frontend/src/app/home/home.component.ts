import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavegacaoComponent } from '../navegacao/navegacao.component';
import { CatalogoComponent } from '../catalogo/catalogo.component';
import { ExploreComponent } from '../explore/explore.component';
import { LoginComponent } from '../login/login.component';
import { SongDetailComponent } from '../song-detail/song-detail.component';
import { PlaylistDetailComponent } from '../playlist-detail/playlist-detail.component';
import { AddPlaylistComponent } from '../add-playlist/add-playlist.component';
import { Musica, Playlist, Album } from '../models';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { AlbumDetailComponent } from '../album-detail/album-detail.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    NavegacaoComponent, 
    LoginComponent, 
    CatalogoComponent, 
    ExploreComponent, 
    SongDetailComponent, 
    PlaylistDetailComponent, 
    AddPlaylistComponent,
    UserProfileComponent,
    AlbumDetailComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  selectedMenuItem: string = "catalogo"; //contéudo a ser exibido selecionado pelos filhos
  song:any;
  playlist:any;
  album:any;

  onMenuItemSelected(item: string): void {
    this.selectedMenuItem = item;
  }

  onSongSelected(song:Musica): void {
    this.selectedMenuItem = "song"; //para renderizar página de música
    this.song = song;
  }

  onPlaylistSelected(playlist:Playlist): void {
    this.selectedMenuItem = "";
    this.selectedMenuItem = "playlist";
    this.playlist = playlist;
  }

  onAlbumSelected(album:Album): void {
    this.selectedMenuItem = "album";
    this.album = album;
  }
}
