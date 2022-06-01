import { Component, Input } from '@angular/core';

@Component({
  selector: 'proof-grid-wrapper',
  templateUrl: './grid-wrapper.component.html',
  styleUrls: ['./grid-wrapper.component.scss'],
})
export class GridWrapperComponent {

  @Input() className?: string;
}
