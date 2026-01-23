import { TestBed } from '@angular/core/testing';

import { ScatterchartService } from './scatterchart.service';

describe('ScatterchartService', () => {
  let service: ScatterchartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScatterchartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
