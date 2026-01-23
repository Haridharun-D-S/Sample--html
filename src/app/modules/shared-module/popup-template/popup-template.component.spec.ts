import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupTemplateComponent } from './popup-template.component';

describe('PopupTemplateComponent', () => {
  let component: PopupTemplateComponent;
  let fixture: ComponentFixture<PopupTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupTemplateComponent]
    });
    fixture = TestBed.createComponent(PopupTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
