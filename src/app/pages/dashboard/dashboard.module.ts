import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialAngularSelectModule } from 'app/components/material-angular-select';
import { ThemeModule } from 'theme';

import { DashboardComponent } from './dashboard.component';

import { CurrentIndexCardComponent } from 'app/components/current-index-card';
import { UsageChartComponent } from 'app/components/usage-chart';
import { WeatherComponent } from 'app/components/weather';

@NgModule({
  imports: [
    CommonModule,
    MaterialAngularSelectModule,
    ThemeModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    CurrentIndexCardComponent,
    DashboardComponent,
    UsageChartComponent,
    WeatherComponent,
  ],
  exports: [
    WeatherComponent,
  ],
})

export class DashboardModule {}
