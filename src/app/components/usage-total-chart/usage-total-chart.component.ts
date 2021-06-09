import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

import { WaterUsageService } from '@services/*';
import { takeWhile } from 'rxjs/internal/operators';

@Component({
  selector: 'app-usage-total-chart',
  templateUrl: './usage-total-chart.component.html',
  styleUrls: ['./usage-total-chart.component.scss'],
})
export class UsageTotalChartComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('usageTotalCanvas') usageTotalCanvas: ElementRef;
  usageTotalChart: any;

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

  public indexes: {};
  public invoices: any[];
  public locations: any[];

  constructor(public waterUsageService: WaterUsageService) {
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
      let index = 0;
      for (const key in this.indexes) {
        const colorIndex = index++ % this.colors.length;
        datasets.push({
          type: 'bar',
          label: this.locations.find(x => x.id == key).name,
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

    if (this.invoices) {
      datasets.push({
        type: 'line',
        label: 'invoice',
        fill: false,
        lineTension: 0.2,
        backgroundColor: this.colors[9].fill,
        borderColor: this.colors[9].main,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: this.colors[9].main,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: this.colors[9].main,
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: this.invoices.map((v, i, a) => Object.assign({ x: this.getMonth(new Date(v.date)), y: i > 0 ? a[i].index - a[i - 1].index : 0 })).slice(1),
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
          },
        },
      },
      data: {
        labels: this.getLast12Months(),
        datasets: datasets,
      },
    };
    if (this.usageTotalChart) {
      this.usageTotalChart.destroy();
    }
    this.usageTotalChart = new Chart(this.usageTotalCanvas.nativeElement, chartData);
  }

  public loadData() {
    this.waterUsageService.getLocations()
      .pipe(takeWhile(() => this.alive))
      .subscribe((dataloc) => {
        this.locations = dataloc.locations;
        const ilocations = dataloc.locations.map(x => x.id);
        this.waterUsageService.getIndexes({})
          .pipe(takeWhile(() => this.alive))
          .subscribe((data) => {
            this.indexes = {};
            for (const key in ilocations) {
              const location = ilocations[key];
              this.indexes[location] =
                data.indexes
                  .filter((v, i, a) => v.location === location)
                  .map((v, i, a) => Object.assign({ x: this.getMonth(new Date(v.date)), y: i > 0 ? a[i].index - a[i - 1].index : 0 }))
                  .slice(1);
            }
            this.chartCreate();
          });
        this.waterUsageService.getInvoices({})
          .pipe(takeWhile(() => this.alive))
          .subscribe((data) => {
            this.invoices = data.invoices;
            this.chartCreate();
          });
      });
  }

}
