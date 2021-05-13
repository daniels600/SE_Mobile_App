/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable object-shorthand */
/* eslint-disable no-var */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable space-before-function-paren */
import { Component, OnInit, ViewChild ,ElementRef} from '@angular/core';

import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation/ngx';

import { ToastController, AlertController, LoadingController, NavController } from '@ionic/angular';

import {HttpClient} from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';

declare var google;


@Component({
  selector: 'app-nearby',
  templateUrl: './nearby.page.html',
  styleUrls: ['./nearby.page.scss'],
})



export class NearbyPage implements OnInit {
  latitude: any = 0; //latitude
  longitude: any = 0; //longitude
  address: string;
  latitude2: any =0; //latitude
  longitude2: any=0; //longitude
  public result: any;
  public pictures: any;
  public dadis: any;
  minimumdistance: 50;
  count=0;
  distance=0;
  public restaurantapi: any;

  constructor
  (
    private geolocation: Geolocation,
    public navCtrl: NavController,
    private http: HttpClient,
    private http1: HTTP
  ) 
  { }

  // ngOnInit() {
  // }
  options = {
  timeout: 10000,
  enableHighAccuracy: true,
  maximumAge: 3600
};

// use geolocation to get user's device coordinates
ngOnInit() {
  this.geolocation.getCurrentPosition().then((resp) => {
    this.latitude = resp.coords.latitude;
    this.longitude = resp.coords.longitude;
    this.getlistnearbyres(this.latitude,this.longitude);
  }).catch((error) => {
    console.log('Error getting location', error);
  });
  this.checkrestaurantstatus();
}
// get nearby restaurants per your locations.
getlistnearbyres(lat,long){
  this.http1.get('https://maps.googleapis.co' +
    'm/maps/api/place/nearbysearch/json?location='+lat+','+long+'&radius=5000&ty' +
    'pe=restaurant&keyword=cruise&key=AIzaSyALX08Dj7c9KkiydoaNCNrK95mXE-SCMwg',this.options ,{} ).then(data =>{
      console.log(data);

    //console.log(data['results']['photos']);
    console.log(data['results']);
    this.result=data['results'];
    this.getloop(this.result);
    //this.pictures = data['results']['photos'];
    return this.result, this.pictures;
  });
}
getloop(data){
  let i=0;
  while (i<=data.length ){
    //console.log(data[i]['photos']);
    i=i+1;
  }
}
checkrestaurantstatus(){
  const url='https://eately-gh.herokuapp.com/restaurants.php';
  return this.http.get(url).subscribe(data=>{
    console.log(data);
    this.latitude2=data[0].restaurant_latitude;
    this.longitude2=data[0].restaurant_longitude;
    this.restaurantapi=data;
    console.log(this.latitude2, this.longitude2);
   // console.log(this.restaurantapi);
    this.checkifdistance(data);
    return this.latitude2,this.longitude2;
  });
}

checkdistance(){
  //var lat2= parseInt(this.latitude2,10);
  let minus=(2*0.01745);
  let lat= this.latitude+this.latitude2/2*0.01745;
  let dx= 111.3* Math.cos(5.21478) * (this.longitude-this.longitude2);
  let dy= 111.3* (this.latitude-this.latitude2);
 // console.log(lat,dx,dy,this.latitude,this.latitude2,this.longitude2,minus);
  return this.getDistance(dx,dy);
}
getDistance(dx,dy){
  this.distance= dx*dx + dy*dy;
  console.log(this.distance);
  return this.distance;
}
checkifdistance(data){
  console.log(this.distance,this.minimumdistance);
  if (this.distance<=this.minimumdistance){
      this.dadis=data;
      console.log(this.dadis);
    }
}


// geocoder options
/*nativeGeocoderOptions: NativeGeocoderOptions = {
  useLocale: true,
  maxResults: 5
};

// get address using coordinates
getAddress(lat,long){
  this.nativeGeocoder.reverseGeocode(lat, long, this.nativeGeocoderOptions)
    .then((res: NativeGeocoderResult[]) => {
      this.address = this.pretifyAddress(res[0]);
    })
    .catch((error: any) => {
      alert('Error getting location'+ JSON.stringify(error));
    });
}

// address
pretifyAddress(address){
  let obj = [];
  let data = "";
  for (let key in address) {
    obj.push(address[key]);
  }
  obj.reverse();
  for (let val in obj) {
    if(obj[val].length)
      data += obj[val]+', ';
  }
  return address.slice(0, -2);
}*/


}
