import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { CommonService } from '../services/common.service';
import { CalendarDay, CalendarCell } from '../interfaces/calendar';
import { CalendarService } from '../services/calendar.service';
import { DeleteAccountService } from '../delete-account.service';

@Component({

  selector: 'app-view-profile',

  templateUrl: './view-profile.component.html',

  styleUrls: ['./view-profile.component.css']

})

export class ViewProfileComponent implements OnInit {

  profileData: any = {};
  showEditModal: boolean = false;
  editedUserName: string = '';
  isLight: boolean = false;
  userId: any;
  streakData: any;
  isDarkTheme: boolean = true;
  today = new Date();
  responseMessage: string = '';
  currentMonth: number;
  currentYear: number;

  monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // ── Grid ───────────────────────────────
  calendarCells: CalendarCell[] = [];
  calendarData: CalendarDay[] = [];

  // ── Selected Day Panel ─────────────────
  selectedCell: CalendarCell | null = null;
  showPanel: boolean = false;

  // ── Animation ──────────────────────────
  isAnimating = false;

  // ── Stats ──────────────────────────────
  monthlyWorkouts = 0;
  monthlyWaterDays = 0;
  monthlyCalories = 0;
  constructor(
    private userService: UserService,
    public auth: AuthService,
    private router: Router,
    private commonService: CommonService,
    private calendarService: CalendarService,
    private deleteService: DeleteAccountService
  ) {
    this.currentMonth = this.today.getMonth() + 1;
    this.currentYear = this.today.getFullYear();
    this.generateYearList();
}

  ngOnInit(): void {

    const id = localStorage.getItem("userId") || localStorage.getItem("userId");

    if (id) {
      this.userId = +id;
      this.loadProfile();
      this.getStreakDetails();
    } else {
      this.router.navigate(['/login']);
    }

    this.loadProfile();
    this.loadData();
    this.getAchievements();
  }

  openEditModal() {
    this.showEditModal = true;
        this.editedUserName = this.profileData.userName;
  }

  closeModal() {
    this.showEditModal = false;
  }

  showMenu = false;

  toggleMenu(event?: Event) {
    event?.stopPropagation();
    this.showMenu = !this.showMenu;
    console.log(this.showMenu);
  }
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const clickedElement = event.target as HTMLElement;
    if (!clickedElement.closest('menu-wrapper')) {
      this.showMenu = false;
    }
  }
  changePassword() {
    this.router.navigate(['/change-password']);
  }

  getStreakDetails() {
    this.commonService.GetStreakDetails().subscribe({
      next: (res: any) => {
        console.log("StrakData", res);
        this.streakData = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  goToAllBadges() {
    this.router.navigate(['/streak']);
  }
  latestBadge: any;
  badgesData: any[] = [];
  noBadges: boolean = false;

  getAchievements() {
    this.commonService.GetBadges().subscribe({
      next: (res) => {
        this.badgesData = res || [];
        if (this.badgesData.length > 0) {
          this.noBadges = false;
          this.badgesData.sort((a: any, b: any) =>
            new Date(b.achievedDate).getTime() - new Date(a.achievedDate).getTime()
          );
          this.latestBadge = this.badgesData[0];
        } else {
          this.noBadges = true;  
          this.latestBadge = null;
        }
      },
      error: (err) => {
        console.error(err);
        this.noBadges = true;
      }
    });

  }





  saveUserName() {
    this.userService.updateUserName(this.userId,this.editedUserName).subscribe({
      next: (res: any) => {
        if (res == 1) {
          this.profileData.userName = this.editedUserName;
          alert("Username updated successfully");
          this.showEditModal = false;
        }
        else {
          alert("Update failed");
        }
      },
      error: (err) => {
        console.log(err);
        alert("Something went wrong");
      }

    })

  }



  loadProfile() {
    this.userService.getUserProfile(this.userId).subscribe(
      (res: any) => {
        this.profileData = res;
        if (res.profileImage) {
          localStorage.setItem('profilePhoto', res.profileImage);
          //window.location.href = '/view-profile';
        }
        console.log(res);
      }
    )
  }

  editProfile() {

    this.router.navigate(['/profile', this.userId]);

  }

  getUserId(): number {
    return parseInt(localStorage.getItem('userId') || '0');
  }

  // ── LOAD ───────────────────────────────

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

  // ── BUILD GRID ─────────────────────────

  buildGrid(): void {
    this.calendarCells = [];

    const firstDay = new Date(
      this.currentYear,
      this.currentMonth - 1, 1
    );

    // Monday = 0 ... Sunday = 6
    let startIndex = firstDay.getDay() - 1;
    if (startIndex < 0) startIndex = 6;

    const daysInMonth = new Date(
      this.currentYear,
      this.currentMonth, 0
    ).getDate();

    // Empty cells before 1st
    for (let i = 0; i < startIndex; i++) {
      this.calendarCells.push({
        day: null, dateStr: '',
        isToday: false, data: null
      });
    }

    // Actual days
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

    // Fill remaining to complete row
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

  // ── MONTHLY STATS ──────────────────────

  calcMonthlyStats(): void {
    this.monthlyWorkouts = this.calendarData
      .filter(d => d.hasWorkout).length;
    this.monthlyWaterDays = this.calendarData
      .filter(d => d.hasWaterIntake).length;
    this.monthlyCalories = this.calendarData
      .reduce((s, d) => s + d.totalCalories, 0);
  }

  // ── NAVIGATION ─────────────────────────

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

  // ── CLICK DATE ─────────────────────────

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

  // ── HELPERS ────────────────────────────

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
  // ── ADD these new properties ───────────
  showMonthPicker: boolean = false;
  showYearPicker: boolean = false;

  yearList: number[] = [];

  // ── ADD this method — call in constructor
  generateYearList(): void {
    const current = new Date().getFullYear();
    this.yearList = [];
    for (let y = current - 10; y <= current + 10; y++) {
      this.yearList.push(y);
    }
  }

  // ── ADD these methods ──────────────────

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


  logout() {
    this.auth.logout();        // clear session/token
    window.location.href = '/home';
  }

  deleteAccount() {
    if (!this.userId) {
      this.responseMessage = 'User ID not found';
      return;
    }

    this.deleteService.deleteUser().subscribe({
      next: () => {
        this.responseMessage = 'Account deleted successfully!';
      },
      error: () => {
        this.responseMessage = 'Failed to delete account.';
      }
    });
  }

}
