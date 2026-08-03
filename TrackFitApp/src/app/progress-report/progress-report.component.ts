import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../services/common.service';

declare var Chart: any;

@Component({
  selector: 'app-progress-report',
  templateUrl: './progress-report.component.html',
  styleUrls: ['./progress-report.component.css']
})
export class ProgressReportComponent implements OnInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef;

  constructor(private _commonService: CommonService) { }

  records: any;
  public chartInstance: any;
  public activeCategory: 'workouts' | 'bmi' | 'sleep' | 'water' = 'workouts';

  public activeTimeframe: 'weekly' | 'monthly' = 'weekly';
  public isComparing: boolean = false;

  public currentSummaryStat: string = 'Waiting for data...';

  ngOnInit(): void {
    this.GetRecords();
  }

  GetRecords() {
    this._commonService.GetRecords().subscribe(
      res => {
        this.records = res;
        setTimeout(() => { this.processAndRenderData(); }, 0);
      },
      err => {
        console.error('Failed to load records', err);
        this.currentSummaryStat = 'Error loading data';
      }
    );
  }

  setCategory(category: 'workouts' | 'bmi' | 'sleep' | 'water'): void {
    this.activeCategory = category;
    this.processAndRenderData();
  }

  setTimeframe(timeframe: 'weekly' | 'monthly'): void {
    this.activeTimeframe = timeframe;
    this.processAndRenderData();
  }

  toggleComparison(): void {
    this.isComparing = !this.isComparing;
    this.processAndRenderData();
  }

  private processAndRenderData(): void {
    if (!this.records) return;

    let rawArray: any[] = [];
    let dateKey = '';
    let valueKey = '';
    let chartTitle = '';
    let unit = '';
    let chartType = 'bar';
    let aggregationType: 'sum' | 'avg' | 'max' = 'sum';

    switch (this.activeCategory) {
      case 'workouts':
        rawArray = this.records.workouts || [];
        dateKey = 'workoutDate';
        valueKey = 'caloriesBurned';
        chartTitle = 'Calories Burned';
        unit = 'kcal';
        chartType = 'bar';
        aggregationType = 'sum';
        break;
      case 'bmi':
        rawArray = this.records.bmi || [];
        dateKey = 'recordedDate';
        valueKey = 'bmivalue';
        chartTitle = 'BMI Progression';
        unit = 'kg/m²';
        chartType = 'line';
        aggregationType = 'avg';
        break;
      case 'sleep':
        rawArray = this.records.sleep || [];
        dateKey = 'sleepDate';
        valueKey = 'sleepHours';
        chartTitle = 'Sleep Duration';
        unit = 'hrs';
        chartType = 'line';
        aggregationType = 'max';
        break;
      case 'water':
        rawArray = this.records.waterIntakes || [];
        dateKey = 'intakeTime';
        valueKey = 'quantityMl';
        chartTitle = 'Hydration Levels';
        unit = 'ml';
        chartType = 'bar';
        aggregationType = 'sum';
        break;
    }

    if (rawArray.length === 0) {
      this.currentSummaryStat = 'No records found';
      this.renderChart([], [], [], chartTitle, chartType);
      return;
    }
    const timeframeDays = this.activeTimeframe === 'weekly' ? 7 : 30;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const labels: string[] = [];
    const currentData = new Array(timeframeDays).fill(0);
    const currentCounts = new Array(timeframeDays).fill(0);
    const prevData = new Array(timeframeDays).fill(0);
    const prevCounts = new Array(timeframeDays).fill(0);

    
    for (let i = timeframeDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }

    rawArray.forEach(item => {
      if (!item[dateKey] || item[valueKey] === undefined) return;

      const itemDate = new Date(item[dateKey]);
      itemDate.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - itemDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
      const val = item[valueKey];

      if (diffDays >= 0 && diffDays < timeframeDays) {
        //current period
        const idx = (timeframeDays - 1) - diffDays;
        if (aggregationType === 'max') currentData[idx] = Math.max(currentData[idx], val);
        else currentData[idx] += val;
        currentCounts[idx]++;
      }
      else if (this.isComparing && diffDays >= timeframeDays && diffDays < timeframeDays * 2) {
        // previous period (last week)
        const idx = (timeframeDays * 2 - 1) - diffDays;
        if (aggregationType === 'max') prevData[idx] = Math.max(prevData[idx], val);
        else prevData[idx] += val;
        prevCounts[idx]++;
      }
    });

    //Averages
    if (aggregationType === 'avg') {
      for (let i = 0; i < timeframeDays; i++) {
        if (currentCounts[i] > 0) currentData[i] /= currentCounts[i];
        if (prevCounts[i] > 0) prevData[i] /= prevCounts[i];
      }
    }

   
    const validCurrentData = currentData.filter((val, i) => currentCounts[i] > 0);
    if (validCurrentData.length > 0) {
      if (aggregationType === 'sum') {
        const grandTotal = validCurrentData.reduce((a, b) => a + b, 0);
        this.currentSummaryStat = `${grandTotal.toFixed(0)} ${unit} Total`;
      } else {
        const avg = validCurrentData.reduce((a, b) => a + b, 0) / validCurrentData.length;
        this.currentSummaryStat = `${avg.toFixed(1)} ${unit} Avg`;
      }
    } else {
      this.currentSummaryStat = `No data this ${this.activeTimeframe === 'weekly' ? 'week' : 'month'}`;
    }

    const finalCurrent = currentData.map(val => Number(val.toFixed(1)));
    const finalPrev = prevData.map(val => Number(val.toFixed(1)));

    this.renderChart(labels, finalCurrent, finalPrev, chartTitle, chartType);
  }


  private renderChart(labels: string[], currentData: number[], prevData: number[], title: string, chartType: string): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    if (!this.chartCanvas) return;

    setTimeout(() => {
      const ctx = this.chartCanvas.nativeElement.getContext('2d');

      const datasets: any[] = [{
        label: `Current ${title}`,
        data: currentData,
        borderColor: '#ff8c00',
        backgroundColor: chartType === 'bar' ? 'rgba(255, 140, 0, 0.8)' : 'rgba(255, 140, 0, 0.1)',
        borderWidth: 2,
        borderRadius: chartType === 'bar' ? 4 : 0,
        tension: 0.4,
        fill: chartType === 'line',
        pointBackgroundColor: '#121212',
        pointBorderColor: '#ff8c00',
        pointRadius: 4,
        barThickness: this.activeTimeframe === 'monthly' ? 10 : 30 // Make bars thinner for monthly view
      }];

      
      if (this.isComparing) {
        datasets.push({
          label: `Previous ${title}`,
          data: prevData,
          borderColor: '#6c757d',
          backgroundColor: chartType === 'bar' ? 'rgba(108, 117, 125, 0.4)' : 'transparent',
          borderWidth: 2,
          borderDash: chartType === 'line' ? [5, 5] : [],
          borderRadius: chartType === 'bar' ? 4 : 0,
          tension: 0.4,
          fill: false,
          pointRadius: 0,
          barThickness: this.activeTimeframe === 'monthly' ? 10 : 30
        });
      }

      this.chartInstance = new Chart(ctx, {
        type: chartType,
        data: { labels: labels, datasets: datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: this.isComparing, 
              labels: { color: '#a0a0a0', font: { family: "'DM Sans', sans-serif" } }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(20, 20, 20, 0.95)',
              titleColor: '#fff',
              bodyColor: '#e0e0e0',
              borderColor: 'rgba(255, 140, 0, 0.3)',
              borderWidth: 1,
              padding: 12,
              cornerRadius: 8,
              titleFont: { family: "'JetBrains Mono', monospace", size: 13 },
              bodyFont: { family: "'DM Sans', sans-serif", size: 14 }
            }
          },
          scales: {
            y: {
              beginAtZero: chartType === 'bar',
              grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
              ticks: { color: '#888', font: { family: "'JetBrains Mono', monospace" } }
            },
            x: {
              grid: { display: false, drawBorder: false },
              ticks: {
                color: '#a0a0a0',
                font: { family: "'DM Sans', sans-serif" },
                maxTicksLimit: this.activeTimeframe === 'monthly' ? 10 : 7 
              }
            }
          },
          interaction: { mode: 'nearest', axis: 'x', intersect: false }
        }
      });
    }, 0);
  }
}


