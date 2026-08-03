import { Component, OnInit } from '@angular/core';

import { AdminService } from '../services/admin.service';

declare var Chart: any;
@Component({

  selector: 'app-admin-activity',

  templateUrl: './admin-activity.component.html',

  styleUrls: ['./admin-activity.component.css']

})

export class AdminActivityComponent implements OnInit {

  chart: any;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {

    this.loadWeeklyActivity();

  }

  loadWeeklyActivity() {

    this.adminService.getWeeklyActivity().subscribe({

      next: (res: any) => {
        const apiData = res.data;
        const labels = apiData.map((item: any) => item.date);
        const values = apiData.map((item: any) => item.activeUsers);
        if (this.chart) {

          this.chart.destroy();

        }
        this.chart = new Chart('activityChart', {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                data: values,
                borderColor: '#4cc6f5',
                backgroundColor: 'rgba(76, 198, 245, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#ffffff'
              }
            ]
          },

          options: {
            responsive: true,
            maintainAspectRatio: false, 
            plugins: {
              legend: {
                display: false  
              }
            },

            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });

      },

      error: (err) => {

        console.error('Error fetching weekly activity:', err);

      }

    });

  }

}
