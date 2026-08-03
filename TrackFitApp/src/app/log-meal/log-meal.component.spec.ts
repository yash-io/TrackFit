import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogMealComponent } from './log-meal.component';

describe('LogMealComponent', () => {
  let component: LogMealComponent;
  let fixture: ComponentFixture<LogMealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogMealComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogMealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
