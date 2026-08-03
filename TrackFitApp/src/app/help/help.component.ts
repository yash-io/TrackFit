import { Component } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent {
  isHelpOpen = false;

  toggleHelpMenu() {
    this.isHelpOpen = !this.isHelpOpen;
  }

}
