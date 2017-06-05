import { Component, OnInit,ViewChild } from '@angular/core';
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
    transition('inactive <=> active', animate('450ms ease-in-out'))
  ])
  ]
})
export class FirstTimeComponent {

  @ViewChild("searchInput") searchInput;

  stateCtrl: FormControl; // autocomplete için
  filteredStates: any;
  b1 = "accent"; b2="warn"; b3="warn"; b4="warn";
  animState1 = "active";
  animState2 = "inactive";
  animState3 = "inactive";
  animState4 = "inactive";
  songs =  null;
  translate = null;

  selectedPart = "genres" // Bu değişken firsttimeda yukarıdan değişiklik yapılırsa, bu değişikliği kaydetmeye yarayacak.

  
  constructor(private service : AppService) {
    this.translate = service.getTranslate();
    
    if(service.isFirstTime)
    {
    service.getPopularSongs().subscribe(res=>{
      this.songs = res;
    });
    }


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
    return this.service.favGenres.indexOf(check) == -1 ? false : true;
  }

  isSongChecked(sarkiId)
  {
    return this.service.favSongs.indexOf(sarkiId) == -1  ? false : true; 
  }

  addFavSong(sarkiId)
  {
    var index = this.service.favSongs.indexOf(sarkiId);
    console.log("sarki id = " + sarkiId);
    
    if(index == -1)
    {
      this.service.favSongs.push(sarkiId);
    }else
    {
      this.service.favSongs.splice(index,1);
    }
  }

  addFavGenres(nodes)
  {
    this.service.favGenres =[];
    for(var i = 0; i < nodes.length ; i++ )
    {
      var obj = this.service.genres.filter((obj)=>{
        return obj.name == nodes[i].innerText;
      });
      this.service.favGenres.push(obj[0].id); // türlerden 2 tane olmayacağı için 0 diyebilirm
    }
  }

  changePartFromButtons(target)
  {
    if(target == this.selectedPart)
      return;
      console.log("Click çalıştı ?" + target);
      
    switch(target)
    {
      case "genres":
        this.animState1 = "active";
        this.b1 = "accent";
        this.disableCurrentPart(this.selectedPart);
      break;

      case "country":
        this.animState2 = "active";
        this.b2 = "accent";
        this.disableCurrentPart(this.selectedPart);
      break;
        
      case "age":
        this.animState3 = "active";
        this.b3 = "accent";
        this.disableCurrentPart(this.selectedPart);
      break;

      case "songs":
        this.animState4 = "active";
        this.b4 = "accent";
        this.disableCurrentPart(this.selectedPart);
      break;
    }

    this.selectedPart = target;
  }

  disableCurrentPart(current)
  {
    switch(current)
    {
      case "genres":
        this.animState1 = "inactive";
        this.b1 = "warn";
        this.addFavGenres(document.querySelectorAll(".genreCheckbox.mat-checkbox-checked"))
        console.log("Fav genres = " + this.service.favGenres);
      break;

      case "country":
        this.animState2 = "inactive";
        this.b2 = "warn";
        var obj = this.service.countries.filter(val =>{
          return val.country == (<HTMLInputElement>document.querySelector("#countryInput")).value
        })
        this.service.selectedCountry = obj[0].cid;
    
        console.log("selected CountryID = " + this.service.selectedCountry);
      break;

      case "age":
        this.animState3 = "inactive";
        this.b3 = "warn";
        this.service.age  = parseInt( (<HTMLInputElement> (document.querySelector("#ageInput"))).value);
    
        console.log("wtf age = " + this.service.age);
      break;

      case "songs":
        this.animState4 = "inactive";
        this.b4 = "warn";
      break;  
    }
  }

  closeFirstTime()
  {
    this.service.isFirstTime=false;
    this.selectedPart = "genres";
    this.animState1 = "active";
    this.animState2 = "inactive";
    this.animState3 = "inactive";
    this.animState4 = "inactive";
    this.b1 = "accent"; 
    this.b2="warn"; 
    this.b3="warn"; 
    this.b4="warn";
  }

  // TODO : tüm geçişlerde kontrol yapılacak
  click1next()
  {
    this.animState2 = 'active';
    this.animState1 = 'inactive';
    this.b1= "warn";
    this.b2 = "accent";
    this.selectedPart = "country";

    this.addFavGenres(document.querySelectorAll(".genreCheckbox.mat-checkbox-checked"))
    console.log("Fav genres = " + this.service.favGenres);
  }

  click2before()
  {
    this.animState2 = 'inactive'; 
    this.animState1 = 'active';
    this.b1= "accent";
    this.b2 = "warn";
    this.selectedPart = "genres";
    
  } 

  click2next()
  {
    this.animState2 = 'inactive';
    this.animState3 = 'active'; 
    this.b2= "warn";
    this.b3 = "accent";
    this.selectedPart = "age";

    var obj = this.service.countries.filter(val =>{
      return val.country == (<HTMLInputElement>document.querySelector("#countryInput")).value
    })
    this.service.selectedCountry = obj[0].cid;
    
    console.log("selected CountryID = " + this.service.selectedCountry);
  }


  click3before()
  {
    this.animState3 = 'inactive';
    this.animState2 = 'active'; 
    this.b3= "warn";
    this.b2 = "accent";
    this.selectedPart = "country";
  }

  click3next()
  {
    this.animState3 = 'inactive';
    this.animState4 = "active";
    this.b3= "warn";
    this.b4 = "accent";
    this.selectedPart = "songs";

    this.service.age  = parseInt( (<HTMLInputElement> (document.querySelector("#ageInput"))).value);
    console.log("age = " + this.service.age);
  }

  click4before()
  {
    this.animState4 = 'inactive';
    this.animState3 = "active";
    this.b3= "accent";
    this.b4 = "warn";
    this.selectedPart = "age";

  }


  alldone()
  {
    var local = JSON.parse(localStorage.getItem("currentUser"));
    console.log("fav songs = " + this.service.favSongs);

    local.favSongId = this.service.favSongs;
    local.favGenreId = this.service.favGenres;
    local.country = this.service.selectedCountry;
    local.age = this.service.age;

    localStorage.setItem("currentUser",JSON.stringify(local));


    this.service.setFirstTimeInfo(local).subscribe(res =>{
      this.closeFirstTime();

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