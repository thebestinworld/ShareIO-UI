import { TestBed } from '@angular/core/testing';

import { RevertService } from './revert.service';

describe('RevertService', () => {
  let service: RevertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RevertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
