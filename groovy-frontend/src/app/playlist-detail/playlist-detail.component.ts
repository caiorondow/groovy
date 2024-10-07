import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core'; 
import { Musica } from '../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiGroovyService } from '../api-groovy.service';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './playlist-detail.component.html',
  styleUrl: './playlist-detail.component.css'
})
export class PlaylistDetailComponent {
  @Output() songSelected = new EventEmitter<Musica>(); //evento disparado ao selecionar uma música

  @Input() playlist:any;
  playlistSongs: any[] = []

  allSongs: any[] = [];
  allSongsFiltered: any[] = [];
  search: string = "";
  isOnPlaylist: any[] = [];
  belongsToUser: boolean = false;

  constructor(private modalService: NgbModal, private api: ApiGroovyService) {}

  ngOnChanges() {
    this.playlistSongs = []
    this.allSongs = [];
    this.allSongsFiltered = [];
    this.search = "";
    this.isOnPlaylist = [];
    this.getPlaylistSongs();
  }

  ngOnInit() {
    this.authenticate();
    this.getPlaylistSongs();

  }

  authenticate() {
    let dados = {
      playlistId: this.playlist.id
    };
    this.api.playlistAuthenticate(dados)
    .subscribe({
      next: (data:any) => {
        this.belongsToUser = true;
      }, 
      error: error => {
        this.belongsToUser = false;
      }
    });
  }

  async getPlaylistSongs() {
    let dados = {
      playlistId: this.playlist.id
    };
    await this.api.getPlaylistSongs(dados)
    .subscribe({
      next: (data:any) => {
        this.playlistSongs = [];
        for (let i=0; i<data.length; i++) {
          let song = new Musica(data[i]._id, data[i].titulo, data[i].artist, this.playlist.id, data[i].ano, data[i].genero, data[i].duracao, [], [], data[i].linkCifra);
          this.isOnPlaylist[data[i]._id] = true;
          this.playlistSongs.push(song);
        }
        this.getAllSongs();
      }, 
      error: error => {
      }
    });
  }

  addSongToPlaylist(song: any) {
    let dados = {
      playlistId: this.playlist.id,
      songId: song.id
    }
    this.api.submitSongToPlaylist(dados)
    .subscribe({
      next: (data:any) => {
        this.getPlaylistSongs();
      }, 
      error: error => {
        console.error(error);
      }
    })
  }

  open(content:any) {
		this.modalService.open(content);
	}

  getAllSongs() {
    this.api.getSongs()
    .subscribe({
      next:(data:any) => {
        this.allSongs = [];
        for (let i=0; i<data.length; i++) {
          if (!this.isOnPlaylist[data[i]._id]) {
            let song = new Musica(data[i]._id, data[i].titulo, data[i].artist, 0, data[i].ano, data[i].genero, data[i].duracao, [], [], data[i].linkCifra);
            this.allSongs.push(song);
          }
        }
        this.allSongsFiltered = this.allSongs;
      },
      error:(error) => {
        console.error(error);
      }
    });
  }

  filtrar(filter: any) {
    if (!filter)
      this.allSongsFiltered = this.allSongs;
    else
      this.allSongsFiltered = this.allSongsFiltered.filter(
    (item) => item?.titulo.toLowerCase().includes(filter.toLowerCase()));
  }

  deleteSong(song:any) {
    let dados = {
      playlistId: this.playlist.id,
      songId: song.id
    }
    this.api.deleteSongFromPlaylist(dados)
    .subscribe({
      next:(data:any) => {
        this.isOnPlaylist[song.id] = false;
        this.getPlaylistSongs();
      },
      error:(error) => {
        console.error(error);
      }
    });
  }

  apagarPlaylist() {
    let dados = {
      playlistId: this.playlist.id
    }
    this.api.deletePlaylist(dados)
    .subscribe({
      next:(data:any) => {
        window.location.href = '/';
      },
      error:(error) => {
        console.error(error);
      }
    });
  }

  onSongClick(song: Musica): void {
    this.songSelected.emit(song);
  }

}

