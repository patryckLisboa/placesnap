import { TestBed } from '@angular/core/testing';

import { CompradbService } from './compradb.service';

describe('CompradbService', () => {
  let service: CompradbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompradbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
