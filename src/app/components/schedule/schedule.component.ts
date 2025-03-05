// app.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent {
  // Scheduling variables
  pickupDate: string = '';
  pickupTime: string = '';
  wasteType: string = '';
  userId: string = '';
  minDate: string = '';
  availableTimes: string[] = ['9:00 AM', '12:00 PM', '3:00 PM'];
  wasteTypes: string[] = [
    'Household Waste',
    'Recyclable Waste',
    'Hazardous Waste',
  ];

  // Confirmation message
  confirmationMessage: string = '';

  constructor(private authService: AuthService) {
    this.userId = localStorage.getItem('userId') || '';
    this.setMinDate();
  }

  setMinDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;
  }

  isPastDate(date: string): boolean {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  }

  schedulePickup() {
    if (this.isPastDate(this.pickupDate)) {
      alert('Selected date is in the past. Please choose a valid date.');
      return;
    }

    if (this.pickupDate && this.pickupTime && this.wasteType && this.userId) {
      const scheduleData = {
        date: this.pickupDate,
        pickupTime: this.pickupTime,
        wasteType: this.wasteType,
        userId: this.userId,
      };

      this.authService.schedulePickup(scheduleData).subscribe({
        next: (response) => {
          this.confirmationMessage = response.message;
          this.resetForm();
        },
        error: (err) => {
          console.error('Scheduling failed:', err);
          alert('Scheduling failed. Please try again.');
        },
      });
    } else {
      alert('Please fill out all fields.');
    }
  }

  resetForm() {
    this.pickupDate = '';
    this.pickupTime = '';
    this.wasteType = '';
  }
}
