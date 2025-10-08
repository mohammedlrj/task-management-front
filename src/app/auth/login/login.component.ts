import { Component, OnInit } from '@angular/core';
import { LoginRequest } from '../../shared/models/login-request';
import { AuthServiceService } from '../../core/services/auth-service.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


declare const google: any;

@Component({
    selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthServiceService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.renderGoogleButton();
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/tasks']);
        console.log(res.token);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Invalid email or password';
      }
    });
  }

  private renderGoogleButton() {
    google.accounts.id.initialize({
      client_id: '93113834473-d195tb9kc0fioroi61s800ljdn895u2s.apps.googleusercontent.com', // replace with your client id
      callback: (response: any) => this.handleGoogleCredential(response.credential)
    });

    google.accounts.id.renderButton(
      document.getElementById('googleSignInButton'),
      { theme: 'outline', size: 'large', width: '100%' }
    );
  }

  private handleGoogleCredential(idToken: string) {
    this.authService.googleLogin(idToken).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/tasks']);
      },
      error: (err) => console.error('Google login failed', err)
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
