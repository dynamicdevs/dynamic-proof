import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertificateComponent } from './certificate/certificate.component';

const routes: Routes = [
  { path: ':id', component: CertificateComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
