import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCustomComponent } from './popup-custom.component';

describe('PopupCustomComponent', () => {
  let component: PopupCustomComponent;
  let fixture: ComponentFixture<PopupCustomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupCustomComponent]
    });
    fixture = TestBed.createComponent(PopupCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
