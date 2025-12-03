import { TestBed } from '@angular/core/testing';

import { Ward } from './ward';

describe('Ward', () => {
  let service: Ward;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ward);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
