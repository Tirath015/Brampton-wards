import { TestBed } from '@angular/core/testing';
import { ConstructionService } from './construction'; // Correct service import

describe('ConstructionService', () => {
  let service: ConstructionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConstructionService); // Inject the correct service
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
