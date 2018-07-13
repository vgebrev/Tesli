import { convertToParamMap, ParamMap, Params, ActivatedRouteSnapshot } from '@angular/router';
import { ReplaySubject } from 'rxjs';

export class ActivatedRouteStub {
  private subject = new ReplaySubject<ParamMap>();

  constructor(initialParams?: Params) {
    this.snapshot = new ActivatedRouteSnapshot();
    this.setParamMap(initialParams);
  }

  readonly paramMap = this.subject.asObservable();
  readonly snapshot: ActivatedRouteSnapshot;

  setParamMap(params?: Params) {
    this.subject.next(convertToParamMap(params));
    this.snapshot.params = params;
  }
}
