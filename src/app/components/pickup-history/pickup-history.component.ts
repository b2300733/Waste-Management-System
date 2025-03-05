// app.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pickup-history',
  templateUrl: './pickup-history.component.html',
  styleUrls: ['./pickup-history.component.css'],
})
export class PickupHistoryComponent {
  disableScroll() {
    document.body.style.overflow = 'hidden';
  }
  // Pickup History variables
  pickupHistory: any[] = [];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filters = {
    startDate: '',
    endDate: '',
    wasteType: '',
    onlyCurrentUser: true,
  };

  // Waste types array
  wasteTypes: string[] = [
    'All',
    'Household Waste',
    'Recyclable Waste',
    'Hazardous Waste',
  ];

  constructor(private authService: AuthService) {} // Inject your service

  // Apply filters to pickup history
  applyFilters() {
    if (
      !this.filters.startDate ||
      !this.filters.endDate ||
      !this.filters.wasteType
    ) {
      alert('Please select both start, end dates and waste type.');
      return;
    }

    const userId = localStorage.getItem('userId');

    this.authService
      .getSchedules(
        this.filters.startDate,
        this.filters.endDate,
        this.filters.wasteType,
        userId!,
        this.filters.onlyCurrentUser
      )
      .subscribe(
        (data) => {
          this.pickupHistory = data;
          // Log the fetched pickup history for debugging
          console.log('Pickup History:', this.pickupHistory);
        },
        (error) => {
          console.error('Error fetching pickup history:', error);
          alert('Could not fetch pickup history.');
        }
      );
  }

  // Function to sort data based on the selected column
  sortBy(column: string) {
    if (this.sortColumn === column) {
      // Toggle direction if the same column is clicked
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new column and default direction to ascending
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.pickupHistory = this.pickupHistory.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Method to handle changes to the start date
  onStartDateChange() {
    if (
      this.filters.endDate &&
      new Date(this.filters.endDate) < new Date(this.filters.startDate)
    ) {
      this.filters.endDate = '';
    }
  }
}
