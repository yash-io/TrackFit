import { Component, OnInit } from '@angular/core';
import { GoalService } from '../services/goal.service';
import { WorkoutService } from '../services/workout.service';
import { Goal } from '../interfaces/goal';
import { Workout, WorkoutPlanDay } from '../interfaces/workout';


@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.css']
})
export class GoalComponent implements OnInit {
  goals: Goal[] = [];
  isGoalFormVisible = false;
  isGoalEditMode = false;
  currentGoal: Goal = {
    goalType: '', targetValue: 0, deadline: '', status: 'In Progress'
  };

  goalTypes: string[] = [
    'Weight Loss', 'Weight Gain', 'Muscle Building',
    //'Flexibility & Mobility',
    'Stamina Improvement', 'Daily Steps'
  ];

  expandedGoalId: number | null = null;
  activeTab: 'workout' | 'plan' = 'workout';

  workoutsByGoal: { [goalId: number]: Workout[] } = {};
  isWorkoutFormVisible: { [goalId: number]: boolean } = {};
  isWorkoutEditMode = false;
  currentWorkout: Workout = { exerciseName: '', duration: 0 };

  exerciseOptions: { [key: string]: string[] } = {
    'Weight Loss': ['Jogging', 'Cycling', 'Jump Rope', 'Burpees', 'Walking', 'HIIT'],
    'Weight Gain': ['Pull-ups', 'Push-ups', 'Deadlift', 'Squats', 'Bench Press'],
    'Muscle Building': ['Bench Press', 'Deadlift', 'Pull-ups', 'Squats', 'Shoulder Press'],
   // 'Flexibility & Mobility': ['Yoga', 'Stretching', 'Pilates', 'Foam Rolling', 'Meditation'],
    'Stamina Improvement': ['Running', 'Swimming', 'Cycling', 'Jump Rope', 'HIIT'],
    'Daily Steps': ['Walking', 'Hiking', 'Jogging', 'Stair Climbing', 'Treadmill']
  };

  planByGoal: { [goalId: number]: WorkoutPlanDay[] } = {};

  message = '';
  isSuccess = false;

  constructor(
    private goalService: GoalService,
    private workoutService: WorkoutService
  ) { }

  ngOnInit(): void {
   
    console.log('User', this.getUserId());
    this.loadGoals();
  }

  getUserId(): number {
    return parseInt(localStorage.getItem('userId') || '0');
  }

 
  loadGoals(): void {
    this.goalService.getGoalsByUser(this.getUserId()).subscribe({
      next: (data) => { this.goals = data; },
      error: () => this.showMessage('Error loading goals', false)
    });
  }

  showAddGoalForm(): void {
    this.isGoalFormVisible = true;
    this.isGoalEditMode = false;
    this.currentGoal = {
      goalType: '', targetValue: 0, deadline: '', status: 'In Progress'
    };
  }

  editGoal(goal: Goal): void {
    this.isGoalFormVisible = true;
    this.isGoalEditMode = true;
    this.currentGoal = { ...goal };
  }

  cancelGoalForm(): void {
    this.isGoalFormVisible = false;
  }

  saveGoal(): void {
    this.currentGoal.userId = this.getUserId();

    if (this.isGoalEditMode) {
      this.goalService.updateGoal(this.currentGoal).subscribe({
        next: (r) => {
          if (r === 1) {
            this.showMessage('Goal updated!', true);
            this.loadGoals();
            this.isGoalFormVisible = false;
          }
        },
        error: () => this.showMessage('Error updating goal', false)
      });
    } else {
      this.goalService.addGoal(this.currentGoal).subscribe({
        next: (r) => {
          if (r === 1) {
            this.showMessage('Goal added!', true);
            this.loadGoals();
            this.isGoalFormVisible = false;
          }
        },
        error: () => this.showMessage('Error adding goal', false)
      });
    }
  }

  deleteGoal(goalId: number): void {
    if (!confirm('Delete this goal?')) return;
    this.goalService.deleteGoal(goalId).subscribe({
      next: (r) => {
        if (r === 1) {
          this.showMessage('Goal deleted!', true);
          this.loadGoals();
          if (this.expandedGoalId === goalId) this.expandedGoalId = null;
        }
      },
      error: () => this.showMessage('Error deleting goal', false)
    });
  }

  markComplete(goalId: number): void {
    this.goalService.markGoalComplete(goalId).subscribe({
      next: (r) => {
        if (r === 1) {
          this.showMessage('Goal completed! 🎉', true);
          this.loadGoals();
        }
      },
      error: () => this.showMessage('Error updating goal', false)
    });
  }

  
  getProgress(goal: Goal): number {
    if (!goal.targetValue || goal.targetValue === 0) return 0;
    const workouts = this.workoutsByGoal[goal.goalId!] || [];
    const totalMinutes = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);

    switch (goal.goalType) {
      case 'Daily Steps':
        
        return Math.min(Math.round((workouts.length / 30) * 100), 100);
      default:
        return Math.min(
          Math.round((totalMinutes / (goal.targetValue * 10)) * 100), 100
        );
    }
  }


  toggleGoalExpand(goal: Goal): void {
    if (this.expandedGoalId === goal.goalId) {
      this.expandedGoalId = null;
      return;
    }
    this.expandedGoalId = goal.goalId!;
    this.activeTab = 'workout';
    this.loadWorkoutsForGoal(goal);
  }

  setTab(tab: 'workout' | 'plan', goal: Goal): void {
    this.activeTab = tab;
    if (tab === 'plan') {
      this.loadPlanForGoal(goal);
    }
  }


  loadWorkoutsForGoal(goal: Goal): void {
    this.workoutService
      .getWorkoutsByGoalType(this.getUserId(), goal.goalType)
      .subscribe({
        next: (data) => {
          this.workoutsByGoal[goal.goalId!] = data;
        },
        error: () => this.showMessage('Error loading workouts', false)
      });
  }

  getExercisesForGoal(goalType: string): string[] {
    return this.exerciseOptions[goalType] || [];
  }

  showAddWorkoutForm(goalId: number): void {
    this.isWorkoutFormVisible[goalId] = true;
    this.isWorkoutEditMode = false;
    this.currentWorkout = { exerciseName: '', duration: 0 };
  }

  editWorkout(workout: Workout, goalId: number): void {
    this.isWorkoutFormVisible[goalId] = true;
    this.isWorkoutEditMode = true;
    this.currentWorkout = { ...workout };
  }

  cancelWorkoutForm(goalId: number): void {
    this.isWorkoutFormVisible[goalId] = false;
  }

  saveWorkout(goal: Goal): void {
    this.currentWorkout.userId = this.getUserId();

    if (this.isWorkoutEditMode) {
      this.workoutService.updateWorkout(this.currentWorkout).subscribe({
        next: (r) => {
          if (r === 1) {
            this.showMessage('Workout updated!', true);
            this.loadWorkoutsForGoal(goal);
            this.isWorkoutFormVisible[goal.goalId!] = false;
          }
        },
        error: () => this.showMessage('Error updating workout', false)
      });
    } else {
      this.workoutService.addWorkout(this.currentWorkout).subscribe({
        next: (r) => {
          if (r === 1) {
            this.showMessage('Workout logged! 💪', true);
            this.loadWorkoutsForGoal(goal);
            this.isWorkoutFormVisible[goal.goalId!] = false;
          }
        },
        error: () => this.showMessage('Error adding workout', false)
      });
    }
  }

  deleteWorkout(workoutId: number, goal: Goal): void {
    if (!confirm('Delete this workout?')) return;
    this.workoutService.deleteWorkout(workoutId).subscribe({
      next: (r) => {
        if (r === 1) {
          this.showMessage('Workout deleted!', true);
          this.loadWorkoutsForGoal(goal);
        }
      },
      error: () => this.showMessage('Error deleting workout', false)
    });
  }


  loadPlanForGoal(goal: Goal): void {
    if (this.planByGoal[goal.goalId!]) return; 
    this.workoutService.generatePlan(goal.goalType).subscribe({
      next: (data) => {
        this.planByGoal[goal.goalId!] = data;
      },
      error: () => this.showMessage('Error loading plan', false)
    });
  }


  getPlaceholder(): string {
    switch (this.currentGoal.goalType) {
      case 'Weight Loss': return 'e.g. 5 (kg to lose)';
      case 'Weight Gain': return 'e.g. 4 (kg to gain)';
      case 'Muscle Building': return 'e.g. 75 (target body kg)';
    //  case 'Flexibility & Mobility': return 'e.g. 45 (minutes/session)';
      case 'Stamina Improvement': return 'e.g. 30 (minutes/day)';
      case 'Daily Steps': return 'e.g. 8000 (steps/day)';
      default: return 'Enter target value';
    }
  }

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getHint(): string {
    switch (this.currentGoal.goalType) {
      case 'Weight Loss': return '💡 How many KG to lose?';
      case 'Weight Gain': return '💡 How many KG to gain?';
      case 'Muscle Building': return '💡 Target body weight in KG?';
     // case 'Flexibility & Mobility': return '💡 Target minutes per session?';
      case 'Stamina Improvement': return '💡 Target workout minutes per day?';
      case 'Daily Steps': return '💡 Target steps per day?';
      default: return '';
    }
  }

  showMessage(msg: string, success: boolean): void {
    this.message = msg;
    this.isSuccess = success;
    setTimeout(() => { this.message = ''; }, 3000);
  }
  getGoalIcon(goalType: string): string {
    switch (goalType) {
      case 'Weight Loss': return '⚖️';
      case 'Weight Gain': return '💪';
      case 'Muscle Building': return '🏋️';
     // case 'Flexibility & Mobility': return '🧘';
      case 'Stamina Improvement': return '🏃';
      case 'Daily Steps': return '👣';
      default: return '🎯';
    }
  }

}
