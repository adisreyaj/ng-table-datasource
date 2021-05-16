import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pageSize',
})
export class PageSizePipe implements PipeTransform {
  transform(count: number, pageSize: number) {
    return Math.floor(count / pageSize);
  }
}
