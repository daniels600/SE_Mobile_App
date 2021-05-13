/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable no-var */
/* eslint-disable space-before-function-paren */
/* eslint-disable no-trailing-spaces */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccessProvider } from '../providers/access-provider';
import {LoadingController, NavController, ToastController, AlertController} from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  categories = [];
  highlights = [];
  featured = [];
  loading: any;
 
  listRestaurants: any;
  public listResNames: any;

  catSlideOpts = {
    slidesPerView: 3.5,
    spaceBetween: 10,
    slidesOffsetBefore: 11,
    freeMode: true
  };
 
  highlightSlideOpts =  {
    slidesPerView: 1.05,
    spaceBetween: 10,
    centeredSlides: true,
    loop: true
  };
 
  featuredSlideOpts = {
    slidesPerView: 1.2,
    spaceBetween: 10,
    freeMode: true
  };
 
  showLocationDetail = false;

  ishidden = false;
  error: string;
 
  constructor
  (private http: HttpClient,
    private accessProvider: AccessProvider,
    public loadingController: LoadingController,
    private storage: Storage,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) 
  {
    this.getRest();
    this.getResNames();
  }
 
  ngOnInit() {
    this.http.get('https://devdactic.fra1.digitaloceanspaces.com/foodui/home.json').subscribe((res: any) => {
      this.categories = res.categories;
      this.highlights = res.highlights;
      this.featured = res.featured;
    });
  }
 
  // Dummy refresher function
  doRefresh(event) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
 
  // show or hide a location string later
  onScroll(ev) {
    const offset = ev.detail.scrollTop;
    this.showLocationDetail = offset > 40;
  }

  getRest() {
    // this.accessProvider.getRestaurants()
    // .then(data => {
    //   this.listRestaurants = JSON.parse(JSON.stringify(data));
    //   console.log(this.listRestaurants);
    // });
    const dataUrl = "https://eately-gh.herokuapp.com/restaurants.php";
    // Prepare the request
    return this.http.get(dataUrl);
  }


  getResNames() {
    this.accessProvider.getRestNames()
    .then(data => {
      this.listResNames = JSON.parse(JSON.stringify(data));
      console.log(this.listResNames);
    });

   
  }

  search(e){
    var val  = e.detail.value;
    if(val && val.trim() === ''){
      this.ishidden = false;
    }else if (val === ''){
      this.ishidden = false;      
    }else {
      this.ishidden = true;
      console.log('not',e);
    } 
  }


  async presentLoading() {
    // Prepare a loading controller
    this.loading = await this.loadingController.create({
        message: 'Loading...'
    });
    // Present the loading controller
    await this.loading.present();
  }

  async ionViewWillEnter() {
    // Present a loading controller until the data is loaded
    await this.presentLoading();

    this.getRest()
      .pipe(
        finalize(async () => {
          // Hide the loading spinner on success or error
          await this.loading.dismiss();
        })
    )
    .subscribe(
        data => {
          // Set the data to display in the template
          this.listRestaurants = data;
          console.log(this.listRestaurants);
        },
        err => {
          // Set the error information to display in the template
          this.error = `An error occurred, the data could not be retrieved: Status: ${err.status}, Message: ${err.statusText}`;
        }
    );
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
