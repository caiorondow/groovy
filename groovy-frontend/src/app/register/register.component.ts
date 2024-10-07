import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NgbCarouselModule, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApiGroovyService } from '../api-groovy.service';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, NgbCarouselModule, RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  @ViewChild('ngcarousel', { static: true }) ngCarousel!: NgbCarousel;
  
  generos: any[] = [ 
    {nome:"Sertanejo", selecionado:false}, 
    {nome:"Sertanejo Universitário", selecionado:false}, 
    {nome:"Funk", selecionado:false}, 
    {nome:"Rock", selecionado:false}, 
    {nome:"MPB", selecionado:false}, 
    {nome:"Pop", selecionado:false}, 
    {nome:"Samba", selecionado:false}, 
    {nome:"Pagode", selecionado:false}, 
    {nome:"Axé", selecionado:false}
  ];

  nome: string = "";
  nomeUsuario: string = "";
  email: string = "";
  password: string = "";

  constructor(private api: ApiGroovyService, private auth:AuthService) { }


  selecionarGenero(index: number) {
    this.generos[index].selecionado = !this.generos[index].selecionado;
  }

  getToPrev() {
    this.ngCarousel.prev();
  }

  goToNext() {
    if (!this.nome || !this.nomeUsuario || !this.email || !this.password)
      alert("Por favor, preencha todos os campos antes de continuar.");
    else 
      this.ngCarousel.next();
  }

  registrar() {
    if (!this.nome || !this.nomeUsuario || !this.email || !this.password) {
      alert("Por favor, preencha todos os campos antes de continuar.");
      return;
    }
    let data = {
      name:this.nome, 
      username: this.nomeUsuario,
      email: this.email,
      password: this.password,
      generos: []
    }

    this.api.submitRegister(data)
    .subscribe({
      next: () => {
        alert("Usuário cadastrado com sucesso."); //faz o login automaticamente após registrar
        let user = {username:this.nomeUsuario, email:this.email, password:this.password};
        this.api.submitLogin(user)
        .subscribe({
          next: (response: any) => {
            let token = response['token']; //recebe token de autenticação
            if (token) {
              this.auth.setToken(token); //guarda token
              //this.router.navigate(['']) //redireciona para a página inicial
              window.location.href = "/";

            }

          },
          error: error => {
            alert("Credenciais inválidas.");
          }
        })
      },
      error: (error) => {
        if (error.error['message'] == "Duplicate Key") {
          if (error.error['key'] == "username")
            alert("Este nome de usuário já está sendo utilizado.")
          else if (error.error['key'] == "email")
            alert("Este email já está sendo utilizado.")
        }
      }
    })
  }
}
