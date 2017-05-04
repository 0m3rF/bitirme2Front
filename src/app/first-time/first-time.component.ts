import { Component, OnInit,ViewChild} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AppService } from '../app.service';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/distinctUntilChanged';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-first-time',
  templateUrl: './first-time.component.html',
  styleUrls: ['./first-time.component.css'],
  animations: [
  trigger('flyInOut', [
    state('inactive', style({

      transform: 'scale(0) translateX(-200%)'
    })),
    state('active',   style({
      transform: 'scale(1) translateX(0%)'
    })),
    transition('inactive <=> active', animate('750ms ease-in-out'))
  ])
  ]
})
export class FirstTimeComponent {

  @ViewChild("searchInput") searchInput;
  stateCtrl: FormControl; // autocomplete için
  filteredStates: any;

  animState1 = "active";
  animState2 = "inactive";
  animState3 = "inactive";
  animState4 = "inactive";
  songs =  null;
  translate = null;
  // TODO : dil çevirileri yapılacak!

  favGenres = [];
  favSongs = [];
  selectedCountry = 0;
  age  = 0;
  
  constructor(private service : AppService) {
    this.translate = service.getTranslate();
    
    
    service.getPopularSongs().subscribe(res=>{
      this.songs = res;
    });

    this.stateCtrl = new FormControl();
    this.filteredStates = this.stateCtrl.valueChanges
        .startWith(null)
        .map(name => this.filterStates(name));
   }

   filterStates(val: string) {

    var vals = this.service.countries.map(val => val.country);

    return val ? vals.filter(s => new RegExp(`^${val}`, 'gi').test(s))
               : vals;
  }

  ngAfterViewInit()
  {
    this.service.firstTimeComponent = this; 
    this.setFirstTimeSearch();
    this.setLocalInfos();
  }

  setLocalInfos()
  {
    var local = JSON.parse(localStorage.getItem("currentUser"));
    if(!this.service.isFirstTime)
    {
      this.favGenres = local.favGenreId;
      this.favSongs = local.favSongId;
      this.age = local.age;
      this.selectedCountry = local.country;
    }
  }

  setFirstTimeSearch()
  {
    if(this.service.isFirstTime)
    {
      var keyups = Observable.fromEvent(<HTMLInputElement>this.searchInput.nativeElement,"keydown")
      .map((e:KeyboardEvent) => (<HTMLInputElement>e.target).value )
      .filter( val => val.length > 2 )
      .debounceTime(500)
      .distinctUntilChanged();
      
      keyups.subscribe(val =>{ 
          console.log("You search that :" + val);
          this.service.searchSong(val).subscribe(res =>{
          this.songs = res;
          });
      })

    }
  }

  isGenreChecked(check)
  {
    return this.favGenres.indexOf(check) == -1 ? false : true;
  }

  isSongChecked(id)
  {
    return this.favSongs.indexOf(id) == -1  ? false : true; 
  }

  addFavSong(id)
  {
    var index = this.favSongs.indexOf(id);
    if(index == -1)
    {
      this.favSongs.push(id);
    }else
    {
      this.favSongs.splice(index,1);
    }
  }

  addFavGenres(nodes)
  {
    for(var i = 0; i < nodes.length ; i++ )
    {
      var obj = this.service.genres.filter((obj)=>{
        return obj.name == nodes[i].innerText;
      });
      this.favGenres.push(obj[0].id); // türlerden 2 tane olmayacağı için 0 diyebilirm
    }
  }

  addFavSongs(nodes)
  {
    for(var i = 0; i < nodes.length ; i++ )
    {
      var obj = this.songs.filter((obj)=>{
        return (obj.sarkiismi + " - " + obj.sanatciIsmi) == nodes[i].innerText;
      });
      
      this.favSongs.push(obj[0].sarkiId); // şarkılardan 2 tane olmayacağı için 0 diyebilirm
    }
  }
  // TODO : tüm geçişlerde kontrol yapılacak
  click1next()
  {
    this.animState2 = 'active';
    this.animState1 = 'inactive';

    this.favGenres = [];
    this.addFavGenres(document.querySelectorAll(".genreCheckbox.mat-checkbox-checked"))
    console.log("Fav genres = " + this.favGenres);
  }

  click2before()
  {
    this.animState2 = 'inactive'; 
    this.animState1 = 'active';
  } 

  click2next()
  {
    this.animState2 = 'inactive';
    this.animState3 = 'active'; 

    var obj = this.service.countries.filter(val =>{
      return val.country == (<HTMLInputElement>document.querySelector("#countryInput")).value
    })
    console.log(obj);
    this.selectedCountry = obj[0].cid;
    
    console.log("selected CountryID = " + this.selectedCountry);
  }
  getCountryId() // First time infoları değişirken tekrardan geldiğinde ülkenin seçili gelmesi için
  {
    return this.service.countries[(this.selectedCountry-1)].country;
  }

  click3before()
  {
    this.animState3 = 'inactive';
    this.animState2 = 'active'; 
  }

  click3next()
  {
    this.animState3 = 'inactive';
    this.animState4 = "active";
    console.log("age = " + this.age);
  }

  click4before()
  {
    this.animState4 = 'inactive';
    this.animState3 = "active";

    this.favSongs = [];
    // TODO : set fav songs here
  }


  alldone()
  {
    //this.addFavSongs(document.querySelectorAll(".songCheckbox.mat-checkbox-checked"))
    var local = JSON.parse(localStorage.getItem("currentUser"));
    console.log("fav songs = " + this.favSongs);
    var info = {
      username: local.username,
      age : this.age,
      favSongs : this.favSongs,
      favGenres : this.favGenres,
      country: this.selectedCountry,
      token : local.token
    }

    local.favSongId = this.favSongs;
    local.favGenreId = this.favGenres;
    local.country = this.selectedCountry;
    local.age = this.age;


    this.service.setFirstTimeInfo(info).subscribe(res =>{
      this.service.isFirstTime = false;
      this.animState1 = "active";
      this.animState2 = "inactive";
      this.animState3 = "inactive";
      this.animState4 = "inactive";
      this.service.openSnackBar("UPDATE_SUCCESS","OK");
    });
  }

}









/*
    var keyups = Observable.fromEvent(document.querySelector("#searchInput"),"keydown")
    .map((e:KeyboardEvent) => (<HTMLInputElement>e.target).value )
    .filter( val => val.length >= 3 || val.length == 0)
    .debounceTime(300)
    .distinctUntilChanged();
    
    keyups.subscribe(val =>{ 
       console.log("Şuna bastınız : " + val);
       //service.searchSong(val);
    })*/