import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthServiceService } from '../core/services/auth-service.service';
import { RouterModule, Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    imports: [CommonModule, RouterModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isMobileMenuOpen = false;

  constructor(public authService: AuthServiceService, private router: Router) {}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
