import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CookieService} from 'angular2-cookie/core';
import { TranslateService }  from 'ng2-translate';
import { MdSnackBar } from '@angular/material';

@Injectable()
export class AppService {
 
  private apiUrl = 'http://localhost:3000/api/db';

  constructor(private _cookieService:CookieService,private _http:Http
  ,private _translate: TranslateService,public snackBar: MdSnackBar) {

      _translate.setDefaultLang("en");
      console.log(localStorage.getItem("currentUser"));
      
     if(this.getCookie("lang") == undefined){
        _translate.use('en');
        this.setCookie("lang","en");
        console.log("Tanimsiz dil en tanimlandi !");
        
      }
      else{
        _translate.use(this.getCookie("lang"))
      }
     
      console.log("seçili dil = " + this.getCookie("lang"));
  }

  getCookie(key: string){
    return this._cookieService.get(key);
  }

  setCookie(key:string,value:any)
  {
    this._cookieService.put(key,value);
  }

  getTranslate()
  {
    return this._translate;
  }




/**
 * API işlemleri
 */
  getById(id: number) {
      return this._http.get(this.apiUrl +"/getUser:" + id, this.jwt()).map((response: Response) => response.json());
  }

  create(username,password,email) {
      var body = {"username": username, "password": password,"email":email};
      return this._http.post(this.apiUrl + "/registerUser", body).map((response: Response) => response.json());
  }

  update() {
      return this._http.put('/api/users/' + JSON.parse(localStorage.getItem('currentUser')), JSON.parse(localStorage.getItem('currentUser')), this.jwt()).map((response: Response) => response.json());
  }

  delete(id: number) {
      return this._http.delete('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
  }

  // private helper methods

  private jwt() {
      // create authorization header with jwt token
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser && currentUser.token) {
          let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
          return new RequestOptions({ headers: headers });
      }
  }


  public openSnackBar(message: string, action: string) {

    this._translate.get([message,action]).subscribe( (vals) =>{
        console.log(JSON.stringify(vals));
        this.snackBar.open(vals.REGISTER_FAIL, vals.OK , {duration: 2000,} ); 
    })

       
  }





}
