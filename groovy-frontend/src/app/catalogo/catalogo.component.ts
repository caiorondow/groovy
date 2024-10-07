import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';
import { Musica } from '../models';
import { ApiGroovyService } from '../api-groovy.service';
@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent {
  @Output() songSelected = new EventEmitter<Musica>(); //evento disparado ao selecionar uma música
  songs: Musica[] = [];

  constructor(private api:ApiGroovyService) {}
  
  ngOnInit() {
    this.getAllSongs();
  }

  onSongClick(song: Musica): void {
    this.songSelected.emit(song);
  }

  getAllSongs() {
    this.api.getSongs()
    .subscribe({
      next:(data:any) => {
        for (let i=0; i<data.length; i++) {
          let song = new Musica(data[i]._id, data[i].titulo, data[i].artist, 0, data[i].ano, data[i].genero, data[i].duracao, [], [], data[i].linkCifra);
          this.songs.push(song);
        }
      },
      error:(error) => {
        console.error(error);
      }
    });
  }


}
