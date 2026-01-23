import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectRendererComponent } from './select-renderer.component';

describe('SelectRendererComponent', () => {
  let component: SelectRendererComponent;
  let fixture: ComponentFixture<SelectRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectRendererComponent]
    });
    fixture = TestBed.createComponent(SelectRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
