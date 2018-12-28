import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class AnnounceUserService {

  private userAnnouncedSource = new Subject<{}>();

  cicloAnnounced$ = this.userAnnouncedSource.asObservable();

  constructor() {  }

  announceUserChange(item: {}) {
    this.userAnnouncedSource.next(item);
  }
}
