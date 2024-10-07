import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiGroovyService } from '../api-groovy.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent{

  userInput: string = "";
  pass: string = "";
  constructor(private api: ApiGroovyService, private auth: AuthService, private router: Router)
  {

  }


  ngOnInit() {
  }

  login() {
    let data = {username:this.userInput, email:this.userInput, password:this.pass};
    this.api.submitLogin(data)
    .subscribe({
      next: (data: any) => {
        let token = data['token']; //recebe token de autenticação
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
  }
}

