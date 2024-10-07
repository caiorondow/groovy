import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiGroovyService } from '../api-groovy.service';
import { Album, Musica } from '../models';
@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album-detail.component.html',
  styleUrl: './album-detail.component.css'
})
export class AlbumDetailComponent {
  @Output() songSelected = new EventEmitter<Musica>(); //evento disparado ao selecionar uma música

  @Input() album:any;

  albumSongs:any[] = [];

  constructor(private api: ApiGroovyService) {}

  ngOnInit() {
    this.getAlbumSongs();

  }

  async getAlbumSongs() {
    let dados = {
      albumId: this.album.id
    };
    await this.api.getAlbumSongs(dados)
    .subscribe({
      next: (data:any) => {
        this.albumSongs = [];
        for (let i=0; i<data.length; i++) {
          let song = new Musica(data[i]._id, data[i].titulo, data[i].artist, this.album.id, data[i].ano, data[i].genero, data[i].duracao, [], [], data[i].linkCifra);
          this.albumSongs.push(song);
        }
      }, 
      error: error => {
      }
    });
  }

  onSongClick(song: Musica): void {
    this.songSelected.emit(song);
  }

}


