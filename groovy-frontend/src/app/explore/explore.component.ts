import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiGroovyService } from '../api-groovy.service';
import { Musica, Album, Playlist, PlaylistUsuario } from '../models';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent {
  @Output() songSelected = new EventEmitter<Musica>(); //evento disparado ao selecionar uma música
  @Output() albumSelected = new EventEmitter<Album>(); //evento disparado ao selecionar um álbum
  @Output() playlistSelected = new EventEmitter<Playlist>(); //evento disparado ao selecionar uma música


  items: any[] = []
  itemsFiltered:any[] = [];
  search: string = "";

  constructor(private api:ApiGroovyService) {}

  ngOnInit() {
    this.getItems();
  }

  getItems() {
    //Músicas
    this.api.getSongs()
    .subscribe({
      next:(data:any) => {
        for (let i=0; i<data.length; i++) {
          let song = new Musica(data[i]._id, data[i].titulo, data[i].artist, 0, data[i].ano, data[i].genero, data[i].duracao, [], [], data[i].linkCifra);
          let item:any = song;
          item.tipo = 'song';
          this.items.push(item);
        }
        this.itemsFiltered = this.items;
      },
      error:(error) => {
        console.error(error);
      }
    });

    //Álbuns
    this.api.getAlbums()
    .subscribe({
      next:(data:any) => {
        for (let i=0; i<data.length; i++) {
          let album = new Album(data[i]._id, data[i].titulo, [], data[i].artist, data[i].ano, data[i].genero, [],[]);
          let item:any = album;
          item.tipo = 'album';
          this.items.push(item);
        }
        this.itemsFiltered = this.items;
      },
      error:(error) => {
        console.error(error);
      }
    });

    //Playlists públicas
    this.api.getPublicPlaylists()
    .subscribe({
      next:(data:any) => {
        for (let i=0; i<data.length; i++) {
          let playlist = new PlaylistUsuario(data[i]._id, data[i].titulo, [], data[i].titulo, 0, false);
          let item:any = playlist;
          item.tipo = 'playlist';
          this.items.push(item);
        }
        this.itemsFiltered = this.items;
      },
      error:(error) => {
        console.error(error);
      }
    });
  }

  filtrar(filter: any) {
    console.log(this.items);
    if (!filter)
      this.itemsFiltered = this.items;
    else
      this.itemsFiltered = this.items.filter(
    (item) => item?.titulo.toLowerCase().includes(filter.toLowerCase()));
  }

  onSongClick(song: Musica): void {
    this.songSelected.emit(song);
  }

  onAlbumClick(album: Album): void {
    this.albumSelected.emit(album);
  }

  onPlaylistClick(playlist: Playlist): void {
    this.playlistSelected.emit(playlist);
  }
  
}
