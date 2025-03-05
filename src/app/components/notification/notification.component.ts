import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  notifications: any[] = [];
  schedules: any[] = [];
  userId: string | null = localStorage.getItem('userId');

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadNotifications();
    if (this.userId) {
      this.loadSchedules(this.userId);
    }
  }

  loadNotifications(): void {
    this.authService.getNotifications().subscribe(
      (data) => {
        this.notifications = data.map((notification) => ({
          ...notification,
          createdAt: new Date(
            new Date(notification.createdAt).getTime() - 8 * 60 * 60 * 1000
          ), // Subtract 8 hours
        }));
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }

  loadSchedules(userId: string): void {
    this.authService.getSchedulesById(userId).subscribe(
      (data) => {
        this.schedules = data.map((schedule) => ({
          ...schedule,
          date: new Date(schedule.date),
          createdAt: new Date(
            new Date(schedule.createdAt).getTime() - 8 * 60 * 60 * 1000
          ),
        }));
      },
      (error) => {
        console.error('Error fetching schedules:', error);
      }
    );
  }
}
