import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CookieService} from 'angular2-cookie/core';
import { TranslateService }  from 'ng2-translate';
import { MdSnackBar } from '@angular/material';
import { Genres } from './models/genres';
import { Countries } from './models/countries';
import { FirstTimeComponent } from './first-time/first-time.component';
import { MusicPlayerComponent } from './music-player/music-player.component';

@Injectable()
export class AppService {

  private apiUrl = 'http://localhost:3000/api/db';
  public isLoggedin = false;
  public isFirstTime = true;
  public firstTimeComponent : FirstTimeComponent= null;
  public musicPlayerComponent : MusicPlayerComponent = null;
  public countries = null;
  public genres = null;
  public favGenres = [];
  public favSongs = [];
  public selectedCountry = 1;
  public age  = 0;
  public local = null;

  constructor(private _cookieService:CookieService,private _http:Http
  ,private _translate: TranslateService,public snackBar: MdSnackBar,
    private _router: Router) {
      
      this.logout();
      

      this.countries = this.getCountries();
      this.genres = this.getGenres();

      _translate.setDefaultLang("en");
     
      
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

      this.local = local;
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

  logout()
  {
      this.isLoggedin = false;
      localStorage.removeItem("currentUser");
      this._router.navigate(['/home']);
  }

  getCountryIdFromname(country)
  {
    var obj = this.countries.filter((el)=>{
      return el == country
    })
    return country;
  }


  getGenres()
  {
    return Genres.genres;
  }

  getCountries ()
  {
    return Countries.countries;
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


  setFirstTimeInfo(info)
  {
    return this._http.post(this.apiUrl + '/saveUserInfo',info);
  }

  searchSong(val)
  {
   console.log("aranacak input =  " + val);
    return this._http.post(this.apiUrl + '/search?q='+val,{token:this.local.token,search:val})
                     .map(res=>res.json());
  }

  getPopularSongs()
  {
    return this._http.post(this.apiUrl + "/search",{token: this.local.token})
                     .map(res => res.json());
  }

  saveChanges(body)
  {

    console.log("gidecek body = " + JSON.stringify(body));
    return this._http.post(this.apiUrl + "/saveChanges",body)
                     .map(res=>res.json());
  }

  deleteAccount()
  {
    return this._http.post(this.apiUrl + "/deleteAccount" , {token: this.local.token,id:this.local._id})
                     .map(res => res.json());
  }

  addSongHistory(song)
  {
    var local = JSON.parse(localStorage.getItem("currentUser"));
    local.historySongId.push({songId:song.sarkiId,genreId:song.genreId});
    localStorage.setItem("currentUser",JSON.stringify(local));

    var body = {id: local._id, songId : song.sarkiId , token: local.token, genreId : song.genreId};
    return this._http.post(this.apiUrl + "/addSongHistory",body)
                     .map(res=>res.json());
  }

  addSongTime(song)
  {
    var local = JSON.parse(localStorage.getItem("currentUser"));
    
    var body = {id: local._id, songId : song.sarkiId , token: local.token, genreId : song.genreId};
    return this._http.post(this.apiUrl + "/addTimeToSongHistory",body)
                     .map(res=>res.json());
  }

  minusSongTime(song)
  {
    var local = JSON.parse(localStorage.getItem("currentUser"));
    
    var body = {id: local._id, songId : song.sarkiId , token: local.token, genreId : song.genreId};
    return this._http.post(this.apiUrl + "/minusTimeToSongHistory",body)
                     .map(res=>res.json());
  }


  getPlaylistRecommendation(countryId,age,genreId,type)
  {
    var local = JSON.parse(localStorage.getItem("currentUser"));
    var body = {
      token: local.token,
      type: type,
      genreId : genreId,
      userId: local._id,
      age : age,
      country : countryId
    }

   return this._http.post(this.apiUrl + "/playlistRecommendation",body)
                     .map(res => res.json());
  }
}