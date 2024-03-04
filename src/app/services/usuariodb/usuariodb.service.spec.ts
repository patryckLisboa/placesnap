import { TestBed } from '@angular/core/testing';

import { UsuariodbService } from './usuariodb.service';

describe('UsuariodbService', () => {
  let service: UsuariodbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuariodbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
