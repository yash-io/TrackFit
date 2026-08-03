
import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../services/calendar.service';
import { CalendarDay, CalendarCell }
  from '../interfaces/calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

 
  currentMonth: number;
  currentYear: number;
  today = new Date();

  monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  
  calendarCells: CalendarCell[] = [];
  calendarData: CalendarDay[] = [];

  selectedCell: CalendarCell | null = null;
  showPanel: boolean = false;

  
  isAnimating = false;

 
  monthlyWorkouts = 0;
  monthlyWaterDays = 0;
  monthlyCalories = 0;

  constructor(private calendarService: CalendarService) {
    this.currentMonth = this.today.getMonth() + 1;
    this.currentYear = this.today.getFullYear();
    this.generateYearList(); 
  }

  ngOnInit(): void {
    this.loadData();
  }

  getUserId(): number {
    return parseInt(localStorage.getItem('userId') || '0');
  }

 

  loadData(): void {
    this.calendarService.getCalendarData(
      this.getUserId(),
      this.currentMonth,
      this.currentYear
    ).subscribe({
      next: (data) => {
        this.calendarData = data;
        this.buildGrid();
        this.calcMonthlyStats();
      },
      error: () => {
        this.calendarData = [];
        this.buildGrid();
      }
    });
  }


  buildGrid(): void {
    this.calendarCells = [];

    const firstDay = new Date(
      this.currentYear,
      this.currentMonth - 1, 1
    );

   
    let startIndex = firstDay.getDay() - 1;
    if (startIndex < 0) startIndex = 6;

    const daysInMonth = new Date(
      this.currentYear,
      this.currentMonth, 0
    ).getDate();

    
    for (let i = 0; i < startIndex; i++) {
      this.calendarCells.push({
        day: null, dateStr: '',
        isToday: false, data: null
      });
    }

   
    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(this.currentMonth).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateStr = `${this.currentYear}-${mm}-${dd}`;

      const isToday =
        d === this.today.getDate() &&
        this.currentMonth === this.today.getMonth() + 1 &&
        this.currentYear === this.today.getFullYear();

      const data = this.calendarData
        .find(x => x.date === dateStr) || null;

      this.calendarCells.push({
        day: d, dateStr, isToday, data
      });
    }

   
    const rem = this.calendarCells.length % 7;
    if (rem !== 0) {
      for (let i = 0; i < 7 - rem; i++) {
        this.calendarCells.push({
          day: null, dateStr: '',
          isToday: false, data: null
        });
      }
    }
  }

 

  calcMonthlyStats(): void {
    this.monthlyWorkouts = this.calendarData
      .filter(d => d.hasWorkout).length;
    this.monthlyWaterDays = this.calendarData
      .filter(d => d.hasWaterIntake).length;
    this.monthlyCalories = this.calendarData
      .reduce((s, d) => s + d.totalCalories, 0);
  }



  prevMonth(): void {
    this.triggerAnimation();
    this.showPanel = false;
    if (this.currentMonth === 1) {
      this.currentMonth = 12;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.loadData();
  }

  nextMonth(): void {
    this.triggerAnimation();
    this.showPanel = false;
    if (this.currentMonth === 12) {
      this.currentMonth = 1;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.loadData();
  }

  triggerAnimation(): void {
    this.isAnimating = true;
    setTimeout(() => this.isAnimating = false, 400);
  }

  
  selectDay(cell: CalendarCell): void {
    if (!cell.day) return;
    if (this.selectedCell?.dateStr === cell.dateStr) {
      this.showPanel = false;
      this.selectedCell = null;
      return;
    }
    this.selectedCell = cell;
    this.showPanel = true;
  }

  closePanel(): void {
    this.showPanel = false;
    this.selectedCell = null;
  }

 

  getMonthName(): string {
    return this.monthNames[this.currentMonth - 1];
  }

  getCellClass(cell: CalendarCell): string {
    if (!cell.day) return 'empty';
    if (cell.isToday) return 'today';
    if (!cell.data) return 'normal';

    const d = cell.data;
    const score =
      (d.hasWorkout ? 2 : 0) +
      (d.hasWaterIntake ? 1 : 0) +
      (d.hasStreak ? 2 : 0);

    if (score >= 4) return 'very-active';
    if (score >= 2) return 'active';
    if (score >= 1) return 'light-active';
    return 'normal';
  }

  formatSelectedDate(): string {
    if (!this.selectedCell?.dateStr) return '';
    const d = new Date(this.selectedCell.dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  showMonthPicker: boolean = false;
  showYearPicker: boolean = false;

  yearList: number[] = [];

  
  generateYearList(): void {
    const current = new Date().getFullYear();
    this.yearList = [];
    for (let y = current - 10; y <= current + 10; y++) {
      this.yearList.push(y);
    }
  }



  selectMonth(month: number): void {
    this.currentMonth = month;
    this.showMonthPicker = false;
    this.showYearPicker = false;
    this.loadData();
  }

  selectYear(year: number): void {
    this.currentYear = year;
    this.showYearPicker = false;
    this.showMonthPicker = false;
    this.loadData();
  }

  toggleMonthPicker(): void {
    this.showMonthPicker = !this.showMonthPicker;
    this.showYearPicker = false;
  }

  toggleYearPicker(): void {
    this.showYearPicker = !this.showYearPicker;
    this.showMonthPicker = false;
  }

  closePickers(): void {
    this.showMonthPicker = false;
    this.showYearPicker = false;
  }

  isSelected(cell: CalendarCell): boolean {
    return this.selectedCell?.dateStr === cell.dateStr;
  }
}
