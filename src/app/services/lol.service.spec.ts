import { TestBed } from '@angular/core/testing';

import { LolService } from './lol.service';

describe('LolService', () => {
  let service: LolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
