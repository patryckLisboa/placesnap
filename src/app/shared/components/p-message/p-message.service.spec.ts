import { TestBed } from '@angular/core/testing';

import { PMessageService } from './p-message.service';

describe('PMessageService', () => {
  let service: PMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
