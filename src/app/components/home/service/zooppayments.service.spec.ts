import { TestBed } from '@angular/core/testing';

import { ZoopService } from './zooppayments.service';

describe('ZoopService', () => {
  let service: ZoopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZoopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
 