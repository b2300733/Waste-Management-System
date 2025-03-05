// app.component.ts
import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent {
  // Issue reporting variables
  issueType: string = '';
  location: string = '';
  description: string = '';
  photo: File | null = null;

  // Issue types array
  issueTypes: string[] = [
    'Missed Pickup',
    'Overflowing Bin',
    'Illegal Dumping',
    'Other',
  ];

  // Confirmation message
  confirmationMessage: string = '';

  @ViewChild('fileInput') fileInput: any;

  constructor(private http: HttpClient) {}

  // Handle file selection
  onFileSelected(event: any) {
    this.photo = event.target.files[0];
  }

  // Submit the report
  submitReport() {
    if (this.issueType && this.location && this.description) {
      const formData = new FormData();
      formData.append('issueType', this.issueType);
      formData.append('location', this.location);
      formData.append('description', this.description);

      const userId = localStorage.getItem('userId');
      if (userId) {
        formData.append('userId', userId);
      } else {
        alert('User ID not found. Please log in and try again.');
        return;
      }

      if (this.photo) {
        formData.append('photo', this.photo); // Append the photo file
      }

      this.http.post('http://localhost:3000/api/report', formData).subscribe({
        next: (response: any) => {
          this.confirmationMessage = 'Report has been successfully submitted!';
          this.resetForm();
        },
        error: (err) => {
          console.error('Error reporting issue:', err);
          alert('Failed to report the issue. Please try again.');
        },
      });
    } else {
      alert('Please fill out all required fields.');
    }
  }
  resetForm() {
    this.issueType = '';
    this.location = '';
    this.description = '';
    this.photo = null;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''; // Reset the file input value
    }
  }
}
