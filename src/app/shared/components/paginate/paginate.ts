import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HasInitializer } from '@app/interfaces/has-init.interface';
import { ReplaySubject } from 'rxjs';
import { PageChangeEvent } from './paginate.interface';

@Component({
  selector: 'app-paginate',
  template: ` <div class="flex items-center justify-between p-2 space-x-4">
    <div>
      <select name="page-size" class="p-1 rounded-md" [(ngModel)]="pageSize" (ngModelChange)="pageSizeChange($event)">
        <ng-container *ngFor="let item of pageSizes">
          <option [value]="item">{{ item }}</option>
        </ng-container>
      </select>
    </div>
    <div class="flex space-x-4">
      <div class="flex space-x-2">
        <button [disabled]="index === 0" (click)="prev()">
          <rmx-icon name="arrow-left-line"></rmx-icon>
          <span>Prev</span>
        </button>
      </div>
      <div class="flex space-x-2">
        <button [disabled]="index === data?.length" (click)="next()">
          <span>Next</span>
          <rmx-icon name="arrow-right-line"></rmx-icon>
        </button>
      </div>
    </div>
  </div>`,
  styles: [
    `
      button {
        @apply flex space-x-2 items-center px-2 py-1 bg-gray-200 rounded-md;
        &:focus {
          outline: none;
          &:not(:hover) {
            @apply ring-blue-600 ring-offset-transparent ring-2;
          }
        }
        &:hover {
          @apply bg-blue-400;
        }
        &:disabled {
          @apply bg-gray-100 text-gray-400 cursor-not-allowed;
        }

        rmx-icon {
          width: 1.2rem;
          height: 1.2rem;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Paginator implements OnInit, HasInitializer {
  index = 0;
  @Input() pageSize = 5;
  @Input() data: any[] = [];
  @Input() pageSizes: number[] = [5, 10, 15];
  @Output() pageChange = new EventEmitter<PageChangeEvent>();

  initialized = new ReplaySubject<void>(1);
  pageSizeControl = new FormControl(this.pageSize ? this.pageSize : this.pageSizes[0]);
  constructor() {}
  ngOnInit(): void {
    this.initialized.next();
  }

  pageSizeChange(value: number) {
    this.pageChange.emit({
      length: this.data.length,
      index: this.index,
      pageSize: value,
    });
  }

  next() {
    this.index += 1;
    this.pageChange.emit({
      length: this.data.length,
      index: this.index,
      pageSize: this.pageSize,
    });
  }
  prev() {
    this.index -= 1;
    this.pageChange.emit({
      length: this.data.length,
      index: this.index,
      pageSize: this.pageSize,
    });
  }
}
