import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageSingleChartComponent } from './usage-single-chart.component';

describe('UsageSingleChartComponent', () => {
  let component: UsageSingleChartComponent;
  let fixture: ComponentFixture<UsageSingleChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageSingleChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageSingleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
