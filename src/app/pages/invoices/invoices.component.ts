import { Component } from '@angular/core';

@Component({
  selector: 'app-invoices',
  styleUrls: ['./invoices.component.scss'],
  templateUrl: './invoices.component.html',
})
export class InvoicesComponent {
  public config = {
    type: 'invoice',
    isAdmin: true,
    isPagination: true,
    isPeriod: true,
    title: 'Invoices',
    isFilter: true,
  };
}
