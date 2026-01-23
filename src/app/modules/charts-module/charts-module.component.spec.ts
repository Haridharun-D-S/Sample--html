import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsModuleComponent } from './charts-module.component';

describe('ChartsModuleComponent', () => {
  let component: ChartsModuleComponent;
  let fixture: ComponentFixture<ChartsModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartsModuleComponent]
    });
    fixture = TestBed.createComponent(ChartsModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
