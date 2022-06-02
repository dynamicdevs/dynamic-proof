import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { environment } from '../../environments/environment';
import { Certificate } from '../models/certificate';

import { CERTIFICATE } from './certificate-mock';

@Component({
  selector: 'proof-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss'],
})
export class CertificateComponent implements OnInit {

  public certificate?: Certificate;
  public certificateUrl: string;
  public currentUrl: string;

  constructor(private clipboard: Clipboard) {
    this.certificateUrl = environment.certificateUrl;
    this.currentUrl = window.location.href;
  }

  ngOnInit(): void {
    this.certificate = CERTIFICATE;
  }

  copyText() {
    this.clipboard.copy(this.currentUrl);
  }

}
