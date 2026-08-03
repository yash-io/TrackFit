import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';

@Component({

  selector: 'app-home',

  templateUrl: './home.component.html',

  styleUrls: ['./home.component.css']

})

export class HomeComponent implements OnInit {

  currentSlide = 0;
  streakStatus: any;
  constructor(private _commonservice: CommonService) { }
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('token') != null ? true : false;
    if (this.isLoggedIn) {
      this.triggerStreak();
    }

    
  }

  ngAfterViewInit() {
    if (this.isLoggedIn) {
      this.startSlider();
    }
  }

  triggerStreak() {
    this._commonservice.TriggerStreak().subscribe(
      res => {
        this.streakStatus = res;
      }
    );
  }
    startSlider() {
      const slides = document.querySelectorAll('.slide');
      const dots = document.querySelectorAll('.dots span');

      setInterval(() => {
        slides[this.currentSlide].classList.remove('active');
        dots[this.currentSlide].classList.remove('active-dot');
        this.currentSlide =
          (this.currentSlide + 1) % slides.length;
        slides[this.currentSlide].classList.add('active');
        dots[this.currentSlide].classList.add('active-dot');

      }, 3000);  

  }

}
