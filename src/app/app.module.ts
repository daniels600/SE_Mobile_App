import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';


import { AccessProvider } from './providers/access-provider';
import { IonicStorageModule } from '@ionic/storage-angular';

import { HTTP } from '@ionic-native/http/ngx';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { EmailComposer } from '@ionic-native/email-composer/ngx';

import { Geolocation } from '@ionic-native/geolocation/ngx';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,
    IonicStorageModule.forRoot()],
  providers: [AccessProvider, HTTP, CallNumber, EmailComposer, Geolocation, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
