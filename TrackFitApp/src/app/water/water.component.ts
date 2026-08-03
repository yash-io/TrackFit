import { Component, OnInit } from '@angular/core';
import { WaterService } from '../services/water.service';
import { WaterIntake, HydrationSuggestion } from '../interfaces/water';


@Component({
  selector: 'app-water',
  templateUrl: './water.component.html',
  styleUrls: ['./water.component.css']
})
export class WaterComponent implements OnInit{
  waterHistory: WaterIntake[] = [];
  todayEntries: WaterIntake[] = [];
  recommended: number = 2000;

  quantityMl: number = 0;
  isEditMode: boolean = false;
  editingWater: WaterIntake | null = null;

  wakeUpTime: string = '';
  sleepTime: string = '';
  breakfastTime: string = '';
  lunchTime: string = '';
  dinnerTime: string = '';
  showTimingForm: boolean = false;

  suggestions: HydrationSuggestion[] = [];

  message: string = '';
  isSuccess: boolean = false;

  showHistory: boolean = false;

  constructor(private waterService: WaterService) { }

  ngOnInit(): void {
    this.loadTodayWater();
    this.loadRecommended();
    this.loadHistory();
    this.generateDefaultSuggestions();
  }

  getUserId(): number {
    return parseInt(localStorage.getItem('userId') || '0');
  }


  loadTodayWater(): void {
    this.waterService.getTodayWater(this.getUserId()).subscribe({
      next: (data) => { this.todayEntries = data; },
      error: () => this.showMsg('Error loading today entries', false)
    });
  }

  loadHistory(): void {
    this.waterService.getWaterByUser(this.getUserId()).subscribe({
      next: (data) => { this.waterHistory = data; },
      error: () => this.showMsg('Error loading history', false)
    });
  }

  loadRecommended(): void {
    this.waterService.getRecommendedIntake(this.getUserId()).subscribe({
      next: (data) => { this.recommended = data.recommended; },
      error: () => { this.recommended = 2000; }
    });
  }


  addWater(): void {
    if (!this.quantityMl || this.quantityMl <= 0) {
      this.showMsg('Please enter a valid amount!', false);
      return;
    }

    if (this.isEditMode && this.editingWater) {
      this.editingWater.quantityMl = this.quantityMl;
      this.waterService.updateWater(this.editingWater).subscribe({
        next: (r) => {
          if (r === 1) {
            this.showMsg('Entry updated! 💧', true);
            this.resetForm();
            this.loadTodayWater();
            this.loadHistory();
          }
        },
        error: () => this.showMsg('Error updating entry', false)
      });
    } else {
      const water: WaterIntake = {
        userId: this.getUserId(),
        quantityMl: this.quantityMl
      };
      this.waterService.addWater(water).subscribe({
        next: (r) => {
          if (r === 1) {
            this.showMsg('Water logged successfully! 💧', true);
            this.resetForm();
            this.loadTodayWater();
            this.loadHistory();
          }
        },
        error: () => this.showMsg('Error adding water', false)
      });
    }
  }

  editEntry(entry: WaterIntake): void {
    this.isEditMode = true;
    this.editingWater = entry;
    this.quantityMl = entry.quantityMl;
  }

  deleteEntry(waterId: number): void {
    if (!confirm('Delete this entry?')) return;
    this.waterService.deleteWater(waterId).subscribe({
      next: (r) => {
        if (r === 1) {
          this.showMsg('Entry deleted!', true);
          this.loadTodayWater();
          this.loadHistory();
        }
      },
      error: () => this.showMsg('Error deleting entry', false)
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.quantityMl = 0;
    this.isEditMode = false;
    this.editingWater = null;
  }


  fillFromSuggestion(amount: number): void {
    this.quantityMl = amount;
    this.showMsg('Amount filled! Click Add Water to log. 💧', true);
  }

  generateDefaultSuggestions(): void {
    this.suggestions = [
      {
        icon: '🌅',
        title: 'Morning Start',
        subtitle: 'After waking up',
        amount: 250
      },
      {
        icon: '🍽️',
        title: 'Before Breakfast',
        subtitle: '30 min before breakfast',
        amount: 200
      },
      {
        icon: '☀️',
        title: 'Mid Morning',
        subtitle: 'Stay active and hydrated',
        amount: 300
      },
      {
        icon: '🥗',
        title: 'Before Lunch',
        subtitle: '30 min before lunch',
        amount: 200
      },
      {
        icon: '🌤️',
        title: 'Afternoon',
        subtitle: 'Beat the afternoon slump',
        amount: 350
      },
      {
        icon: '🍱',
        title: 'Before Dinner',
        subtitle: '30 min before dinner',
        amount: 200
      },
      {
        icon: '🌙',
        title: 'Night',
        subtitle: 'Before going to sleep',
        amount: 150
      }
    ];
  }

  generateTimedSuggestions(): void {
    this.suggestions = [];

    if (this.wakeUpTime) {
      this.suggestions.push({
        icon: '🌅',
        title: 'Morning Start',
        subtitle: 'At ' + this.wakeUpTime + ' after waking up',
        amount: 250
      });
    }

    if (this.breakfastTime) {
      this.suggestions.push({
        icon: '🍽️',
        title: 'Before Breakfast',
        subtitle: 'At ' + this.breakfastTime,
        amount: 200
      });
    }

    if (this.lunchTime) {
      this.suggestions.push({
        icon: '🥗',
        title: 'Before Lunch',
        subtitle: 'At ' + this.lunchTime,
        amount: 200
      });
    }

    if (this.dinnerTime) {
      this.suggestions.push({
        icon: '🍱',
        title: 'Before Dinner',
        subtitle: 'At ' + this.dinnerTime,
        amount: 200
      });
    }

    if (this.sleepTime) {
      this.suggestions.push({
        icon: '🌙',
        title: 'Before Sleep',
        subtitle: 'At ' + this.sleepTime,
        amount: 150
      });
    }

    if (this.suggestions.length === 0) {
      this.generateDefaultSuggestions();
    }

    this.showTimingForm = false;
    this.showMsg('Suggestions updated based on your timings! ✅', true);
  }


  getTodayTotal(): number {
    return this.todayEntries.reduce(
      (sum, e) => sum + (e.quantityMl || 0), 0
    );
  }

  showMsg(msg: string, success: boolean): void {
    this.message = msg;
    this.isSuccess = success;
    setTimeout(() => { this.message = ''; }, 3000);
  }


}
