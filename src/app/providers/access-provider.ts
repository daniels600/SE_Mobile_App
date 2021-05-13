/* eslint-disable object-shorthand */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prefer-const */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/timeout';
import {Router} from "@angular/router";

import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';


@Injectable()
export class AccessProvider {
  //url backend api json
  server: string  = 'https://eately-gh.herokuapp.com/login_user.php';

  server2: string  = 'https://eately-gh.herokuapp.com/signup_user.php';

  apiUrl = 'https://eately-gh.herokuapp.com/restaurants.php';

  resnameurl = 'https://eately-gh.herokuapp.com/getResName.php';

  getMenuURL = 'https://eately-gh.herokuapp.com/getResMenu.php?id=';

  singleResURL = 'https://eately-gh.herokuapp.com/getSingleRes.php?id=';

 
  constructor(
    public http: HttpClient,
  ) { }

  // postData(body){

  //     let headers = { };
  //     this.http.setDataSerializer("json");
  //     this.http.setHeader("*","Accept", "application/json");
  //     this.http.setHeader("*","Content-Type", "application/json");
  //     return this.http.post(this.server2, JSON.stringify(body), headers)
  //       .then((response: HTTPResponse) => {
  //         console.log(`POST ${this.server} ${JSON.stringify(response.data)}`);
  //         var response = response;
  //       })
  //       .catch((error:any) => {
  //         console.error(`POST ${this.server} ${error.error}`);
  //       });
    
  // }


  // checkLogin(body){
  //   let headers  = new HttpHeaders({
  //     'Content_Type' : 'application/json; charset=UTF-8'
  //   });

  //   let options = {
  //     headers : headers
  //   }

  //   return this.http.post(this.server, JSON.stringify(body), options)
  //     .timeout(59000)  // 59 secs timeout
  //     .map(res => res);
  // }


  getRestaurants() {
    let headers  = new HttpHeaders({
      'Content_Type' : 'application/json; charset=UTF-8',
      "Access-Control-Allow-Origin": "*",
      "Accept" : 'application/json'
    });

    let options = {
      headers : headers
    };

    return new Promise(resolve => {
      this.http.get(this.apiUrl, options).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }


  getRestNames(){
    let headers  = new HttpHeaders({
      'Content_Type' : 'application/json; charset=UTF-8',
      "Access-Control-Allow-Origin": "*",
      "Accept" : 'application/json'
    });

    let options = {
      headers : headers
    };

    return new Promise(resolve => {
      this.http.get(this.resnameurl,options).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }


  getSingleRes(id: any){
    let headers  = new HttpHeaders({
      'Content_Type' : 'application/json; charset=UTF-8',
      "Access-Control-Allow-Origin": "*",
      "Accept" : 'application/json'
    });

    let options = {
      headers : headers
    };

    return new Promise(resolve => {
      this.http.get(`https://eately-gh.herokuapp.com/getSingleRes.php?id=${id}`,options).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }


  getResMenu(id: any){
    let headers  = new HttpHeaders({
      'Content_Type' : 'application/json; charset=UTF-8',
      "Access-Control-Allow-Origin": "*",
      "Accept" : 'application/json'
    });

    let options = {
      headers : headers
    };

    return new Promise(resolve => {
      this.http.get('https://eately-gh.herokuapp.com/getResMenu.php?id='+id ,options).subscribe(data => {
        resolve(data);
        console.log('https://eately-gh.herokuapp.com/getResMenu.php?id='+id);
      }, err => {
        console.log(err);
      });
    });
  }

}
