import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { HttpClientModule } from '@angular/common/http';
import { ElementsModule } from './elements/elements.module';
import { AppRoutingModule } from './app.routing';
import { CertificateComponent } from './certificate/certificate.component';
import { SymbolsModule } from '@dynamic-devs/symbol-angular';

import { ShareModule } from 'ngx-sharebuttons';

const LIBRARIES = [SymbolsModule, ShareModule];

@NgModule({
  declarations: [AppComponent, CertificateComponent, NxWelcomeComponent],
  imports: [
    BrowserModule, HttpClientModule, ElementsModule, AppRoutingModule,
    ...LIBRARIES
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
