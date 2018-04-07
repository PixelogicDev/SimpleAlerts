// https://github.com/cornflourblue/angular2-communicating-between-components/blob/master/app/_services/message.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MessageService {
  private subject = new Subject<any>();

  sendEvent(event: any) {
    this.subject.next(event);
  }

  subscribeToEvent(): Observable<any> {
    return this.subject.asObservable();
  }
}
