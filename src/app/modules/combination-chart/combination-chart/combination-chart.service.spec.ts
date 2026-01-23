import { TestBed } from '@angular/core/testing';

import { CombinationChartService } from './combination-chart.service';

describe('CombinationChartService', () => {
  let service: CombinationChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CombinationChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
