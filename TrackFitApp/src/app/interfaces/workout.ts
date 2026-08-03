export interface Workout {
  workoutId?: number;
  userId?: number;
  exerciseName: string;
  duration: number;
  caloriesBurned?: number;
  workoutDate?: string;
}

export interface PlanExercise {
  name: string;
  sets: number;
  reps: string;
  restTime: string;

  
  bestTime: string;
  difficulty: string;
  whyThisEx: string;
}

export interface WorkoutPlanDay {
  day: string;
  dayName: string;

  
  focus: string;

  isRestDay: boolean;
  exercises: PlanExercise[];
}
