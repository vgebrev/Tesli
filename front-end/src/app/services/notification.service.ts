import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Notification } from '../models/notification';
export { Notification };

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public notification$: Subject<Notification> = new Subject();
  constructor() { }
}
