import { Observable, SchedulerLike } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { IResults } from './Member';

export class SharedReplayRefresh {

  private sharedReplay$!: Observable<IResults>;
  private subscriptionTime!: number;


 sharedReplayTimerRefresh(
     source: Observable<IResults>, bufferSize: number = 1,
     windowTime: number = 3000000,  scheduler?: SchedulerLike): Observable<IResults> {

      const currentTime = new Date().getTime();
      if (!this.sharedReplay$ ||
          currentTime - this.subscriptionTime > windowTime) {
          this.sharedReplay$ = source.pipe(shareReplay(
              bufferSize, windowTime, scheduler));
          this.subscriptionTime = currentTime;
      }

      return this.sharedReplay$;
  }
}
