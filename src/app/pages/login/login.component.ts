import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent {
  password = '';
  error = false;
  loading = false;

  constructor(private authService: AuthService) {}

  login() {
    this.loading = true;
    this.error = false;

    this.authService.loginFromWebsite(this.password)
      .then(() => {
        this.loading = false;
      })
      .catch(() => {
        this.error = true;
        this.loading = false;
      });
  }

}
