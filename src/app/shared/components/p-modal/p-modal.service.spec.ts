import { TestBed } from '@angular/core/testing';

import { PModalService } from './p-modal.service';

describe('PModalService', () => {
  let service: PModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
