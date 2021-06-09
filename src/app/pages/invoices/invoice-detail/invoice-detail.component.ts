import { Component, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WaterUsageService } from '@services/water-usage.service';
import { UpgradableComponent } from 'theme/components/upgradable';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
})
export class InvoiceDetailComponent extends UpgradableComponent implements OnInit {
  @HostBinding('class.employer-form') public readonly employerForm = true;
  @ViewChild('form') form;

  public isNew = false;
  public invoice;

  constructor(
    public waterUsageService: WaterUsageService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    if (id > 0) {
      this.waterUsageService.getInvoice(id)
        .subscribe((invoice) => {
          this.invoice = invoice;
          console.log(JSON.stringify(this.invoice));
        });
    } else {
      this.isNew = true;
      this.invoice = {
        id: 0,
        date: new Date(),
        index: '',
        quantity: '',
        value: '',
        status: 'open',
      };
    }
  }
}
