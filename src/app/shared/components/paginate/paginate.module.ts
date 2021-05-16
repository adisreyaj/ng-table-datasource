import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconModule } from '@app/modules/icon.module';
import { Paginator } from './paginate';

@NgModule({
  declarations: [Paginator],
  imports: [CommonModule, FormsModule, IconModule],
  exports: [Paginator],
})
export class PaginateModule {}
