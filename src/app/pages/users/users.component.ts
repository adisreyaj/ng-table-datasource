import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Paginator } from '@app/components/paginate/paginate';
import { Sorter } from '@app/components/sort/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDataSource } from './users-data-source';
import { User } from './users.interface';
import { UserService } from './users.service';

@Component({
  selector: 'app-users',
  template: `
    <div class="border rounded-md shadow-md">
      <ng-container *ngIf="users$ | async as users">
        <table sorter>
          <thead>
            <tr class="h-10 bg-blue-200">
              <th ref="firstname" sortHeader>First name</th>
              <th ref="lastname" sortHeader>Last name</th>
              <th ref="birthday" sortHeader>Birthday</th>
            </tr>
          </thead>
          <tbody>
            <tr class="h-8" *ngFor="let user of users; trackBy: trackBy">
              <td>
                <div>{{ user?.firstname }}</div>
              </td>
              <td>
                <div>{{ user?.lastname }}</div>
              </td>
              <td>
                <div>{{ user?.birthday }}</div>
              </td>
            </tr>
          </tbody>
        </table>
        <app-paginate [count]="(totalCount$ | async) || 0"></app-paginate>
      </ng-container>
    </div>
  `,
  styles: [
    `
      table {
        width: 50%;
        min-width: 500px;
      }

      th {
        min-width: 100px;
        cursor: pointer;
        padding: 0 1rem;
      }
      td {
        padding: 0 1rem;
      }

      tbody tr:nth-child(even) {
        background: hsl(0, 0%, 97%);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  userDataSource = new UserDataSource();
  users$: Observable<User[]> = this.userDataSource.data$;
  totalCount$: Observable<number> = this.userDataSource.initialData$.pipe(map((data) => data.length));

  @ViewChild(Sorter) sorter: Sorter | null = null;
  @ViewChild(Paginator) paginator: Paginator | null = null;

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const users$ = this.userService.getUsers();
    this.userDataSource.updateData(users$);
  }

  ngAfterViewInit() {
    this.userDataSource.sort = this.sorter;
    this.userDataSource.paginate = this.paginator;
    this.cdr.detectChanges();
  }

  trackBy(_: number, user: User) {
    return user.email;
  }

  ngOnDestroy() {
    this.userDataSource.destroy();
  }
}
