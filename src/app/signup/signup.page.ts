/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-trailing-spaces */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/quotes */
import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { AccessProvider } from '../providers/access-provider';
import { Router } from  '@angular/router';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  name: string = "";
  email: string = "";
  telephone: string = "";
  password: string = "";
  confirm_password: string = "";
  product: any;
  disabledbtn;

  server: string  = 'https://eately-gh.herokuapp.com/signup_user.php';

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accessProvider: AccessProvider,
    private router: Router,
    private http: HTTP
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.disabledbtn = false;
  }

  async signup() {
    let url = "https://eately-gh.herokuapp.com/signup_user.php";

    let data = {
      action: 'user_registration',
      name: this.name,
      password: this.password,
      telephone: this.telephone,
      email: this.email
    };

    if (this.name === "") {
      this.presentToast('Your name field is empty');
    } else if (this.email === "") {
      this.presentToast('Your email field is empty');
    } else if (this.telephone == "") {
      this.presentToast('Your phone field is empty');
    } else if (this.password == "") {
      this.presentToast('Your password field is empty');
    } else if (this.confirm_password == '') {
      this.presentToast('Your confirm password field is empty');
    } else if (this.password != this.confirm_password) {
      this.presentToast('Your password do not match');
    } else {
      this.disabledbtn = true;
      // this.presentLoading();
      const loader = await this.loadingCtrl.create({
        message: "Please wait ......",
      });
      loader.present();

  

      let headers = { };
      this.http.setDataSerializer("json");
      this.http.setHeader("*","Accept", "application/json");
      this.http.setHeader("*","Content-Type", "application/json");
      return this.http.post(url, data, headers)
        .then((res: HTTPResponse) => {
          console.log(`POST ${url} ${JSON.stringify(res.data)}`);
          let m = JSON.parse(res.data);
          if (m['status'] == 'success') {
            loader.dismiss();
            this.disabledbtn = false;
            this.presentToast(m['msg']);
            this.router.navigate(['/login']);
          } else {
            loader.dismiss();
            this.disabledbtn = false;
            this.presentToast(m['msg']);
          }
        })
        .catch((error: any) => {
          console.error(`POST ${url} ${error.error}`);
          loader.dismiss();
          this.disabledbtn = false;
          this.presentAlert(error);
        });

      }

  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1500,
      position: "top"
    });
    await toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      // cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
  }

  async presentAlert(a) {
    const alert = await this.alertCtrl.create({
      header: a,
      backdropDismiss: false,
      message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Close',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            //Action
          }
        }, {
          text: 'Try Again',
          handler: () => {
            this.signup();
          }
        }
      ]
    });

    await alert.present();
  }

}
