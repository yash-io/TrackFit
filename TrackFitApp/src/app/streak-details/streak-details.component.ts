import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../services/common.service';

declare const html2canvas: any;

@Component({
  selector: 'app-streak-details',
  templateUrl: './streak-details.component.html',
  styleUrls: ['./streak-details.component.css']
})
export class StreakDetailsComponent implements OnInit {
  @ViewChild('shareArea', { static: false }) shareArea!: ElementRef<HTMLElement>;

  streakData: any;
  badgesData: any;
  today = new Date().toDateString();
  radius = 70;
  circumference = 2 * Math.PI * this.radius;
  dashOffset = 0;
  tip: string = '';
  fireLevel = 1;

  constructor(private _commonService: CommonService) { }

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    const isPrint = params.get('print') === 'true';

    this.getStreakData();
    this.getAchievements();

    if (!isPrint) {
      const savedToday = localStorage.getItem('tipDate');
      const savedTip = localStorage.getItem('dailyTip');

      if (savedToday === this.today && savedTip) {
        this.tip = savedTip;
      } else {
        this.GetTip();
      }
    }

    if (isPrint) {
      setTimeout(() => {
        window.onafterprint = () => {
          window.close();
        };

        window.print();

        setTimeout(() => {
          window.close();
        }, 3000);
      }, 800);
    }
  }

  getStreakData() {
    this._commonService.GetStreakDetails().subscribe({
      next: (res) => {
        this.streakData = res;
        this.updateUI();
      },
      error: (err) => {
        console.error('Error loading streak data:', err);
      }
    });
  }

  getAchievements() {
    this._commonService.GetBadges().subscribe({
      next: (res) => {
        this.badgesData = res;
      },
      error: (err) => {
        console.error('Error loading badges data:', err);
      }
    });
  }

  openPrintNewTab() {
    const url = `${window.location.origin}${window.location.pathname}?print=true`;
    window.open(url, '_blank');
  }

  updateUI() {
    const current = this.streakData?.currentStreak || 0;
    const longest = this.streakData?.longestStreak || 1;
    const progress = Math.min(current / longest, 1);

    this.dashOffset = this.circumference * (1 - progress);

    if (current < 3) this.fireLevel = 1;
    else if (current < 7) this.fireLevel = 2;
    else this.fireLevel = 3;
  }

  GetTip() {
    this._commonService.GetTip().subscribe({
      next: (response) => {
        this.tip = response?.affirmation || '';
        localStorage.setItem('tipDate', this.today);
        localStorage.setItem('dailyTip', this.tip);
      },
      error: (err) => {
        console.error('Error loading tip:', err);
      }
    });
  }

  downloadPDF() {
    window.print();
  }

  async shareViaEmail() {
    if (!this.shareArea?.nativeElement) {
      console.error('shareArea element not found');
      return;
    }

    if (typeof html2canvas !== 'function') {
      console.error('html2canvas is not loaded');
      return;
    }

    try {
      const canvas = await html2canvas(this.shareArea.nativeElement, {
        scale: Math.max(2, window.devicePixelRatio || 1),
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      canvas.toBlob((blob: Blob | null) => {
        if (!blob) {
          console.error('Failed to create image blob');
          return;
        }

        const imageUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'streak-badges.png';
        link.click();

        setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
      }, 'image/png');

      const subject = encodeURIComponent('My Streak and Badges');
      const body = encodeURIComponent(
        'Sharing my streak and badges page.\n\nThe image has been downloaded on my device. Please attach it to this email.'
      );

      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    } catch (error) {
      console.error('Error generating share image:', error);
    }
  }
}
