import { Component } from '@angular/core';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css']
})
export class LearnComponent {

  topics = [
    { id: 1, title: 'Healthy Eating', desc: 'Learn about balanced diet' },
    { id: 2, title: 'Workout Basics', desc: 'Beginner workout routines' },
    { id: 3, title: 'Hydration Tips', desc: 'Importance of water intake' },
    { id: 4, title: 'Weight Loss', desc: 'Safe weight loss methods' },
    { id: 5, title: 'Sleep & Recovery', desc: 'Importance of proper sleep' },
    { id: 6, title: 'Mental Wellness', desc: 'Managing stress and focus' },
    { id: 7, title: 'Muscle Building', desc: 'Basics of strength training' },
    { id: 8, title: 'Daily Fitness Habits', desc: 'Small habits for big results' }
  ];

}
