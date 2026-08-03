import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminActiveusersComponent } from './admin-activeusers.component';

describe('AdminActiveusersComponent', () => {
  let component: AdminActiveusersComponent;
  let fixture: ComponentFixture<AdminActiveusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminActiveusersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminActiveusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
