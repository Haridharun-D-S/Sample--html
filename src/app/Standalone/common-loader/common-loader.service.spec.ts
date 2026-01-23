import { TestBed } from '@angular/core/testing';

import { CommonLoaderService } from './common-loader.service';

describe('CommonLoaderService', () => {
  let service: CommonLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
