import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdSplitterComponent } from './nd-splitter.component';

describe('NdSplitterComponent', () => {
  let component: NdSplitterComponent;
  let fixture: ComponentFixture<NdSplitterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NdSplitterComponent]
    });
    fixture = TestBed.createComponent(NdSplitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
