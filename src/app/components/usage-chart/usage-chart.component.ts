import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

import { WaterUsageService } from '@services/*';
import { takeWhile } from 'rxjs/internal/operators';

@Component({
  selector: 'app-usage-chart',
  templateUrl: './usage-chart.component.html',
  styleUrls: [],
})
export class UsageChartComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() public title = 'Chart';
  @Input() public isSingle = true;
  @Input() public preSelectedLocation = 2;

  @ViewChild('usageCanvas') usageCanvas: ElementRef;
  usageChart: any;

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

  public locationKeys = { value: 'id', title: 'name' };
  public locationFilter = { id: 0, name: '' };

  public locations: any[] = [{}];
  public indexes: {};
  public last12Months = this.getLast12Months(new Date());

  constructor(public waterUsageService: WaterUsageService) {
  }

  ngAfterViewInit(): void {
    this.chartCreate();
  }

  public ngOnInit() {
    this.loadData(this.isSingle ? this.preSelectedLocation : null);
  }

  public ngOnDestroy() {
    this.alive = false;
  }

  public changeLocation(location) {
    // console.log(`UsageChart: changed location ${location.id} (\'${location.name}\')`);
    this.chartDestroy();
    this.loadChartData([location]);
  }

  getMonthIndex(date) {
    let m = -1;
    if (date.getDate() < 18) {
      m = date.getMonth();
    } else {
      m = (date.getMonth() + 1) % 12;
    }
    return m;
  }

  getMonthName(date) {
    return this.months[this.getMonthIndex(date)];
  }

  getLast12Months(date) {
    const m = this.getMonthIndex(date) + 1;
    return this.months.slice(m).concat(this.months.slice(0, m));
  }

  chartCreate() {
    const datasets = [];

    if (this.indexes) {
      let index = 0;
      for (const key of Object.keys(this.indexes)) {
        const colorIndex = index++ % this.colors.length;
        datasets.push({
          type: (this.isSingle || key === 'general') ? 'line' : 'bar',
          label: key,
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
          data: this.indexes[key],
          spanGaps: false,
        });
      }
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
        labels: this.last12Months,
        datasets,
      },
    };
    if (this.usageChart) {
      this.usageChart.destroy();
    }
    this.usageChart = new Chart(this.usageCanvas.nativeElement, chartData);
  }

  chartDestroy() {
    if (this.usageChart) {
      this.usageChart.destroy();
    }
  }

  public loadData(selectedLocation = null) {
    this.waterUsageService.getLocations()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.locations = [{ id: 0, name: 'general' }].concat(data.locations);
        if (selectedLocation == null) {
          this.loadChartData(this.locations);
        } else {
          this.locationFilter = this.locations[selectedLocation];  // will call changeLocation() which loads chart data for that location
        }
      });
  }

  public loadChartData(locationList) {
    const now = new Date();
    const lastY = new Date();
    lastY.setFullYear(now.getFullYear() - 2);

    this.waterUsageService.getUsage({ from: lastY.toISOString() })
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        const indexes = {};
        locationList.forEach((location) => {
          indexes[location.name] = data
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .filter((v, i, a) => v.location === location.id)
              .map((v, i, a) => Object.assign({ date: new Date(v.date), quantity: v.quantity }));
        });

        const monthsToShow = {};
        locationList.forEach((location) => {
          const lastMonth = indexes[location.name]
              .map((v, i, a) => Object.assign({ month: this.getMonthIndex(v.date) }))
              .slice(-1)[0]?.month;
          monthsToShow[location.name] = this.getMonthIndex(new Date()) >= lastMonth ? 12 - this.getMonthIndex(new Date()) + lastMonth : lastMonth - this.getMonthIndex(new Date());
        });

        this.indexes = {};
        locationList.forEach((location) => {
          this.indexes[location.name] = indexes[location.name]
              .map((v, i, a) => Object.assign({ x: this.getMonthName(v.date), y: v.quantity }))
              .slice(-monthsToShow[location.name]);
        });

        this.chartCreate();
      });
  }
}
