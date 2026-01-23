import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdDatepickerComponent } from './nd-datepicker.component';

describe('NdDatepickerComponent', () => {
  let component: NdDatepickerComponent;
  let fixture: ComponentFixture<NdDatepickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NdDatepickerComponent]
    });
    fixture = TestBed.createComponent(NdDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
