import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderappsComponent } from './header-apps.component';

describe('HeaderComponent', () => {
  let component: HeaderappsComponent;
  let fixture: ComponentFixture<HeaderappsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderappsComponent]
    });
    fixture = TestBed.createComponent(HeaderappsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
