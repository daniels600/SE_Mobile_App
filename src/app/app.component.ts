/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-trailing-spaces */
/* eslint-disable space-before-function-paren */
import { Component } from '@angular/core';

import {ToastController, NavController} from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  user_email: any;
  constructor
  (
    private platform: Platform,
    public navCtrl: NavController,
    private storage: Storage,
    private router: Router,
    private toastCtrl: ToastController,
    // private statusbar: StatusBar,
    // private splashScreen: SplashScreen
  ) 
  {
    this.initializeApp();
  }

  async initializeApp(){

    // this.platform.ready().then(() => {
    //   this.splashScreen.hide();
    // });

    
    this.storage.create();

    //this.storage.set('user_details', {username: 'username'} );

    this.storage.get('user_details').then((res) =>
    {
      if(res == null){
          this.navCtrl.navigateRoot('/login');
      }else{
          this.navCtrl.navigateRoot('');
      }
    });

    this.user_email = await this.storage.get('user_details');
    console.log('This is the user here',this.user_email);

    
  }

  ionViewDidEnter(){
  
    this.user_email = this.storage.get('user_details');
    console.log('This is the user ',this.user_email);
  }

  async logout(){
    this.storage.clear();
    await this.router.navigate(['/login']);

    const toast = await this.toastCtrl.create({
      message: "Logged Out Successfully",
      duration: 2000,
      position: "top"
    });
    await toast.present();
  }


}
