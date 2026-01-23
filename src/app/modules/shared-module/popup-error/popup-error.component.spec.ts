import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupErrorComponent } from './popup-error.component';

describe('PopupErrorComponent', () => {
  let component: PopupErrorComponent;
  let fixture: ComponentFixture<PopupErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupErrorComponent]
    });
    fixture = TestBed.createComponent(PopupErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
