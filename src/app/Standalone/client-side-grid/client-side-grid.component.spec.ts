import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSideGridComponent } from './client-side-grid.component';

describe('ClientSideGridComponent', () => {
  let component: ClientSideGridComponent;
  let fixture: ComponentFixture<ClientSideGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientSideGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSideGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
