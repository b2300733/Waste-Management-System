import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/check-email?email=${email}`);
  }

  checkUsernameExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.baseUrl}/check-username?username=${username}`
    );
  }

  signup(userData: { username: string; email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/signup`, userData);
  }

  login(loginData: { email: string; password: string }) {
    return this.http.post<{ message: string; userId: string }>(
      `${this.baseUrl}/login`,
      loginData
    );
  }

  getUser(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/${userId}`);
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user?email=${email}`);
  }

  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/${userId}`, userData);
  }

  getUserActivity(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user-activity`);
  }

  schedulePickup(scheduleData: {
    date: string;
    pickupTime: string;
    wasteType: string;
    userId: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/schedule`, scheduleData);
  }

  updateSchedule(
    scheduleId: string,
    updateData: { status: string }
  ): Observable<any> {
    return this.http.put(`${this.baseUrl}/schedule/${scheduleId}`, updateData);
  }

  getSchedules(
    startDate: string,
    endDate: string,
    wasteType: string,
    userId: string,
    onlyCurrentUser: boolean
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/schedule?startDate=${startDate}&endDate=${endDate}&wasteType=${wasteType}&userId=${userId}&onlyCurrentUser=${onlyCurrentUser}`
    );
  }

  getSchedulesById(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/schedules/${userId}`);
  }

  getAllSchedules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/schedule/all`);
  }

  getUserSchedules(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/schedule/user/${userId}`);
  }

  getPickupStatistics(startDate: string, endDate: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/pickup-statistics?startDate=${startDate}&endDate=${endDate}`
    );
  }

  getReportIssues(startDate: string, endDate: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/report-issues?startDate=${startDate}&endDate=${endDate}`
    );
  }

  getAllReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/report-issues/all`);
  }

  sendNotification(notificationData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/notifications`, notificationData);
  }

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notifications`);
  }
}
