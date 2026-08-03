export interface Reminder {
  reminderId?: number;
  userId?: number;
  title: string;
  reminderText: string;
  reminderTime: string;
  reminderType: string;
  isActive?: boolean;
  isCompleted?: boolean;
}
