import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedandStackedChartComponent } from './GroupedandStacked-chart.component';

describe('GroupedandStackedChartComponent', () => {
  let component: GroupedandStackedChartComponent;
  let fixture: ComponentFixture<GroupedandStackedChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupedandStackedChartComponent]
    });
    fixture = TestBed.createComponent(GroupedandStackedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
