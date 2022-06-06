import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'proof-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {

  @Input() className?: string;
  @Input() url?: string;
  @Input() download?: string;
  @Input() target?: '_blank' | '_self' = '_self';
  @Output() clickEvent = new EventEmitter<Event>();

  onClick(event: Event) {
    this.clickEvent.emit(event);
  }
}
