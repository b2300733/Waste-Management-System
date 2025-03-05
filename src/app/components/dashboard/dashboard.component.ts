import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  profileForm!: FormGroup;
  editMode: boolean = false;
  showPassword: boolean = false;
  userId: string;
  createdAt: Date | null = null;
  lastLogin: Date | null = null;

  history: any[] = [];
  schedule: any[] = [];

  historySortKey: string = '';
  historySortOrder: 'asc' | 'desc' = 'asc';
  scheduleSortKey: string = '';
  scheduleSortOrder: 'asc' | 'desc' = 'asc';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.userId = localStorage.getItem('userId') || '';
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      password: [{ value: '', disabled: true }],
      contactNumber: [{ value: '', disabled: true }],
      address: [{ value: '', disabled: true }],
      communityName: [{ value: '', disabled: true }],
    });

    this.loadUserData();
    this.loadUserSchedules();
    this.loadUserHistory();
  }

  loadUserData(): void {
    if (this.userId) {
      this.authService.getUser(this.userId).subscribe(
        (data) => {
          this.profileForm.patchValue(data);
          this.createdAt = data.createdAt;
          this.lastLogin = data.lastLogin;
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    }
  }

  loadUserSchedules(): void {
    if (this.userId) {
      this.authService.getUserSchedules(this.userId).subscribe(
        (data) => {
          this.schedule = data.filter((item) => item.status === 'Ongoing');
        },
        (error) => {
          console.error('Error fetching user schedules:', error);
        }
      );
    }
  }

  loadUserHistory(): void {
    if (this.userId) {
      this.authService.getUserSchedules(this.userId).subscribe(
        (data) => {
          this.history = data.filter(
            (item) => item.status === 'Completed' || item.status === 'Missed'
          );
        },
        (error) => {
          console.error('Error fetching user history:', error);
        }
      );
    }
  }

  get completedHistory() {
    return this.history.filter(
      (item) => item.status === 'Completed' || item.status === 'Missed'
    );
  }

  // Sorting for history section
  sortHistory(key: string): void {
    this.historySortKey = key;
    this.historySortOrder = this.historySortOrder === 'asc' ? 'desc' : 'asc';

    this.history.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (this.historySortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  // Sorting for schedule section
  sortSchedule(key: string): void {
    this.scheduleSortKey = key;
    this.scheduleSortOrder = this.scheduleSortOrder === 'asc' ? 'desc' : 'asc';

    this.schedule.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (this.scheduleSortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  get sortedSchedule() {
    return this.schedule.slice().sort((a, b) => {
      const aValue = a[this.scheduleSortKey];
      const bValue = b[this.scheduleSortKey];

      if (this.scheduleSortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;

    if (this.editMode) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
    }
  }

  onSave(): void {
    if (this.profileForm.invalid) {
      alert('Please fill out all fields before saving.');
      return;
    }

    const username = this.profileForm.get('username')?.value;

    // Call the API to get the current user data
    this.authService.getUser(this.userId).subscribe((user) => {
      // Check if the username has changed
      if (user.username !== username) {
        // If username has changed, check if the new username is taken
        this.authService.checkUsernameExists(username).subscribe({
          next: (isTaken) => {
            if (isTaken) {
              alert(
                'This username is already in use. Please choose a different username.'
              );
            } else {
              // If the username is available, proceed to update the user profile
              this.authService
                .updateUser(this.userId, this.profileForm.value)
                .subscribe({
                  next: (response) => {
                    console.log('User data updated successfully:', response);
                    alert('Profile updated successfully!');
                    this.toggleEditMode(); // Exit edit mode after saving
                  },
                  error: (err) => {
                    if (err.status === 409) {
                      alert(
                        'This email is already registered. Please use a different email.'
                      );
                    } else {
                      console.error('Error updating user data:', err);
                      alert(
                        'An error occurred while updating your profile. Please try again.'
                      );
                    }
                  },
                });
            }
          },
          error: (err) => {
            console.error('Error checking username:', err);
            alert(
              'An error occurred while checking the username. Please try again.'
            );
          },
        });
      } else {
        // If username has not changed, directly update the user profile
        this.authService
          .updateUser(this.userId, this.profileForm.value)
          .subscribe({
            next: (response) => {
              console.log('User data updated successfully:', response);
              alert('Profile updated successfully!');
              this.toggleEditMode(); // Exit edit mode after saving
            },
            error: (err) => {
              if (err.status === 409) {
                alert(
                  'This email is already registered. Please use a different email.'
                );
              } else {
                console.error('Error updating user data:', err);
                alert(
                  'An error occurred while updating your profile. Please try again.'
                );
              }
            },
          });
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;

    const passwordField = document.getElementById(
      'password'
    ) as HTMLInputElement;
    passwordField.type = this.showPassword ? 'text' : 'password';
  }
}
