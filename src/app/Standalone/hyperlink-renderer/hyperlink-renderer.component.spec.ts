import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HyperlinkRendererComponent } from './hyperlink-renderer.component';

describe('HyperlinkRendererComponent', () => {
  let component: HyperlinkRendererComponent;
  let fixture: ComponentFixture<HyperlinkRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HyperlinkRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HyperlinkRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
