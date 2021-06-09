import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageTotalChartComponent } from './usage-total-chart.component';

describe('UsageTotalChartComponent', () => {
  let component: UsageTotalChartComponent;
  let fixture: ComponentFixture<UsageTotalChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageTotalChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageTotalChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
