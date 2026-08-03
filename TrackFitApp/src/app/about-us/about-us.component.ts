import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {

  title: string = "About Our Fitness Tracker";

  description: string = `
    Our Fitness Tracker helps users monitor their daily health activities 
    such as steps, water intake, calories, and workouts. 
    It is designed to make fitness tracking simple, effective, and accessible for everyone.
  `;

  mission: string = `
    To encourage a healthier lifestyle by providing easy-to-use tools 
    for tracking daily fitness goals.
  `;

  vision: string = `
    To become a reliable and user-friendly platform for fitness tracking 
    and personal health improvement.
  `;
}
