import { TableDataSource } from 'src/app/shared/classes/table-data-source';
import { SortChangeEvent } from 'src/app/shared/components/sort/sort.interface';
import { User } from './users.interface';

export class UserDataSource extends TableDataSource<User> {
  constructor() {
    super([]);
  }
  sortLogic(data: User[], { column, direction }: SortChangeEvent) {
    let sorted = data;
    if (direction === null) {
      return sorted;
    }
    switch (column) {
      case 'birthday':
        sorted = [...data].sort((a, b) => {
          const order = direction === 'asc' ? 1 : -1;
          if (new Date(a[column]) > new Date(b[column])) {
            return order;
          }
          return order * -1;
        });
        return sorted;
      default:
        sorted = [...data].sort((a: any, b: any) => {
          const order = direction === 'asc' ? 1 : -1;
          if (a[column] > b[column]) {
            return order;
          }
          return order * -1;
        });
        return sorted;
    }
  }
}
