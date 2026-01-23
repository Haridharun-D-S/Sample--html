import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordListingComponent } from './record-listing.component';

describe('RecordListingComponent', () => {
  let component: RecordListingComponent;
  let fixture: ComponentFixture<RecordListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecordListingComponent]
    });
    fixture = TestBed.createComponent(RecordListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
