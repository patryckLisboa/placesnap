import { TestBed } from '@angular/core/testing';

import { FirestoreStripePaymentsService } from './firestore-stripe-payments.service';

describe('FirestoreStripePaymentsService', () => {
  let service: FirestoreStripePaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreStripePaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
