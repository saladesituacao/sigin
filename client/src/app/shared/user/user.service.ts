import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class UserService {

  private userAnnouncedSource = new Subject<{}>();

  cicloAnnounced$ = this.userAnnouncedSource.asObservable();

  constructor() {  }

  announceUserChange(item: any) {
    this.userAnnouncedSource.next(item);
  }
}
