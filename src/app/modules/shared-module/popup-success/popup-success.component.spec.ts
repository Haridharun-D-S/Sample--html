import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupSuccessComponent } from './popup-success.component';

describe('PopupSuccessComponent', () => {
  let component: PopupSuccessComponent;
  let fixture: ComponentFixture<PopupSuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupSuccessComponent]
    });
    fixture = TestBed.createComponent(PopupSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
