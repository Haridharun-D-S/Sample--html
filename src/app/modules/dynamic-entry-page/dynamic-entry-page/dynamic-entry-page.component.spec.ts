import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicEntryPageComponent } from './dynamic-entry-page.component';

describe('DynamicEntryPageComponent', () => {
  let component: DynamicEntryPageComponent;
  let fixture: ComponentFixture<DynamicEntryPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicEntryPageComponent]
    });
    fixture = TestBed.createComponent(DynamicEntryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
