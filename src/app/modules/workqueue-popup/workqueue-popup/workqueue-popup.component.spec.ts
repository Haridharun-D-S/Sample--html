import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkqueuePopupComponent } from './workqueue-popup.component';

describe('WorkqueuePopupComponent', () => {
  let component: WorkqueuePopupComponent;
  let fixture: ComponentFixture<WorkqueuePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkqueuePopupComponent]
    });
    fixture = TestBed.createComponent(WorkqueuePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
