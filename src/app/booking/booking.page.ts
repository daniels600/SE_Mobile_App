/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable eqeqeq */
/* eslint-disable space-before-function-paren */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable no-var */
/* eslint-disable prefer-const */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController, LoadingController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';



@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {
  start_time: any;
  end_time: any;
  Capacity: any;
  id: any;
  user_id: any;

  server: string  = 'https://eately-gh.herokuapp.com/booking.php';
  
  constructor
  (
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    private http: HTTP,
    private route: ActivatedRoute,
    private storage: Storage
  ) 
  { }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');

   });

   console.log(this.id);
  }

  async Book(){
    console.log(this.start_time);

    //this.tm = "2020-09-02T21:12:45.833+01:00"; // Value from ion-datetime
    let d = this.start_time.split('T')[1];

      let m = d.split(':')[0];

      let n = d.split(':')[1];

      // var AmOrPm = m >= 12 ? 'pm' : 'am';

      m = (m % 12) || 12;

      this.start_time = m + ":" + n;

      console.log(this.start_time);

      let e = this.end_time.split('T')[1];

      let f = e.split(':')[0];

      let g = e.split(':')[1];

      f = (f % 12) || 12;

      this.end_time = f + ":" + g;

      console.log(this.end_time);

      this.storage.get('user_id').then((res) =>
      {
        this.user_id = res;
      });

      let data = {
        start_time: this.start_time,
        end_time: this.end_time,
        capacity: this.Capacity,
        restaurant_id: this.id,
        user_id: this.user_id 
      };


      if (this.start_time == "") {
        this.presentToast('Your start time is empty');
      }else if (this.end_time == "") {
        this.presentToast('Your end time field is empty');
      }else if(this.Capacity == ""){
        this.presentToast('Your Capacity field is empty');
      }else{

        const loader = await this.loadingCtrl.create({
          message: "Please wait ......",
        });
        loader.present();


        let headers = { };

        return this.http.post(this.server, data, headers)
        .then((response: HTTPResponse) => {
          console.log(`POST ${this.server} ${JSON.stringify(response.data)}`);

          let m = response.data;
          console.log(m);

          if (m == 'success') {
            loader.dismiss();
            
            //this.disabledbtn = false;
            this.presentToast("Booking successful. You will receive a call from the restaurant soon. Thank you");

            //save the signed in user details for later login
            //this.storage.set('user_details', this.email);  //storage session

            //redirect to the home page
            this.navCtrl.navigateRoot('');

          } else if(m == 'failed') {
            loader.dismiss();
            //this.disabledbtn = false;
            this.presentToast("Booking failed. Please try again later");
          }else {
            loader.dismiss();
            //this.disabledbtn = false;
            this.presentToast("Booking failed. Try again");
          }
        })
        .catch((error: any) => {
          console.error(`POST ${this.server} ${error.error}`);
          loader.dismiss();
          //this.disabledbtn = false;
        });


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
