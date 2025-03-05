import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isAdmin = false;
  isNavbarCollapsed = false;
  userEmail: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.checkAdminStatus();
    this.userEmail = localStorage.getItem('userEmail');
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  goToNotificationPage() {
    this.router.navigate(['/notification']);
  }
  goToPage(pageName: string): void {
    this.router.navigate([`/${pageName}`]);
  }

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
    setTimeout(() => {
      window.location.reload();
    }, 0);
  }

  private checkAdminStatus() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.authService.getUser(userId).subscribe({
        next: (user) => {
          this.isAdmin = user.isAdmin;
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
        },
      });
    }
  }
}
