import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdStepperComponent } from './nd-stepper.component';

describe('NdStepperComponent', () => {
  let component: NdStepperComponent;
  let fixture: ComponentFixture<NdStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NdStepperComponent]
    });
    fixture = TestBed.createComponent(NdStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
