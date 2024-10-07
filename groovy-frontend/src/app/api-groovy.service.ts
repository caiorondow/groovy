import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiGroovyService {
  constructor(private http: HttpClient) { }

  submitLogin(data: any) {
    return this.http.post("/api-groovy/login", data); 
  }

  submitRegister(data: any) {
    return this.http.post("/api-groovy/register", data);
  }

  submitPlaylist(data:any) {
    return this.http.post("/api-groovy/add-playlist", data);
  }

  submitRating(data:any) {
    return this.http.post("/api-groovy/add-rating", data);
  }

  submitComment(data:any) {
    return this.http.post("/api-groovy/add-comment", data);
  }

  submitSongToPlaylist(data:any) {
    return this.http.post("/api-groovy/add-song-to-playlist", data);
  }

  getPlaylists() {
    return this.http.post("/api-groovy/userplaylists", {});
  }

  getUserData() {
    return this.http.post("/api-groovy/user", {});
  }

  getSongs(data?: any) {
    return this.http.post("api-groovy/song", data);
  }

  getSongData(data: any) {
    return this.http.post("/api-groovy/getsongdata", data);
  }

  getUserRating(data:any) {
    return this.http.post("/api-groovy/rating", data);
  }

  getAllCommentsAndRatings(data:any) {
    return this.http.post("/api-groovy/get-comments-ratings", data);
  }

  getPlaylistSongs(data:any) {
    return this.http.post("/api-groovy/get-playlist-songs", data);
  }

  deleteSongFromPlaylist(data:any) {
    return this.http.post("/api-groovy/delete-song-from-playlist", data);
  }

  deletePlaylist(data:any) {
    return this.http.post("/api-groovy/delete-playlist", data);
  }

  getAlbums(data?:any) {
    return this.http.post("/api-groovy/get-albums", data);
  }

  getAlbumSongs(data:any) {
    return this.http.post("/api-groovy/get-album-songs", data);
  }

  getPublicPlaylists(data?:any) {
    return this.http.post("/api-groovy/get-public-playlists", data);
  }

  playlistAuthenticate(data:any) {
    return this.http.post("/api-groovy/playlist-authenticate", data);
  }

}
