import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdHILComponent } from './nd-hil.component';

describe('NdHILComponent', () => {
  let component: NdHILComponent;
  let fixture: ComponentFixture<NdHILComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NdHILComponent]
    });
    fixture = TestBed.createComponent(NdHILComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
