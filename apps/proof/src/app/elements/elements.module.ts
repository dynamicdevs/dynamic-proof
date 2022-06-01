import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridWrapperComponent } from './grid-wrapper/grid-wrapper.component';

@NgModule({
  declarations: [GridWrapperComponent],
  exports: [GridWrapperComponent],
  imports: [CommonModule],
})
export class ElementsModule {}
