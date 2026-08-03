import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreakDetailsComponent } from './streak-details.component';

describe('StreakDetailsComponent', () => {
  let component: StreakDetailsComponent;
  let fixture: ComponentFixture<StreakDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreakDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreakDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
