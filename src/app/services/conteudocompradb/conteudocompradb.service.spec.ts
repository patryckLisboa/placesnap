import { TestBed } from '@angular/core/testing';

import { ConteudocompradbService } from './conteudocompradb.service';

describe('ConteudocompradbService', () => {
  let service: ConteudocompradbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConteudocompradbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
