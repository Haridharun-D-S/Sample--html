import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEntryPopupViewComponent } from './data-entry-popup-view.component';

describe('DataEntryPopupViewComponent', () => {
  let component: DataEntryPopupViewComponent;
  let fixture: ComponentFixture<DataEntryPopupViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataEntryPopupViewComponent]
    });
    fixture = TestBed.createComponent(DataEntryPopupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
