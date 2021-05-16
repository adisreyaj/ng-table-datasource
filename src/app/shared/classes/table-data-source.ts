import { BehaviorSubject, combineLatest, isObservable, merge, Observable, of, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Paginator } from '../components/paginate/paginate';
import { PageChangeEvent } from '../components/paginate/paginate.interface';
import { Sorter } from '../components/sort/sort';
import { SortChangeEvent } from '../components/sort/sort.interface';

export abstract class TableDataSource<T> {
  private dataSubject = new BehaviorSubject<T[]>([]);
  data$ = this.dataSubject.asObservable();

  private initialDataSubject = new BehaviorSubject<T[]>([]);
  initialData$ = this.initialDataSubject.asObservable();

  private sortRef: Sorter | null = null;
  private paginateRef: Paginator | null = null;
  private dataSubscription: Subscription | null = null;

  set sort(sort: Sorter | null) {
    if (sort) {
      this.sortRef = sort;
      this.updateDataProducer();
    }
  }

  set paginate(paginate: Paginator | null) {
    if (paginate) {
      this.paginateRef = paginate;
      this.updateDataProducer();
    }
  }

  constructor(initialData: T[]) {
    this.initialDataSubject.next(initialData);
  }

  /**
   * The data which drives the table. It will accept
   * either array or an observable.
   * @param data - data for the table
   */
  updateData(data: T[] | Observable<T[]>) {
    const dataToPush = isObservable(data) ? data : of(data);
    const sub = dataToPush
      .pipe(
        tap((res) => {
          this.initialDataSubject.next(res);
          this.updateDataProducer();
        })
      )
      .subscribe();
    sub.unsubscribe();
  }

  abstract sortLogic(data: T[], sortEvent: SortChangeEvent): T[];

  destroy() {
    this.dataSubscription?.unsubscribe();
    this.dataSubscription = null;
  }

  private updateDataProducer() {
    const sortChange: Observable<SortChangeEvent | null | void> = this.sortRef
      ? merge(this.sortRef.sortChange, this.sortRef.initialized)
      : of(null);
    const pageChange: Observable<PageChangeEvent | null | void> = this.paginateRef
      ? merge(this.paginateRef.pageChange, this.paginateRef.initialized)
      : of(null);
    const sortedData = combineLatest([this.initialData$, sortChange]).pipe(map(this.sortData));
    const paginatedData = combineLatest([sortedData, pageChange]).pipe(map(([data]) => this.paginateData(data)));

    this.dataSubscription?.unsubscribe();
    this.dataSubscription = paginatedData.subscribe((data) => this.dataSubject.next(data));
  }

  private sortData = ([data, sortEvent]: [T[], SortChangeEvent | null | void]) => {
    if (!sortEvent) {
      return data;
    }
    return this.sortLogic([...data], sortEvent);
  };

  private paginateData(data: T[]): T[] {
    if (!this.paginateRef) {
      return data;
    }

    const startIndex = this.paginateRef.index * this.paginateRef.pageSize;
    return data.slice(startIndex, startIndex + this.paginateRef.pageSize);
  }
}
