import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';


@Component({

  selector: 'app-leaderboard',

  templateUrl: './leaderboard.component.html',

  styleUrls: ['./leaderboard.component.css']

})

export class LeaderboardComponent implements OnInit {

  leaderboard: any = [];

  top3: any = [];

  others: any = [];

  constructor(private service: UserService) { }

  ngOnInit(): void {

    this.loadLeaderboard();

  }

  loadLeaderboard() {

    this.service.getLeaderboard().subscribe(response => {
      const list = response?.data || [];
      this.leaderboard = list;

      this.top3 = list.slice(0, 3);

      this.others = list.slice(3);

    });

  }
}

