import { TestBed } from '@angular/core/testing';

import { RxjsOperatorServiceService } from './rxjs-operator-service.service';

describe('RxjsOperatorServiceService', () => {
  let service: RxjsOperatorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RxjsOperatorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
