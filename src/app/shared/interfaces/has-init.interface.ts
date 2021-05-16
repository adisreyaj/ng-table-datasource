import { ReplaySubject } from 'rxjs';

export interface HasInitializer {
  initialized: ReplaySubject<void>;
}
