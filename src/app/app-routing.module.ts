import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { GenerateReportComponent } from './components/generate-report/generate-report.component';
import { NotificationComponent } from './components/notification/notification.component';
import { PickupHistoryComponent } from './components/pickup-history/pickup-history.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ReportComponent } from './components/report/report.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: 'header', component: HeaderComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'generate-report', component: GenerateReportComponent },
  { path: 'notification', component: NotificationComponent },
  { path: 'pickup-history', component: PickupHistoryComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'report', component: ReportComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
