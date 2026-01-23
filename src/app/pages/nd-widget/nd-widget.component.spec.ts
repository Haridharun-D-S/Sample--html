import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdWidgetComponent } from './nd-widget.component';

describe('NdWidgetComponent', () => {
  let component: NdWidgetComponent;
  let fixture: ComponentFixture<NdWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NdWidgetComponent]
    });
    fixture = TestBed.createComponent(NdWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
