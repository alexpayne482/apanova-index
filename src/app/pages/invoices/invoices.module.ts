import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ThemeModule } from 'theme';

import { FormWrapperComponent } from '../../components/form-wrapper';
import { InvoicesWrapTableComponent } from '../../components/invoices-wrap-table';
import { PaginationComponent } from '../../components/pagination';
import { InvoiceDetailComponent } from './invoice-detail';
import { InvoicesComponent } from './invoices.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    RouterModule,
    FormsModule,
  ],
  declarations: [
    InvoicesWrapTableComponent,
    InvoicesComponent,
    InvoiceDetailComponent,
    // PaginationComponent,
    // FormWrapperComponent,
  ],
  providers: [],
})
export class InvoicesModule {
}
