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
  protected linkednUrl?: string;
  protected description = '';

  constructor(private clipboard: Clipboard) {
    this.certificateUrl = environment.certificateUrl;
    this.currentUrl = window.location.href;
  }

  ngOnInit(): void {
    this.certificate = CERTIFICATE;
    const organizationId = '10407596';
    const dateParts = this.certificate.issueDate.split('/');
    const year = dateParts[2];
    const month = dateParts[1];

    this.linkednUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${
      this.certificate.eventName}&organizationId=${ organizationId }&issueYear=${ year }&issueMonth=${
      month }&certUrl=${this.currentUrl}&certId=${ this.certificate.id }&credentialDoesNotExpire=1`;

    this.description = `Feliz de haber participado en ${ this.certificate.eventName } @DevsInfo`;
  }

  copyText() {
    this.clipboard.copy(this.currentUrl);
  }

}
