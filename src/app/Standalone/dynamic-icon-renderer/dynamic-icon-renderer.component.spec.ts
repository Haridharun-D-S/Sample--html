import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicIconRendererComponent } from './dynamic-icon-renderer.component';

describe('DynamicIconRendererComponent', () => {
  let component: DynamicIconRendererComponent;
  let fixture: ComponentFixture<DynamicIconRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicIconRendererComponent]
    });
    fixture = TestBed.createComponent(DynamicIconRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
