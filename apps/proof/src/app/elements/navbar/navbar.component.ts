import { Component } from '@angular/core';
import { environment } from 'apps/proof/src/environments/environment';

@Component({
  selector: 'proof-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {

  public baseAssetsUrl: string;

  constructor() {
    this.baseAssetsUrl = environment.assetsUrl;
  }
}
