import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RemixIconModule, RiArrowLeftLine, RiArrowRightLine, RiArrowUpLine } from 'angular-remix-icon';
const ICONS = {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiArrowUpLine,
};

@NgModule({
  declarations: [],
  imports: [CommonModule, RemixIconModule.configure(ICONS)],
  exports: [RemixIconModule],
})
export class IconModule {}
