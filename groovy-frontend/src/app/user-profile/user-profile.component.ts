import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiGroovyService } from '../api-groovy.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  name: string = "";
  username: string = "";
  email: string = "";

  constructor(private api: ApiGroovyService) {}

  ngOnInit() {
    this.getUserData();
  }


  getUserData() {
    this.api.getUserData()
    .subscribe({
      next: (data:any) => {
        this.name = data['name'];
        this.username = data['username'];
        this.email = data['email'];
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

}


