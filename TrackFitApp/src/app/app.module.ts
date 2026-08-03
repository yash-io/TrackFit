import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CommonService } from './services/common.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';
import { HealthDashboardComponent } from './health-dashboard/health-dashboard.component';
import { HomeComponent } from './home/home.component';
import { StreakDetailsComponent } from './streak-details/streak-details.component';
import { NavbarComponent } from './navbar/navbar.component';
import { GoalComponent } from './goal/goal.component';
import { LogMealComponent } from './log-meal/log-meal.component';
import { WaterComponent } from './water/water.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { HelpComponent } from './help/help.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { DeleteAccountComponent } from './delete-account/DeleteAccountComponent';
import { ContactSupportComponent } from './contact-support/ContactSupportComponent';
import { FaqComponent } from './faq/faq.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { LearnComponent } from './learn/learn.component';
import { LearnDetailsComponent } from './learn-details/learn-details.component';
import { ReminderComponent } from './reminder/reminder.component';
import { ProgressReportComponent } from './progress-report/progress-report.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminActiveusersComponent } from './admin-activeusers/admin-activeusers.component';
import { AdminFeedbackComponent } from './admin-feedback/admin-feedback.component';
import { AdminActivityComponent } from './admin-activity/admin-activity.component';
import { SleepTrackerComponent } from './sleep-tracker/sleep-tracker.component';
import { LoginComponent } from './login/login.component';
import { ChatbotComponent } from './chatbot/chatbot.component';


@NgModule({
  declarations: [
    AppComponent, FeedbackFormComponent,
    HealthDashboardComponent,
    HomeComponent,
    StreakDetailsComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    UserProfileComponent,
    LogMealComponent,
    AboutUsComponent,
    HelpComponent,
    NotificationsComponent,
    FaqComponent,
    DeleteAccountComponent,
    ContactSupportComponent,
    UserProfileComponent,
    GoalComponent,
    WaterComponent,
    ViewProfileComponent,
    CalendarComponent,
    ChangePasswordComponent,
    LearnComponent,
    LearnDetailsComponent,
    LeaderboardComponent,
    ReminderComponent,
    ProgressReportComponent,
    AdminHomeComponent,
    AdminUsersComponent,
    AdminActiveusersComponent,
    AdminFeedbackComponent,
    AdminActivityComponent,
    SleepTrackerComponent,
    ChatbotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    CommonModule
  ],
  providers: [CommonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
