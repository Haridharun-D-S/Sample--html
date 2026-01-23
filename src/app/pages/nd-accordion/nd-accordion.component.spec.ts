import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdAccordionComponent } from './nd-accordion.component';

describe('NdAccordionComponent', () => {
  let component: NdAccordionComponent;
  let fixture: ComponentFixture<NdAccordionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NdAccordionComponent]
    });
    fixture = TestBed.createComponent(NdAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
