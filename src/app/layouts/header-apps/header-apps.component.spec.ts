import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderAppsComponent } from './header-apps.component';

describe('HeaderAppsComponent', () => {
  let component: HeaderAppsComponent;
  let fixture: ComponentFixture<HeaderAppsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderAppsComponent]
    });
    fixture = TestBed.createComponent(HeaderAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
