import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdDynamicFormsComponent } from './nd-dynamic-forms.component';

describe('NdDynamicFormsComponent', () => {
  let component: NdDynamicFormsComponent;
  let fixture: ComponentFixture<NdDynamicFormsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NdDynamicFormsComponent]
    });
    fixture = TestBed.createComponent(NdDynamicFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
