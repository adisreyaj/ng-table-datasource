import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconModule } from '@app/modules/icon.module';
import { Sorter, SortHeader } from './sort';

@NgModule({
  declarations: [Sorter, SortHeader],
  imports: [CommonModule, IconModule],
  exports: [Sorter, SortHeader],
})
export class SortModule {}
