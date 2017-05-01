import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AppService } from '../app.service';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
var $:any; // jquery için

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
export class FirstTimeComponent implements OnInit {
  stateCtrl: FormControl;
  filteredStates: any;

  selectedCountry = "";
  animState1 = "active";
  animState2 = "inactive";
  animState3 = "inactive";
  animState4 = "inactive";
  localUser = JSON.parse(localStorage.getItem('currentUser'));
  isFirstTime =  this.localUser.isFirstTime;
  genres = null;
  countries = null;
  translate = null;
  
  constructor(private service : AppService) {
    this.genres = service.getGenres();
    this.translate = service.getTranslate();
    this.countries = service.getCountries(); 

    this.stateCtrl = new FormControl();
    this.filteredStates = this.stateCtrl.valueChanges
        .startWith(null)
        .map(name => this.filterStates(name));
   }

  filterStates(val: string) {

    var vals = this.countries.map(val => val.country);

    return val ? vals.filter(s => new RegExp(`^${val}`, 'gi').test(s))
               : vals;
  }

  ngOnInit() {
  }

  changeCountry(e)
  {

  }

  click1next()
  {
    this.animState2 = 'active';
    this.animState1 = 'inactive';

    

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
  }

  click4before()
  {
    this.animState4 = 'inactive';
    this.animState3 = "active";
  }


  alldone()
  {
    
  }

}
