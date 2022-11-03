import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { WaterUsageService } from '@services/*';
import { takeWhile } from 'rxjs/internal/operators';

@Component({
  selector: 'app-current-index-card',
  templateUrl: './current-index-card.component.html',
  styleUrls: [],
})
export class CurrentIndexCardComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() public preSelectedLocation = 2;

  public months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  public alive = true;

  public locationKeys = { value: 'id', title: 'name' };
  public locationFilter = { id: 0, name: '' };

  public locations: any[] = [{}];

  public indexes: any[] = [];
  public bills: any[];

  public newIndexForm: FormGroup;

  public toPayDate = '';
  public currentIndexDate = '';
  public newIndexDate = '';

  public numberPattern = '^([0-9]*)$';
  public error: string;

  constructor(public waterUsageService: WaterUsageService, public fb: FormBuilder) {
    this.newIndexForm = this.fb.group({
      toPay: new FormControl({ value: '0 RON', disabled: true }),
      currentIndex: new FormControl({ value: 0, disabled: true }),
      newIndex: new FormControl(0, [Validators.required, Validators.pattern(this.numberPattern)]),
    }, { validator: this.onValidate });
  }

  ngAfterViewInit(): void {
  }

  public ngOnInit() {
    this.loadData(this.preSelectedLocation);
    this.newIndexForm.valueChanges.subscribe(() => {
      this.error = null;
    });
  }

  public ngOnDestroy() {
    this.alive = false;
  }

  public onInputChange(event) {
    event.target.required = true;
  }

  public onLocationChange(location) {
    // console.log(`IndexCard: changed location ${location.id} (\'${location.name}\')`);
    this.loadIndexes(location);
    this.loadBills(location);
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

  getDateStr(date) {
    return `${date.getDate()} ${this.months[date.getMonth()]}`;
  }

  public loadData(selectedLocation) {
    this.waterUsageService.getLocations()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.locations = data.locations; // [{ id: 0, name: 'general' }].concat(data.locations);
        this.locationFilter = this.locations[selectedLocation - 1]; // will call changeLocation()
      });
  }

  // TODO: add vtable in DB for spliting invoices based on personal consumption

  public loadBills(locationFilter: object = {}) {
    const fullFilter = { location: locationFilter['id'] };
    this.waterUsageService.getBills(fullFilter)
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.bills = [].concat(data).sort((a, b) => new Date(new Date(b.date).getTime() - new Date(a.date).getTime()).getTime());
        if (this.bills.length > 0) {
          const lastBill = this.bills[0];
          // console.log(lastBill);
        }
      });
  }

  public loadIndexes(locationFilter: object = {}) {
    const fullFilter = { location: locationFilter['id'] };
    this.waterUsageService.getIndexes(fullFilter)
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.indexes = [].concat(data).sort((a, b) => new Date(new Date(b.date).getTime() - new Date(a.date).getTime()).getTime());
        if (this.indexes.length > 0) {
          const lastIndex = this.indexes[0];
          this.currentIndexDate = this.getDateStr(new Date(lastIndex.date));
          this.newIndexDate = this.getDateStr(new Date());
          this.newIndexForm.setValue({ toPay: 'xxx RON', currentIndex: lastIndex.index, newIndex: lastIndex.index });
        }
      });
  }

  public onValidate(form: FormGroup) {
    const currentIndex = form.get('currentIndex');
    const newIndex = form.get('ewIndex');
    if (newIndex.value < currentIndex.value) {
      newIndex.setErrors({ customValidation:  `Invalid new index (must be >= ${currentIndex.value})` });
      // this.error = `Invalid new index (must be >= ${currentIndex.value})`;
    }
  }

  public saveIndex() {
    const fullFilter = { location: this.locationFilter['id'] };
    // console.log('IndexCard: save water index for ' + JSON.stringify(fullFilter));
    if (!this.newIndexForm.valid) {
      this.error = this.newIndexForm.get('newIndex').errors['customValidation'];
      return;
    }
  //   this.waterUsageService.setIndex(fullFilter, this.newIndex, this.newIndexDate)
  //     .pipe(takeWhile(() => this.alive))
  //     .subscribe((data) => {
  //       console.log('saved water index for ' + JSON.stringify(fullFilter) + ' ' + data);
  //     });
  }

}
