import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridWrapperComponent } from './grid-wrapper/grid-wrapper.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ButtonComponent } from './button/button.component';

const ELEMENTS = [ButtonComponent, GridWrapperComponent, NavbarComponent];

@NgModule({
  declarations: [...ELEMENTS],
  exports: [...ELEMENTS],
  imports: [CommonModule],
})
export class ElementsModule {}
