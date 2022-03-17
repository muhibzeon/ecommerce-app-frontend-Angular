import { TestBed } from '@angular/core/testing';

import { LuvtoFormService } from './luvto-form.service';

describe('LuvtoFormService', () => {
  let service: LuvtoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LuvtoFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
