import { TestBed } from '@angular/core/testing';

import { ConteudodbService } from './conteudodb.service';

describe('ConteudodbService', () => {
  let service: ConteudodbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConteudodbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
