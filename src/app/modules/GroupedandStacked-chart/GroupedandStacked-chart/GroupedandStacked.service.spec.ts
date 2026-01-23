import { TestBed } from '@angular/core/testing';
import { GroupedandStackedchartService } from './GroupedandStackedchart.service';

describe('GroupedandStackedchartService', () => {
  let service: GroupedandStackedchartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupedandStackedchartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
