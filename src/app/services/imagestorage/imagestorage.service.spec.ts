import { TestBed } from '@angular/core/testing';

import { ImagestorageService } from './imagestorage.service';

describe('ImagestorageService', () => {
  let service: ImagestorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagestorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
