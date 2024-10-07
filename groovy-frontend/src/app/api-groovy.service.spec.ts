import { TestBed } from '@angular/core/testing';

import { ApiGroovyService } from './api-groovy.service';

describe('ApiGroovyService', () => {
  let service: ApiGroovyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiGroovyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
