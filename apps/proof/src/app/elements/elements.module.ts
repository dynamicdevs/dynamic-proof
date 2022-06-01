import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridWrapperComponent } from './grid-wrapper/grid-wrapper.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [GridWrapperComponent, NavbarComponent],
  exports: [GridWrapperComponent, NavbarComponent],
  imports: [CommonModule],
})
export class ElementsModule {}
