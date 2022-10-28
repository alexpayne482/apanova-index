import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { WaterUsageService } from '@services/*';
import { takeWhile } from 'rxjs/internal/operators';

@Component({
  selector: 'app-current-index-card',
  templateUrl: './current-index-card.component.html',
  styleUrls: ['./current-index-card.component.scss'],
})
export class CurrentIndexCardComponent implements AfterViewInit, OnInit, OnDestroy {

  public months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  public alive = true;

  public locations: any[];

  public locationNames = [''];
  public locationFilter = { id: 0, name: ' ' };
  public locationKeys = { value: 'id', title: 'name' };

  public indexes: any[];
  public bills: any[];
  public location;

  public toPay = '0 RON';
  public toPayDate = '';
  public currentIndex = 0;
  public currentIndexDate = '';
  public newIndex = 0;
  public newIndexDate = '';

  constructor(public waterUsageService: WaterUsageService) {
    this.indexes = [];
    this.locations = [this.locationFilter];
    this.newIndexDate = this.getDateStr(new Date());
  }

  ngAfterViewInit(): void {
  }

  public ngOnInit() {
    this.loadData();
  }

  public ngOnDestroy() {
    this.alive = false;
  }

  public changeLocation(location) {
    // console.log('changed location \'${location.name}\' id: ${location.id}');
    this.location = location;
    this.toPay = '0 RON';
    this.currentIndex = 0;
    this.newIndex = 0;
    this.loadIndexes(location);
    this.loadBills(location);
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

  getDateStr(date) {
    return date.getDate() + ' ' + this.months[date.getMonth()];
  }

  public loadData() {
    this.waterUsageService.getLocations()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.locations = data.locations;
        this.locationNames = data.locations.map(x => x.name);
        this.locationFilter = this.locations[0]; // will call changeLocation()
      });
  }

  // TODO: add vtable in DB for spliting invoices based on personal consumption

  public loadBills(locationFilter: object = {}) {
    const fullFilter = { location: locationFilter['id'] };
    // console.log('get water bills for ' + JSON.stringify(fullFilter));
    this.waterUsageService.getBills(fullFilter)
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.bills = [].concat(data).sort((a, b) => new Date(new Date(b.date).getTime() - new Date(a.date).getTime()).getTime());
        if (this.bills.length > 0) {
          const lastBill = this.bills[0];
          console.log(lastBill);
        }
      });
  }

  public loadIndexes(locationFilter: object = {}) {
    const fullFilter = { location: locationFilter['id'] };
    // console.log('get water index for ' + JSON.stringify(fullFilter));
    this.waterUsageService.getIndexes(fullFilter)
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.indexes = [].concat(data).sort((a, b) => new Date(new Date(b.date).getTime() - new Date(a.date).getTime()).getTime());
        if (this.indexes.length > 0) {
          const lastIndex = this.indexes[0];
          console.log(lastIndex);
          this.currentIndex = lastIndex.index;
          this.currentIndexDate = this.getDateStr(new Date(lastIndex.date));
          // const currentMonth = this.getMonth(new Date());
          // const currentIndex = this.indexes.find(i => this.getMonth(new Date(i.date)) === currentMonth);
          // if (currentIndex) {
          //   this.currentIndex = currentIndex.index;
          //   this.currentIndexDate = this.getDateStr(new Date(currentIndex.date));
          // }
        }
      });
  }

}
