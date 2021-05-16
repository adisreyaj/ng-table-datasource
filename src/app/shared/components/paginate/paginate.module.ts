import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconModule } from '@app/modules/icon.module';
import { Paginator } from './paginate';
import { PageSizePipe } from './paginate.pipe';

@NgModule({
  declarations: [Paginator, PageSizePipe],
  imports: [CommonModule, FormsModule, IconModule],
  exports: [Paginator],
})
export class PaginateModule {}
