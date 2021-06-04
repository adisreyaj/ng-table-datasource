import { BehaviorSubject, combineLatest, isObservable, merge, Observable, of, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Paginator } from '../components/paginate/paginate';
import { PageChangeEvent } from '../components/paginate/paginate.interface';
import { Sorter } from '../components/sort/sort';
import { SortChangeEvent } from '../components/sort/sort.interface';

export abstract class TableDataSource<T> {
  /**
   * Observable that is used to drive the table
   */
  private dataSubject = new BehaviorSubject<T[]>([]);
  data$ = this.dataSubject.asObservable();

  /**
   * Store the raw data for the table. The table to be shown
   * in table can be filtered or sorted.
   */
  private initialDataSubject = new BehaviorSubject<T[]>([]);
  initialData$ = this.initialDataSubject.asObservable();

  private sortRef: Sorter | null = null;
  private paginateRef: Paginator | null = null;
  private dataSubscription: Subscription | null = null;

  /**
   * Connector for sort directive
   */
  set sort(sort: Sorter | null) {
    if (sort) {
      this.sortRef = sort;
      this.updateDataProducer();
    }
  }

  /**
   * Connector for paginator component
   */
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
    const sortedData = combineLatest([this.initialData$, sortChange]).pipe(
      map(([initialData, event]) => this.sortData({ data: initialData, sortEvent: event }))
    );
    const paginatedData = combineLatest([sortedData, pageChange]).pipe(map(([data]) => this.paginateData(data)));

    this.dataSubscription?.unsubscribe();
    this.dataSubscription = paginatedData.subscribe((data) => this.dataSubject.next(data));
  }

  /**
   * Sort the data based on the sort options
   * @param - data and the sort event
   * @returns - sorted array
   */
  private sortData = ({ data, sortEvent }: { data: T[]; sortEvent: SortChangeEvent | null | void }) => {
    if (!sortEvent) {
      return data;
    }
    return this.sortLogic([...data], sortEvent);
  };

  /**
   * The data will be paginated and the splice of the original data will be
   * returned.
   * @param data - the sorted data
   * @returns - paginated data
   */
  private paginateData(data: T[]): T[] {
    if (!this.paginateRef) {
      return data;
    }
    const startIndex = this.paginateRef.index * +this.paginateRef.pageSize;
    return data.slice(startIndex, startIndex + +this.paginateRef.pageSize);
  }
}
