import { Component } from '@angular/core';
import { RegisterRequest } from '../../shared/models/register-request';
import { AuthServiceService } from '../../core/services/auth-service.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-register',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
  user: RegisterRequest = {firstName: "", lastName: "", email: "", password: ""};
  agreeToTerms = false;

  constructor(private authService: AuthServiceService, private router: Router) {}

  onSubmit() {
    this.authService.register(this.user).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/tasks']);
      },
      error: (err) => console.error(err)
    });
  }

}
