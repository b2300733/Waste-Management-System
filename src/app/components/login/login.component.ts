import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  signupData = { username: '', email: '', password: '' };
  loginData = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onSignup() {
    if (
      !this.signupData.username ||
      !this.signupData.email ||
      !this.signupData.password
    ) {
      alert('Please fill in all fields for signup.');
      return;
    }

    this.authService.checkUsernameExists(this.signupData.username).subscribe({
      next: (usernameExists) => {
        if (usernameExists) {
          alert(
            'This username is already taken. Please choose a different username.'
          );
          return;
        }

        this.authService.checkEmailExists(this.signupData.email).subscribe({
          next: (emailExists) => {
            if (emailExists) {
              alert(
                'This email is already registered. Please use a different email.'
              );
              return;
            }

            this.authService.signup(this.signupData).subscribe({
              next: (response) => {
                console.log('Signup successful!', response);
                alert('Signup successful!');
              },
              error: (err) => {
                console.error('Signup failed:', err);
                alert('Signup failed. Please try again.');
              },
            });
          },
          error: (err) => {
            console.error('Error checking email:', err);
            alert(
              'An error occurred while checking the email. Please try again.'
            );
          },
        });
      },
      error: (err) => {
        console.error('Error checking username:', err);
        alert(
          'An error occurred while checking the username. Please try again.'
        );
      },
    });
  }

  onLogin() {
    if (!this.loginData.email || !this.loginData.password) {
      alert('Please fill in all fields for login.');
      return;
    }

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login successful!', response);

        if (response && response.userId) {
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('userEmail', this.loginData.email);

          // Fetch user data to check if the user is an admin
          this.authService.getUser(response.userId).subscribe({
            next: (user) => {
              // Check if the user is an admin
              if (user.isAdmin) {
                this.router.navigate(['/admin']); // Redirect to /admin for admins
              } else {
                this.router.navigate(['/dashboard']); // Redirect to /dashboard for regular users
              }
              alert('Login successful!');
            },
            error: (err) => {
              console.error('Error fetching user data:', err);
              alert('Login successful, but could not retrieve user data.');
              this.router.navigate(['/dashboard']); // Default redirect for regular users
            },
          });
        } else {
          alert('Login failed: User ID not received.');
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Login failed. Please check your credentials.');
      },
    });
  }
}
