import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

import { WaterUsageService } from '@services/*';
import { takeWhile } from 'rxjs/internal/operators';

@Component({
  selector: 'app-usage-single-chart',
  templateUrl: './usage-single-chart.component.html',
  styleUrls: ['./usage-single-chart.component.scss'],
})
export class UsageSingleChartComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('usageSingleCanvas') usageSingleCanvas: ElementRef;
  usageSingleChart: any;

  public colors = [
    { main: 'rgba(239,118,122, 1)', fill: 'rgba(239,118,122, 0.6)' }, // #ef767a
    { main: 'rgba(27,150,86, 1)', fill: 'rgba(27,150,86, 0.6)' },     // #1b9656
    { main: 'rgba(69,105,144, 1)', fill: 'rgba(69,105,144, 0.6)' },   // #456990
    { main: 'rgba(73,220,177, 1)', fill: 'rgba(73,220,177, 0.6)' },   // #49dcb1
    { main: 'rgba(238,184,104, 1)', fill: 'rgba(238,184,104, 0.6)' }, // #eeb868

    { main: 'rgba(75,192,192,1)', fill: 'rgba(75,192,192,0.6)' },
    { main: 'rgba(96, 196, 150,1)', fill: 'rgba(96, 196, 150,0.6)' },
    { main: 'rgba(255,152,0,1)', fill: 'rgba(255,152,0,0.6)' },
    { main: 'rgba(0, 188, 212,1)', fill: 'rgba(0, 188, 212,0.6)' },
    { main: 'rgba(80, 150, 215,1)', fill: 'rgba(80, 150, 215,0.6)' },
  ];
  public months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  public alive = true;

  public locations: any[];
  public locationFilter = { id: 0, name: 'general' };
  public locationKeys = { value: 'id', title: 'name' };

  public location = this.locationFilter;
  public indexes: any[];
  
  constructor(public waterUsageService: WaterUsageService) {
    this.locations = [this.locationFilter];
    this.indexes = [];
  }

  ngAfterViewInit(): void {
    this.chartCreate();
  }

  public ngOnInit() {
    this.loadData();
  }

  public ngOnDestroy() {
    this.alive = false;
  }

  public changeLocation(location) {
    // console.log('changed location \'' + location.name + '\' id: ' + location.id);
    this.location = location;
    this.chartDestroy();
    this.loadChartData(location);
  }

  getMonth(date) {
    let m = -1;
    if (date.getDate() < 18) {
      m = date.getMonth();
    } else {
      m = (date.getMonth() + 1) % 12;
    }
    return this.months[m];
  }

  getLast12Months() {
    const d = new Date();
    const m = d.getMonth() + 1;
    return this.months.slice(m + 1).concat(this.months.slice(0, m + 1));
  }

  chartCreate() {
    const datasets = [];
    if (this.indexes) {
      const colorIndex = 7;
      datasets.push({
        type: 'line',
        label: this.location.name,
        fill: false,
        lineTension: 0.2,
        backgroundColor: this.colors[colorIndex].fill,
        borderColor: this.colors[colorIndex].main,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: this.colors[colorIndex].main,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: this.colors[colorIndex].main,
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: this.indexes,
        spanGaps: false,
      });
    }

    const chartData = {
      options: {
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            beginAtZero: true,
          },
        },
      },
      data: {
        labels: this.getLast12Months(),
        datasets: datasets,
      },
    };
    if (this.usageSingleChart) {
      this.usageSingleChart.destroy();
    }
    this.usageSingleChart = new Chart(this.usageSingleCanvas.nativeElement, chartData);
  }

  chartDestroy() {
    if (this.usageSingleChart) {
      this.usageSingleChart.destroy();
    }
  }

  public loadData() {
    this.waterUsageService.getLocations()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.locations = [{ id: 0, name: "general" }].concat(data.locations);
      });
  }

  public loadChartData(locationFilter: object = {}) {
    const fullFilter = { location: locationFilter['id'] };
    this.waterUsageService.getUsage(fullFilter)
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.indexes = [];
        this.indexes = data
            .map((v, i, a) => Object.assign({ x: this.getMonth(new Date(v.date)), y: v.quantity }))
            .slice(1);
        this.chartCreate();
      });
  }

}
