import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReminderService } from '../services/reminder.service';
import { Reminder } from '../interfaces/reminder';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css']
})
export class ReminderComponent implements OnInit, OnDestroy {

  reminders: Reminder[] = [];
  isFormVisible = false;
  isEditMode = false;
  message = '';
  isSuccess = false;

  toastVisible = false;
  toastMessage = '';
  toastIcon = '';

  private timerInterval: any;

  timeSuggestions: string[] = [];

  reminderTypes = [
    { value: 'Water', label: '💧 Water Reminder' },
    { value: 'Workout', label: '🏋️ Workout Reminder' },
    { value: 'Goal', label: '🎯 Goal Reminder' },
    { value: 'Custom', label: '✍️ Custom Reminder' }
  ];

  currentReminder: Reminder = {
    title: '', reminderText: '',
    reminderTime: '', reminderType: ''
  };

  constructor(private reminderService: ReminderService) { }

  ngOnInit(): void {
    this.loadReminders();
    this.startReminderTimer();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  getUserId(): number {
    return parseInt(localStorage.getItem('userId') || '0');
  }

  loadReminders(): void {
    this.reminderService.getRemindersByUser(this.getUserId()).subscribe({
      next: (data) => { this.reminders = data; },
      error: () => this.showMessage('Error loading reminders', false)
    });
  }

  showAddForm(): void {
    this.isFormVisible = true;
    this.isEditMode = false;
    this.timeSuggestions = [];
    this.currentReminder = {
      title: '', reminderText: '',
      reminderTime: '', reminderType: ''
    };
  }

  editReminder(r: Reminder): void {
    this.isFormVisible = true;
    this.isEditMode = true;
    this.currentReminder = { ...r };
    this.onTypeChange(r.reminderType);
  }

  cancelForm(): void {
    this.isFormVisible = false;
    this.timeSuggestions = [];
  }

  
  onTypeChange(type: string): void {
    switch (type) {
      case 'Water':
        this.timeSuggestions = [
          '08:00', '10:00', '12:00',
          '14:00', '16:00', '18:00'
        ];
        if (!this.currentReminder.title)
          this.currentReminder.title = 'Drink Water';
        if (!this.currentReminder.reminderText)
          this.currentReminder.reminderText = 'Stay hydrated! 💧';
        break;

      case 'Workout':
        this.timeSuggestions = [
          '06:00', '07:00', '08:00',
          '17:00', '18:00', '19:00'
        ];
        if (!this.currentReminder.title)
          this.currentReminder.title = 'Workout Time';
        if (!this.currentReminder.reminderText)
          this.currentReminder.reminderText = 'Time to workout! 💪';
        break;

      case 'Goal':
        this.timeSuggestions = [
          '09:00', '12:00', '20:00', '21:00'
        ];
        if (!this.currentReminder.title)
          this.currentReminder.title = 'Check Your Goals';
        if (!this.currentReminder.reminderText)
          this.currentReminder.reminderText = 'Review your progress! 🎯';
        break;

      case 'Custom':
        this.timeSuggestions = [];
        break;

      default:
        this.timeSuggestions = [];
    }
  }

  applySuggestion(time: string): void {
    const today = new Date().toISOString().split('T')[0];
    this.currentReminder.reminderTime = today + 'T' + time;
  }

  saveReminder(): void {
    this.currentReminder.userId = this.getUserId();

    if (this.isEditMode) {
      this.reminderService.updateReminder(this.currentReminder).subscribe({
        next: (r) => {
          if (r === 1) {
            this.showMessage('Reminder updated! ✅', true);
            this.loadReminders();
            this.isFormVisible = false;
          }
        },
        error: () => this.showMessage('Error updating reminder', false)
      });
    } else {
      this.reminderService.addReminder(this.currentReminder).subscribe({
        next: (r) => {
          if (r === 1) {
            this.showMessage('Reminder created! 🔔', true);
            this.loadReminders();
            this.isFormVisible = false;
          }
        },
        error: () => this.showMessage('Error adding reminder', false)
      });
    }
  }
  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  deleteReminder(reminderId: number): void {
    if (!confirm('Delete this reminder?')) return;
    this.reminderService.deleteReminder(reminderId).subscribe({
      next: (r) => {
        if (r === 1) {
          this.showMessage('Reminder deleted!', true);
          this.loadReminders();
        }
      },
      error: () => this.showMessage('Error deleting', false)
    });
  }

  markComplete(reminderId: number): void {
    this.reminderService.markComplete(reminderId).subscribe({
      next: (r) => {
        if (r === 1) {
          this.showMessage('Marked as completed! ✅', true);
          this.loadReminders();
        }
      },
      error: () => this.showMessage('Error updating', false)
    });
  }

  
  startReminderTimer(): void {
    this.timerInterval = setInterval(() => {
      this.checkReminders();
    }, 60000); 
  }

  checkReminders(): void {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    this.reminders.forEach(r => {
      if (!r.isCompleted && r.isActive && r.reminderTime) {
        const reminderDate = new Date(r.reminderTime);
        const reminderHour = reminderDate.getHours();
        const reminderMinute = reminderDate.getMinutes();

        if (currentHour === reminderHour &&
          currentMinute === reminderMinute) {
          this.triggerToast(r);
        }
      }
    });
  }

  triggerToast(reminder: Reminder): void {
    this.toastIcon = this.getTypeIcon(reminder.reminderType);
    this.toastMessage = reminder.title + ' — ' + reminder.reminderText;
    this.toastVisible = true;

    setTimeout(() => { this.toastVisible = false; }, 5000);
  }

  dismissToast(): void {
    this.toastVisible = false;
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'Water': return '💧';
      case 'Workout': return '🏋️';
      case 'Goal': return '🎯';
      case 'Custom': return '✍️';
      default: return '🔔';
    }
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'Water': return 'type-water';
      case 'Workout': return 'type-workout';
      case 'Goal': return 'type-goal';
      case 'Custom': return 'type-custom';
      default: return 'type-custom';
    }
  }

  getNextReminder(): Reminder | null {
    const now = new Date();
    const upcoming = this.reminders
      .filter(r => !r.isCompleted &&
        r.reminderTime &&
        new Date(r.reminderTime) > now)
      .sort((a, b) =>
        new Date(a.reminderTime).getTime() -
        new Date(b.reminderTime).getTime()
      );
    return upcoming.length > 0 ? upcoming[0] : null;
  }

  getPendingCount(): number {
    return this.reminders.filter(r => !r.isCompleted).length;
  }

  showMessage(msg: string, success: boolean): void {
    this.message = msg;
    this.isSuccess = success;
    setTimeout(() => { this.message = ''; }, 3000);
  }
}
