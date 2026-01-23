import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HILComponent } from './hil.component';

describe('HILComponent', () => {
  let component: HILComponent;
  let fixture: ComponentFixture<HILComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HILComponent]
    });
    fixture = TestBed.createComponent(HILComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
