import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiGroovyService } from '../api-groovy.service';

@Component({
  selector: 'app-add-playlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-playlist.component.html',
  styleUrl: './add-playlist.component.css'
})
export class AddPlaylistComponent {
  titulo: string = "";
  descricao: string = "";
  privada: boolean = false;
  
  constructor(private api: ApiGroovyService) {}

  addPlaylist() {
    let dados = {
      titulo: this.titulo,
      descricao: this.descricao,
      privada: this.privada,
    }
    this.api.submitPlaylist(dados)
    .subscribe({
      next: (data:any) => {
        alert("Playlist adicionada com sucesso.");
        window.location.href = '/';
        
      },
      error: (error) => {
        console.error(error);
        alert("Erro ao adicionar Playlist.");
      }
    })
  }
}
