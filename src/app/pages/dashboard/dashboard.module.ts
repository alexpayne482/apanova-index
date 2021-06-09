import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ThemeModule } from 'theme';
import { MaterialAngularSelectModule } from 'app/components/material-angular-select';

import { DashboardComponent } from './dashboard.component';
import { WeatherComponent } from 'app/components/weather';
import { UsageTotalChartComponent } from 'app/components/usage-total-chart';
import { UsageSingleChartComponent } from 'app/components/usage-single-chart';
import { CurrentIndexCardComponent } from 'app/components/current-index-card';

@NgModule({
  imports: [
    CommonModule,
    MaterialAngularSelectModule,
    ThemeModule,
  ],
  declarations: [
    CurrentIndexCardComponent,
    DashboardComponent,
    UsageTotalChartComponent,
    UsageSingleChartComponent,
    WeatherComponent,
  ],
  exports: [
    WeatherComponent,
  ],
})

export class DashboardModule {}
