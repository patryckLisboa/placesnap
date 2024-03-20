import { TestBed } from '@angular/core/testing';

import { PImageuploadService } from './p-imageupload.service';

describe('PImageuploadService', () => {
  let service: PImageuploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PImageuploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
