import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentIndexCardComponent } from './current-index-card.component';

describe('CurrentIndexCardComponent', () => {
  let component: CurrentIndexCardComponent;
  let fixture: ComponentFixture<CurrentIndexCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentIndexCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentIndexCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
