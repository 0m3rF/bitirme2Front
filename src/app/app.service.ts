import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CookieService} from 'angular2-cookie/core';
import { TranslateService }  from 'ng2-translate';
import { MdSnackBar } from '@angular/material';
import { Genres } from './models/genres';
import { Countries } from './models/countries';
import { FirstTimeComponent } from './first-time/first-time.component';
@Injectable()
export class AppService {

  private apiUrl = 'http://localhost:3000/api/db';
  public isLoggedin = false;
  public isFirstTime = true;
  public firstTimeComponent : FirstTimeComponent= null;
  public countries = null;
  public genres = null;
  public favGenres = [];
  public favSongs = [];
  public selectedCountry = 1;
  public age  = 0;


  constructor(private _cookieService:CookieService,private _http:Http
  ,private _translate: TranslateService,public snackBar: MdSnackBar,
    private _router: Router) {

      this.countries = this.getCountries();
      this.genres = this.getGenres();
      
      console.log("Service çalıştı!");
      

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
  getCountryId() // First time infoları değişirken tekrardan geldiğinde ülkenin seçili gelmesi için
  {    
    return this.countries[(this.selectedCountry-1)].country;
  }

  setLocalInfos()
  {
    var local = JSON.parse(localStorage.getItem("currentUser"));
      console.log("local = " + JSON.stringify(local));
    
    if(!this.isFirstTime)
    {
      
      this.favGenres = local.favGenreId;
      this.favSongs = local.favSongId;
      this.age = local.age;
      this.selectedCountry = local.country;
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

  setFirstTimeSearch()
  {
    setTimeout( ()=>{this.firstTimeComponent.setFirstTimeSearch()},500)
  }

  public openSnackBar(message: string, action: string) {

    this._translate.get([message,action]).subscribe( (vals) =>{
        this.snackBar.open(vals[Object.keys(vals)[0]], vals[Object.keys(vals)[1]] , {duration: 2000,} ); 
    })
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

  setFirstTimeInfo(info)
  {
    return this._http.post(this.apiUrl + '/saveUserInfo',info);
  }

  searchSong(val)
  {
   var token = JSON.parse(localStorage.getItem("currentUser")).token;
   console.log("aranacak input =  " + val);
    return this._http.post(this.apiUrl + '/search?q='+val,{token:token,search:val})
                     .map(res=>res.json());
  }

  getGenres()
  {
    return Genres.genres;
  }

  getCountries ()
  {
    return Countries.countries;
  }

  getPopularSongs()
  {
    var local = JSON.parse(localStorage.getItem("currentUser"));

    return this._http.post(this.apiUrl + "/search",{token: local.token})
                     .map(res => res.json());
  }






}
