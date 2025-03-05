import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  showPassword: boolean = false;
  userId: string = '';
  userActivity: any[] = [];
  schedules: any[] = [];
  reports: any[] = [];

  userActivitySortKey: string = '';
  userActivitySortOrder: 'asc' | 'desc' = 'asc';
  scheduleSortKey: string = '';
  scheduleSortOrder: 'asc' | 'desc' = 'asc';
  reportIssueSortKey: string = '';
  reportIssueSortOrder: 'asc' | 'desc' = 'asc';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || '';
    this.loadUserActivity();
    this.loadSchedules();
    this.loadReports();
  }

  loadUserActivity(): void {
    this.authService.getUserActivity().subscribe(
      (data) => {
        this.userActivity = data;
      },
      (error) => {
        console.error('Error loading user activity:', error);
      }
    );
  }

  loadSchedules(): void {
    this.authService.getAllSchedules().subscribe(
      (data) => {
        this.schedules = data.map((schedule) => ({
          ...schedule,
          createdAt: new Date(
            new Date(schedule.createdAt).getTime() - 8 * 60 * 60 * 1000
          ),
        }));
      },
      (error) => {
        console.error('Error loading schedules:', error);
      }
    );
  }

  loadReports(): void {
    this.authService.getAllReports().subscribe(
      (data) => {
        this.reports = data; // Store the fetched reports
      },
      (error) => {
        console.error('Error loading reports:', error);
      }
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;

    const passwordField = document.getElementById(
      'password'
    ) as HTMLInputElement;
    passwordField.type = this.showPassword ? 'text' : 'password';
  }

  findUser(event: Event): void {
    event.preventDefault();
    const emailField = (document.getElementById('email') as HTMLInputElement)
      .value;
    const userNotFoundMessage = document.getElementById(
      'userNotFoundMessage'
    ) as HTMLElement;

    if (!emailField) {
      alert('Please enter a valid email address.');
      return;
    }

    // Call the AuthService to get user data by email
    this.authService.getUserByEmail(emailField).subscribe(
      (userData) => {
        if (userData) {
          this.userId = userData._id;
          this.populateUserData(userData);
          userNotFoundMessage.style.display = 'none';
        } else {
          this.clearUserData();
          userNotFoundMessage.style.display = 'block';
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
        this.clearUserData();
        userNotFoundMessage.style.display = 'block';
      }
    );
  }

  private populateUserData(user: any): void {
    (document.getElementById('username') as HTMLInputElement).value =
      user.username;
    (document.getElementById('password') as HTMLInputElement).value =
      user.password;
    (document.getElementById('contactNumber') as HTMLInputElement).value =
      user.contactNumber;
    (document.getElementById('address') as HTMLInputElement).value =
      user.address;
    (document.getElementById('communityName') as HTMLInputElement).value =
      user.communityName;

    // Enable the input fields
    this.enableInputs();
  }

  private clearUserData(): void {
    const inputs = [
      'username',
      'password',
      'contactNumber',
      'address',
      'communityName',
    ];
    inputs.forEach(
      (id) => ((document.getElementById(id) as HTMLInputElement).value = '')
    );
    this.disableInputs();
  }

  private enableInputs(): void {
    const inputs = [
      'username',
      'password',
      'contactNumber',
      'address',
      'communityName',
    ];
    inputs.forEach(
      (id) =>
        ((document.getElementById(id) as HTMLInputElement).disabled = false)
    );
  }

  private disableInputs(): void {
    const inputs = [
      'username',
      'password',
      'contactNumber',
      'address',
      'communityName',
    ];
    inputs.forEach(
      (id) =>
        ((document.getElementById(id) as HTMLInputElement).disabled = true)
    );
  }

  updateUser(event: Event): void {
    event.preventDefault();

    const username = (document.getElementById('username') as HTMLInputElement)
      .value;
    const password = (document.getElementById('password') as HTMLInputElement)
      .value;
    const contactNumber = (
      document.getElementById('contactNumber') as HTMLInputElement
    ).value;
    const address = (document.getElementById('address') as HTMLInputElement)
      .value;
    const communityName = (
      document.getElementById('communityName') as HTMLInputElement
    ).value;

    if (
      !username ||
      !password ||
      !contactNumber ||
      !address ||
      !communityName
    ) {
      alert('Please fill out all the fields before updating.');
      return;
    }

    // Check if the username is being changed
    this.authService.getUser(this.userId).subscribe((userData) => {
      if (userData.username !== username) {
        // Check if the new username is already taken
        this.authService.checkUsernameExists(username).subscribe((exists) => {
          if (exists) {
            alert(
              'This username is already taken. Please choose a different username.'
            );
          } else {
            this.performUpdateUser(
              username,
              password,
              contactNumber,
              address,
              communityName
            );
          }
        });
      } else {
        // Username remains the same, proceed with update
        this.performUpdateUser(
          username,
          password,
          contactNumber,
          address,
          communityName
        );
      }
    });
  }

  private performUpdateUser(
    username: string,
    password: string,
    contactNumber: string,
    address: string,
    communityName: string
  ): void {
    const userData = {
      username,
      password,
      contactNumber,
      address,
      communityName,
    };

    this.authService.updateUser(this.userId, userData).subscribe(
      () => {
        alert('User updated successfully!');
        this.clearUserData(); // Optionally clear fields after update
      },
      (error) => {
        console.error('Error updating user:', error);
        alert('Error updating user data.');
      }
    );
  }

  sendNotification(): void {
    const titleInput = (document.getElementById('title') as HTMLInputElement)
      .value;
    const messageInput = (
      document.getElementById('notification') as HTMLInputElement
    ).value;

    if (!titleInput || !messageInput) {
      alert('Please fill out both title and message fields.');
      return;
    }

    const notificationData = {
      title: titleInput,
      message: messageInput,
      adminId: this.userId,
    };

    this.authService.sendNotification(notificationData).subscribe(
      () => {
        this.showOverlay();
        (document.getElementById('title') as HTMLInputElement).value = '';
        (document.getElementById('notification') as HTMLInputElement).value =
          '';
      },
      (error) => {
        console.error('Error sending notification:', error);
        alert('Failed to send notification.');
      }
    );
  }

  showOverlay(): void {
    const overlay = document.getElementById('overlay') as HTMLElement;
    overlay.style.display = 'flex';
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 1000);
  }

  // Sorting for history section
  sortUserActivity(key: string): void {
    this.userActivitySortKey = key;
    this.userActivitySortOrder =
      this.userActivitySortOrder === 'asc' ? 'desc' : 'asc';

    this.userActivity.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (this.userActivitySortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  // Sorting for history section
  sortSchedule(key: string): void {
    this.scheduleSortKey = key;
    this.scheduleSortOrder = this.scheduleSortOrder === 'asc' ? 'desc' : 'asc';

    this.schedules.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (this.scheduleSortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  // Sorting for reportIssue section
  sortReportIssue(key: string): void {
    this.reportIssueSortKey = key;
    this.reportIssueSortOrder =
      this.reportIssueSortOrder === 'asc' ? 'desc' : 'asc';

    this.reports.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (this.reportIssueSortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }
}
