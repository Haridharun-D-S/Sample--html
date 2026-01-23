import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignStandardsComponent } from './design-standards.component';

describe('DesignStandardsComponent', () => {
  let component: DesignStandardsComponent;
  let fixture: ComponentFixture<DesignStandardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesignStandardsComponent]
    });
    fixture = TestBed.createComponent(DesignStandardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
