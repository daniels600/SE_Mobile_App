/* eslint-disable eqeqeq */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/semi */
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { IonContent, IonList, IonSlides, isPlatform } from '@ionic/angular';
import { AccessProvider } from '../providers/access-provider';
import { ActivatedRoute } from '@angular/router';
// import {LoadingController, NavController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
// import { AlertController } from '@ionic/angular';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { ToastController, AlertController, LoadingController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss'],
})
export class RestaurantPage implements OnInit, AfterViewInit  {
  data = null;

  id: any;
  resName: any;
  resLoc: any;
  phone: any;
  resEmail: any;
  //resImage: any;
  image_id:  any;
  image:  any;

  MenuList: any;
  singleRes: any;

  listRestaurants: any;
  public listResNames: any;

  orderURL: string  = 'https://eately-gh.herokuapp.com/order.php';
  
  opts = {
    freeMode: true,
    slidesPerView: 2.6,
    slidesOffsetBefore: 30,
    slidesOffsetAfter: 100
  }
 
  activeCategory = 0;
  @ViewChildren(IonList, { read: ElementRef }) lists: QueryList<ElementRef>;
  listElements = [];
  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild(IonContent) content: IonContent;
  categorySlidesVisible = false;
  loading: HTMLIonLoadingElement;
  error: string;
  user_id: any;
 
  constructor(private httpClient: HttpClient, @Inject(DOCUMENT) private document: Document, private accessProvider: AccessProvider,  private route: ActivatedRoute,  public loadingController: LoadingController, private callNumber: CallNumber, private emailComposer: EmailComposer, public alertController: AlertController, private http: HTTP,public navCtrl: NavController, private toastCtrl: ToastController, private storage: Storage) 
  {
    this.getRest();
  }


  ngOnInit() {
    this.httpClient.get('https://devdactic.fra1.digitaloceanspaces.com/foodui/1.json').subscribe((res: any) => {
      this.data = res;
    });

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.resName = params.get('resname');
      this.resLoc = params.get('resloc');
      this.phone= params.get('phone');
      this.resEmail= params.get('email');
      //this.resImage = params.get('resImage');
      this.image_id = params.get('image_id');

      this.image = `https://eately-gh.herokuapp.com/get_image.php?image_id=${this.image_id}`

   });

   // Set the header position for sticky slides 
   const headerHeight = isPlatform('ios') ? 44 : 56;    
   this.document.documentElement.style.setProperty('--header-position', `calc(env(safe-area-inset-top) + ${headerHeight}px)`);

   this.getSingleRes();

  }
 
  // Get all list viewchildren when ready
  ngAfterViewInit() {    
    this.lists.changes.subscribe(_ => { 
      this.listElements = this.lists.toArray();
    });
  }
 
  // Handle click on a button within slides
  // Automatically scroll to viewchild
  selectCategory(index) {
    const child = this.listElements[index].nativeElement;    
    this.content.scrollToPoint(0, child.offsetTop - 120, 1000);
  }
 
  // Listen to ion-content scroll output
  // Set currently visible active section
  onScroll(ev) {    
    const offset = ev.detail.scrollTop;
    this.categorySlidesVisible = offset > 500;
    
    for (let i = 0; i < this.listElements.length; i++) {
      const item = this.listElements[i].nativeElement;
      if (this.isElementInViewport(item)) {
        this.activeCategory = i;
        this.slides.slideTo(i);
        break;
      }
    }
  }
 
  isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    
    return (
      rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  
  async presentLoading() {
    // Prepare a loading controller
    this.loading = await this.loadingController.create({
        message: 'Loading...'
    });
    // Present the loading controller
    await this.loading.present();
  }


  getRest() {
    this.accessProvider.getRestaurants()
    .then(data => {
      this.listRestaurants = JSON.parse(JSON.stringify(data));
      console.log(this.listRestaurants);
    });
  }


  getResNames() {
    this.accessProvider.getRestNames()
    .then(data => {
      this.listResNames = JSON.parse(JSON.stringify(data));
      console.log(this.listResNames);
    });
  }

  getSingleRes(){
    this.accessProvider.getSingleRes(this.id)
    .then(data => {
      this.singleRes = JSON.parse(JSON.stringify(data));
      console.log(this.singleRes);
    });

    console.log('This is the id ',this.id)


  }

  getRestMenu() {
    // this.accessProvider.getResMenu(this.id)
    // .then(data => {
    //   this.MenuList = JSON.parse(JSON.stringify(data));
    //   console.log(this.MenuList);
    //   console.log('Id is ', this.id);
    // });

    const dataUrl = `https://eately-gh.herokuapp.com/getResMenu.php?id=${this.id}`;
    // Prepare the request
    return this.httpClient.get(dataUrl);
  }

  async ionViewWillEnter() {
    // Present a loading controller until the data is loaded
    await this.presentLoading();

    this.getRestMenu()
      .pipe(
        finalize(async () => {
          // Hide the loading spinner on success or error
          await this.loading.dismiss();
        })
    )
    .subscribe(
        data => {
          // Set the data to display in the template
          this.MenuList  = data;
          console.log(this.MenuList);
        },
        err => {
          // Set the error information to display in the template
          this.error = `An error occurred, the data could not be retrieved: Status: ${err.status}, Message: ${err.statusText}`;
        }
    );
  }

  launchDialer(n: string){
    this.callNumber.callNumber(n, true)
    .then(() => console.log('Launched dialer!'))
    .catch(() => console.log('Error launching dialer'));
  }

  openEmailComposer(n: string){
    this.emailComposer.open({
      to : n
    })
  }

  showConfirm(m_id: any, r_id: any) {
    console.log(m_id);

    this.alertController.create({
      header: 'Meal Order',
      message: 'Would you like to order this meal?',
      buttons: [
        {
          text: 'Yes order',
          handler: () => {
            console.log('I care about humanity', m_id, r_id);
            this.order(m_id, r_id);
          }
        },
        {
          text: 'No cancel, order',
          handler: () => {
            console.log('Let me think');
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  async order(meal_id: any, res_id: any){

    this.storage.get('user_id').then((res) =>
    {
      this.user_id = res;
    });

    let data = {
      meal_id: meal_id,
      restaurant_id: res_id,
      user_id:  this.user_id
    };
    

    const loader = await this.loadingController.create({
      message: "Please wait ......",
    });
    loader.present();


    let headers = { };

    return this.http.post(this.orderURL, data, headers)
    .then((response: HTTPResponse) => {
      console.log(`POST ${this.orderURL} ${JSON.stringify(response.data)}`);

      let m = response.data;
      console.log(m);

      if (m == 'success') {
        loader.dismiss();
        
        //this.disabledbtn = false;
        this.presentToast("Meal order successful. You will receive a call from the restaurant soon...");

        //save the signed in user details for later login
        //this.storage.set('user_details', this.email);  //storage session

        //redirect to the home page
        this.navCtrl.navigateRoot('');

      } else if(m == 'failed') {
        loader.dismiss();
        //this.disabledbtn = false;
        this.presentToast("Order did not go through. Try again!");
      }else {
        loader.dismiss();
        //this.disabledbtn = false;
        this.presentToast("Order did not go through. Try again!");
      }
    })
    .catch((error: any) => {
      console.error(`POST ${this.orderURL} ${error.error}`);
      loader.dismiss();
      //this.disabledbtn = false;
    });

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
