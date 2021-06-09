import { Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { WaterUsageService } from '@services/*';
import { takeWhile } from 'rxjs/internal/operators';
import { UpgradableComponent } from '../../../theme/components/upgradable/upgradable.component';

const HEADER_INVOICE = [
  {
    id: 'date',
    name: 'Date',
    sort: 0,
  },
  {
    id: 'index',
    name: 'Index',
    sort: 0,
  },
  {
    id: 'quantity',
    name: 'Quantity',
    sort: 0,
  },
  {
    id: 'value',
    name: 'Value (RON)',
    sort: 0,
  },
  {
    id: 'status',
    name: 'Status',
    sort: 0,
  },
];

const PERIOD_TYPES = {
  today: 'today',
  yesterday: 'yesterday',
  week: 'week',
  month: 'month',
  year: 'year',
};

@Component({
  selector: 'app-invoices-wrap-table',
  styleUrls: ['./invoices-wrap-table.component.scss'],
  templateUrl: './invoices-wrap-table.component.html',
})
export class InvoicesWrapTableComponent extends UpgradableComponent implements OnInit, OnDestroy {
  @HostBinding('class.mdl-grid') public readonly mdlGrid = true;
  @HostBinding('class.mdl-cell') public readonly mdlCell = true;
  @HostBinding('class.mdl-cell--12-col-desktop') public readonly mdlCell12ColDesktop = true;
  @HostBinding('class.mdl-cell--12-col-tablet') public readonly mdlCell12ColTablet = true;
  @HostBinding('class.mdl-cell--4-col-phone') public readonly mdlCell4ColPhone = true;
  @HostBinding('class.mdl-cell--top') public readonly mdlCellTop = true;
  @HostBinding('class.ui-tables') public readonly uiTables = true;

  @Input() public config: {
    type: 'invoice', // 'invoice' | 'prediction'
    isAdmin: true,
    isPagination: true,
    isPeriod: false,
    title: 'Invoices',
    isFilter: false,
  };
  @Input() public filterParams: any;
  public readonly periodTypes = PERIOD_TYPES;

  public alive = true;
  public data: any[];
  public period = PERIOD_TYPES.year;
  public numPage = 1;
  public currentPage = 1;
  public headers = [];
  public filterValues = {};

  constructor(public waterUsageService: WaterUsageService) {
    super();
  }

  public ngOnInit() {
    this.headers = HEADER_INVOICE;
    if (this.config.isFilter) {
      this.waterUsageService.filterValue()
        .pipe(takeWhile(() => this.alive))
        .subscribe((filterValue) => {
          this.filterValues = filterValue;
          this.loadData(this.filterValues);
        });
    }
    this.filterValues = { period: this.period };
    this.loadData(this.filterValues);
  }

  public ngOnDestroy() {
    this.alive = false;
  }

  public changePeriod(period) {
    if (this.period !== period) {
      this.period = period;
      this.filterValues = { period: this.period };
      this.loadData(this.filterValues);
    }
  }

  public loadData(filters: object = {}, page: number = null) {
    let fullFilter = Object.assign({}, filters);
    if (this.config.isPagination) {
      this.currentPage = page ? page : 1;
      fullFilter = Object.assign({}, fullFilter, { page: this.currentPage });
    }

    this.waterUsageService.getInvoices(fullFilter)
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.data = data.invoices
          .map((v, i, a) => Object.assign({ id: v.id, date: v.date, index: v.index, quantity: i > 0 ? a[i].index - a[i - 1].index : 0, value: v.value, status: 'open' }))
          .slice(1)
          .sort((a, b) => new Date(new Date(b.date).getTime() - new Date(a.date).getTime()).getTime());
        this.numPage = 1;       // data.pages;
        if (page === null) {    // update by filter or sorting. go to first page
          this.currentPage = 1; // (data.pages > 0) ? 1 : 0;
        }
      });
  }

  public changePage(page) {
    if (page !== this.currentPage) {
      this.currentPage = page;
      this.loadData(this.filterValues, page);
    }
  }

  public onClick() {
    setTimeout(() => componentHandler.upgradeDom(), 200);
  }
}
