import { TestBed } from '@angular/core/testing';
import { MercadoColombiaService } from './mercado-colombia.service';

describe('MercadoColombiaService', () => {
  let service: MercadoColombiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MercadoColombiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

