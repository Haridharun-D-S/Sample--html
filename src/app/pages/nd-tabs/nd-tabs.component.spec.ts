import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdTabsComponent } from './nd-tabs.component';

describe('NdTabsComponent', () => {
  let component: NdTabsComponent;
  let fixture: ComponentFixture<NdTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NdTabsComponent]
    });
    fixture = TestBed.createComponent(NdTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
