import { TestBed } from '@angular/core/testing';

import { PaymentsFirestoreService } from './paymentsfirestore.service';

describe('PaymentsFirestoreService', () => {
  let service: PaymentsFirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentsFirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
 