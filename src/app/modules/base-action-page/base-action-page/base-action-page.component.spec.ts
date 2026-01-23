import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseActionPageComponent } from './base-action-page.component';

describe('BaseActionPageComponent', () => {
  let component: BaseActionPageComponent;
  let fixture: ComponentFixture<BaseActionPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BaseActionPageComponent]
    });
    fixture = TestBed.createComponent(BaseActionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
