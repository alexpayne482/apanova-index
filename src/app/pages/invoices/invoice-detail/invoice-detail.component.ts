import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WaterUsageService } from '@services/water-usage.service';
import { UpgradableComponent } from 'theme/components/upgradable';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
})
export class InvoiceDetailComponent extends UpgradableComponent implements OnInit {
  @HostBinding('class.employer-form') public readonly employerForm = true;

  public invoice;

  @ViewChild('form') form;

  constructor(
    public waterUsageService: WaterUsageService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    this.waterUsageService.getInvoice(+this.route.snapshot.paramMap.get('id'))
      .subscribe((invoice) => {
        this.invoice = invoice;
        console.log(JSON.stringify(this.invoice));
      });
  }
}
