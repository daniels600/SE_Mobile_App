/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-trailing-spaces */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController, LoadingController, NavController } from '@ionic/angular';
import { AccessProvider } from '../providers/access-provider';
import { Storage } from '@ionic/storage-angular';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  server: string  = 'https://eately-gh.herokuapp.com/login_user.php';

  email: string = "";
  password: string = "";
  disabledbtn;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accessProvider: AccessProvider,
    public navCtrl: NavController,
    private storage: Storage,
    private http: HTTP
  ) { }

  ngOnInit() {
  }
  openRegister() {
    this.router.navigate(['/signup']);
  }

  ionViewDidEnter(){
    this.disabledbtn = false;
  }

  async login_user() {
    let url = "https://eately-gh.herokuapp.com/login_user.php";

    let data = {
      action: 'user_login',
      email: this.email,
      password: this.password,

    };

    if (this.email == "") {
      this.presentToast('Your email field is empty')
    }else if (this.password == "") {
      this.presentToast('Your password field is empty')
    }else {
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
        .then((response: HTTPResponse) => {
          console.log(`POST ${this.server} ${JSON.stringify(response.data)}`);

          let m = JSON.parse(response.data);

          if (m['status'] == 'success') {
            loader.dismiss();
            this.disabledbtn = false;
            this.presentToast(m['msg']);
            this.storage.set('user_details', m['result']);  //storage session

            this.storage.set('user_id', m['user_id']);  //storage session
            
            this.navCtrl.navigateRoot('');
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
        });


      // return new Promise(resolve => {
      //   let body = {
      //     action: 'user_login',
      //     email: this.email,
      //     password: this.password,

      //   }

      //   this.accessProvider.checkLogin(body).subscribe((res: any) => {
      //       if (res.status == 'success') {
      //         loader.dismiss();
      //         this.disabledbtn = false;
      //         this.presentToast(res.msg);
      //         this.storage.set('storage_xxx', res.result);  //storage session
      //         this.navCtrl.navigateRoot(['user-home']);
      //       } else {
      //         loader.dismiss();
      //         this.disabledbtn = false;
      //         this.presentToast(res.msg);
      //       }
      //     }, (err) => {
      //       console.log(err);

      //       loader.dismiss();
      //       this.disabledbtn = false;
      //       //this.presentAlert(err);
      //     }
      //   );
      // })
    }
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: "top"
    });
    await toast.present();
  }
}
