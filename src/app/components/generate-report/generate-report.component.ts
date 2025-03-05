import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.css'],
  animations: [
    trigger('expandCollapse', [
      state(
        'expanded',
        style({
          height: '*',
          opacity: 1,
          visibility: 'visible',
        })
      ),
      state(
        'collapsed',
        style({
          height: '0px',
          opacity: 0,
          visibility: 'hidden',
        })
      ),
      transition('expanded <=> collapsed', [animate('500ms ease-in-out')]),
    ]),
  ],
})
export class GenerateReportComponent implements OnInit {
  reportTypeArray: string[] = ['Pickup Statistics', 'Report Issues'];

  selectedReportType: string = '';

  totalPickups = 0;
  successfulPickups = 0;
  missedPickups = 0;

  issuesReported = {
    'Missed Pickup': 0,
    'Overflowing Bin': 0,
    'Illegal Dumping': 0,
    Other: 0,
  };

  startDate: Date | null = null;
  endDate: Date | null = null;

  displayedColumns: string[] = ['metric', 'value'];
  dataSource = new MatTableDataSource();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  generateReport(): void {
    if (!this.startDate || !this.endDate || !this.selectedReportType) {
      alert('Please select a date range and report type.');
      return;
    }

    const startDateString = this.startDate.toISOString();
    const endDateString = this.endDate.toISOString();

    if (this.selectedReportType === 'Pickup Statistics') {
      this.authService
        .getPickupStatistics(startDateString, endDateString)
        .subscribe(
          (data) => {
            this.totalPickups = data.totalPickups;
            this.successfulPickups = data.successfulPickups;
            this.missedPickups = data.missedPickups;

            this.dataSource.data = [
              { metric: 'Total Pickups', value: this.totalPickups },
              { metric: 'Successful Pickups', value: this.successfulPickups },
              { metric: 'Missed Pickups', value: this.missedPickups },
            ];
          },
          (error) => {
            console.error('Error fetching pickup statistics:', error);
          }
        );
    } else if (this.selectedReportType === 'Report Issues') {
      this.authService
        .getReportIssues(startDateString, endDateString)
        .subscribe(
          (data) => {
            this.issuesReported = data;

            this.dataSource.data = [
              {
                metric: 'Missed Pickup',
                value: this.issuesReported['Missed Pickup'],
              },
              {
                metric: 'Overflowing Bin',
                value: this.issuesReported['Overflowing Bin'],
              },
              {
                metric: 'Illegal Dumping',
                value: this.issuesReported['Illegal Dumping'],
              },
              { metric: 'Other', value: this.issuesReported['Other'] },
            ];
          },
          (error) => {
            console.error('Error fetching report issues:', error);
          }
        );
    }
  }

  resetFilters() {
    this.startDate = null;
    this.endDate = null;
    this.selectedReportType = '';
    this.dataSource.data = [];
    this.totalPickups = 0;
    this.successfulPickups = 0;
    this.missedPickups = 0;
    this.issuesReported = {
      'Missed Pickup': 0,
      'Overflowing Bin': 0,
      'Illegal Dumping': 0,
      Other: 0,
    };
  }

  printReport() {
    window.print();
  }
}
