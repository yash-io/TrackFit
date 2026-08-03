
export interface CalendarDay {
  date: string;
  hasWorkout: boolean;
  hasWaterIntake: boolean;
  hasGoalDeadline: boolean;
  hasStreak: boolean;
  hasSleep: boolean;
  totalWaterMl: number;
  totalCalories: number;
  workoutCount: number;
  sleepHours: number;
  currentStreak: number;
  exercises: string[];
  goalTypes: string[];
}

export interface CalendarCell {
  day: number | null;
  dateStr: string;
  isToday: boolean;
  data: CalendarDay | null;
}
