import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcareModalComponent } from './ecare-modal.component';

describe('EcareModalComponent', () => {
  let component: EcareModalComponent;
  let fixture: ComponentFixture<EcareModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EcareModalComponent]
    });
    fixture = TestBed.createComponent(EcareModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
