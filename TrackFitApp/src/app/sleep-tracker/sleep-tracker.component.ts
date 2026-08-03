import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-sleep-tracker',
  templateUrl: './sleep-tracker.component.html',
  styleUrls: ['./sleep-tracker.component.css']
})
export class SleepTrackerComponent implements OnInit {

  userId: number = parseInt(localStorage.getItem('userId') || '0');

  // Form fields
  sleepHours: number | null = null;
  //maxDate: string = new Date().toISOString().split('T')[0];
  //sleepDate: string = new Date(Date.now()-86400000).toISOString().split('T')[0];
  yesterday: string = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  })();

  sleepDate: string = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  })();


  // View toggle: 'daily' | 'weekly'
  viewMode: string = 'daily';

  // Data
  allHistory: any[] = [];
  weeklyData: any[] = [];

  // Edit state
  editingId: number | null = null;
  editHours: number | null = null;

  // UI state
  successMsg: string = '';
  errorMsg: string = '';
  isLoading: boolean = false;

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.loadHistory();
    this.loadWeekly();
  }

  // ── Validation ──────────────────────────────
  isValidInput(): boolean {
    if (this.sleepHours === null || this.sleepHours === undefined) return false;
    if (isNaN(this.sleepHours)) return false;
    if (this.sleepHours <= 0 || this.sleepHours > 24) return false;
    if (!this.sleepDate) return false;
    return true;
  }

  // ── Add Sleep ────────────────────────────────
  addSleep(): void {
    this.clearMessages();

    if (!this.isValidInput()) {
      this.errorMsg = 'Please enter valid sleep hours (0.5 – 24) and a date.';
      return;
    }

    // Check for duplicate date
    const duplicate = this.allHistory.find(h =>
      h.sleepDate && h.sleepDate.split('T')[0] === this.sleepDate
    );
    if (duplicate) {
      this.errorMsg = 'Sleep already logged for this date. Please edit the existing entry.';
      return;
    }

    this.isLoading = true;
    this.commonService.AddSleep(this.userId, this.sleepHours!, this.sleepDate).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMsg = 'Sleep logged successfully!';
          this.sleepHours = null;
          this.sleepDate = new Date().toISOString().split('T')[0];
          this.loadHistory();
          this.loadWeekly();
        } else {
          this.errorMsg = res.message || 'Failed to log sleep.';
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Something went wrong. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // ── Load History ─────────────────────────────
  loadHistory(): void {
    this.commonService.GetSleepHistory(this.userId).subscribe({
      next: (data) => { this.allHistory = data || []; },
      error: () => { this.allHistory = []; }
    });
  }

  loadWeekly(): void {
    this.commonService.GetSleepByWeek(this.userId).subscribe({
      next: (data) => { this.weeklyData = data || []; },
      error: () => { this.weeklyData = []; }
    });
  }

  // ── Edit ─────────────────────────────────────
  startEdit(record: any): void {
    this.editingId = record.sleepId;
    this.editHours = record.sleepHours;
    this.clearMessages();
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editHours = null;
  }

  saveEdit(sleepId: number): void {
    if (!this.editHours || this.editHours <= 0 || this.editHours > 24) {
      this.errorMsg = 'Please enter valid sleep hours (0.5 – 24).';
      return;
    }
    this.isLoading = true;
    this.commonService.UpdateSleep(sleepId, this.editHours).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMsg = 'Sleep record updated.';
          this.editingId = null;
          this.editHours = null;
          this.loadHistory();
          this.loadWeekly();
        } else {
          this.errorMsg = res.message || 'Update failed.';
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Something went wrong. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // ── Delete ────────────────────────────────────
  deleteSleep(sleepId: number): void {
    if (!confirm('Delete this sleep record?')) return;
    this.isLoading = true;
    this.commonService.DeleteSleep(sleepId).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMsg = 'Sleep record deleted.';
          this.loadHistory();
          this.loadWeekly();
        } else {
          this.errorMsg = res.message || 'Delete failed.';
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Something went wrong. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // ── Helpers ───────────────────────────────────
  clearMessages(): void {
    this.successMsg = '';
    this.errorMsg = '';
  }

  getSleepStatus(hours: number): string {
    if (hours >= 7 && hours <= 9) return 'Good';
    if (hours >= 6 && hours < 7) return 'Fair';
    return 'Poor';
  }

  getSleepStatusClass(hours: number): string {
    if (hours >= 7 && hours <= 9) return 'status-good';
    if (hours >= 6 && hours < 7) return 'status-fair';
    return 'status-poor';
  }

  getTotalWeeklySleep(): number {
    return this.weeklyData.reduce((sum, s) => sum + (s.sleepHours || 0), 0);
  }

  getAvgWeeklySleep(): string {
    if (!this.weeklyData.length) return '0.0';
    return (this.getTotalWeeklySleep() / this.weeklyData.length).toFixed(1);
  }

  getBarHeight(hours: number): number {
    return Math.min((hours / 10) * 100, 100);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getDayLabel(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  }
  getBarClass(hours: number): string {
    const h = hours || 0;
    if (h >= 7 && h <= 9) return 'bar-good';
    if (h >= 6 && h < 7) return 'bar-fair';
    return 'bar-poor';
  }
}
