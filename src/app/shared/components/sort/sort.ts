import { Component, Directive, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { HasInitializer } from '@app/interfaces/has-init.interface';
import { ReplaySubject } from 'rxjs';
import { SortChangeEvent, SortDirection } from './sort.interface';

@Directive({
  selector: '[sorter]',
})
export class Sorter implements OnInit, HasInitializer {
  active: string | null = null;
  direction: SortDirection = null;
  initialized = new ReplaySubject<void>(1);

  @Output() sortChange = new EventEmitter<SortChangeEvent>();
  ngOnInit(): void {
    this.initialized.next();
  }
  sort(column: string) {
    let direction = this.direction;
    if (this.active !== column) {
      this.direction = null;
      this.active = column;
    }
    if (this.direction === null) {
      direction = 'asc';
    } else if (this.direction === 'asc') {
      direction = 'desc';
    } else if (this.direction === 'desc') {
      direction = null;
    }
    this.sortChange.emit({
      column,
      direction,
    });
    this.direction = direction;
  }
}

@Component({
  selector: '[sortHeader]',
  template: `
    <div class="sort-col">
      <ng-content></ng-content>
      <div
        [class]="{
          arrow: true,
          hide: sorter?.active !== ref || sorter?.direction === null,
          asc: sorter?.active === ref && sorter?.direction === 'asc',
          desc: sorter?.active === ref && sorter?.direction === 'desc'
        }"
      >
        <rmx-icon name="arrow-up-line"></rmx-icon>
      </div>
    </div>
  `,
  styles: [
    `
      .sort-col {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      rmx-icon {
        width: 14px;
        height: 14px;
      }
      .arrow {
        font-size: 14px;
        &.hide {
          opacity: 0;
        }
        &.desc {
          transform: rotate(180deg);
        }
      }
    `,
  ],
})
export class SortHeader {
  @Input() ref = '';

  @HostListener('click')
  sort() {
    this.sorter.sort(this.ref);
  }
  constructor(public sorter: Sorter) {}
}
