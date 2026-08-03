import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AppComponent } from './app.component';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';
import { HealthDashboardComponent } from './health-dashboard/health-dashboard.component';
import { HomeComponent } from './home/home.component';
import { StreakDetailsComponent } from './streak-details/streak-details.component';
import { AuthGuard } from './services/auth.guard';
import { LogMealComponent } from './log-meal/log-meal.component';
import { GoalComponent } from './goal/goal.component';
import { WaterComponent } from './water/water.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HelpComponent } from './help/help.component';
import { ContactSupportComponent } from './contact-support/ContactSupportComponent';
import { DeleteAccountComponent } from './delete-account/DeleteAccountComponent';
import { FaqComponent } from './faq/faq.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { CalendarComponent } from './calendar/calendar.component'
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { LearnComponent } from './learn/learn.component';
import { LearnDetailsComponent } from './learn-details/learn-details.component';
import { ReminderComponent } from './reminder/reminder.component'
import { ProgressReportComponent } from './progress-report/progress-report.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminActiveusersComponent } from './admin-activeusers/admin-activeusers.component';
import { AdminFeedbackComponent } from './admin-feedback/admin-feedback.component';
import { AdminActivityComponent } from './admin-activity/admin-activity.component';
import { SleepTrackerComponent } from './sleep-tracker/sleep-tracker.component';
import { LoginComponent } from './login/login.component';



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminHomeComponent, canActivate: [AuthGuard] },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [AuthGuard] },
  { path: 'admin/active-users', component: AdminActiveusersComponent, canActivate: [AuthGuard] },
  { path: 'admin/feedback', component: AdminFeedbackComponent, canActivate: [AuthGuard] },
  { path: 'admin/activity', component: AdminActivityComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'log-meal', component: LogMealComponent, canActivate: [AuthGuard] },
  { path: 'feedback', component: FeedbackFormComponent, canActivate: [AuthGuard] },
  { path: 'healthDashboard', component: HealthDashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'goal', component: GoalComponent, canActivate: [AuthGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'view-profile', component: ViewProfileComponent, canActivate: [AuthGuard] },
  { path: 'streak', component: StreakDetailsComponent, canActivate: [AuthGuard] },
  { path: 'water', component: WaterComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutUsComponent, canActivate: [AuthGuard] },
  { path: 'help', component: HelpComponent, canActivate: [AuthGuard] },
  { path: 'contact-support', component: ContactSupportComponent },
  { path: 'delete-account', component: DeleteAccountComponent, canActivate: [AuthGuard] },
  { path: 'faq', component: FaqComponent, canActivate: [AuthGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'learn', component: LearnComponent, canActivate: [AuthGuard] },
  { path: 'learn/:id', component: LearnDetailsComponent, canActivate: [AuthGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ProgressReportComponent, canActivate: [AuthGuard] },
  { path: 'reminder', component: ReminderComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationsComponent },
  {path: 'sleep', component: SleepTrackerComponent, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
