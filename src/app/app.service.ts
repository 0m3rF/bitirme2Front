import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CookieService} from 'angular2-cookie/core';
import { TranslateService }  from 'ng2-translate';
import { MdSnackBar } from '@angular/material';
import { Genres } from './models/genres';
import { Countries } from './models/countries';

@Injectable()
export class AppService {
 
  private apiUrl = 'http://localhost:3000/api/db';
  public isLoggedin = false;

  constructor(private _cookieService:CookieService,private _http:Http
  ,private _translate: TranslateService,public snackBar: MdSnackBar,
    private _router: Router) {

      _translate.setDefaultLang("en");
      this.logout();
      
     if(this.getCookie("lang") == undefined){
        _translate.use('en');
        this.setCookie("lang","en");
        
        
      }
      else{
        _translate.use(this.getCookie("lang"))
      }
     
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

  create(username,password,email)
  {
      var body = {"username": username, "password": password,"email":email};
      return this._http.post(this.apiUrl + "/registerUser", body).map((response: Response) => response.json());
  }

  login(username,password)
  {
      return this._http.post(this.apiUrl + '/loginUser',{"username": username, "password": password})
      .map(res => res.json());    
  }

  logout()
  {
      this.isLoggedin = false;
      localStorage.removeItem("currentUser");
      this._router.navigate(['/']);
  }

  getGenres()
  {
    return Genres.genres;
  }

  getCountries ()
  {
    return Countries.countries;
  }


  public openSnackBar(message: string, action: string) {

    this._translate.get([message,action]).subscribe( (vals) =>{
        this.snackBar.open(vals[Object.keys(vals)[0]], vals[Object.keys(vals)[1]] , {duration: 2000,} ); 
    })
  }





}
