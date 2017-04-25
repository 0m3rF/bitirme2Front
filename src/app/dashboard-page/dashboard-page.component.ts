import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css'],
  animations: [
    trigger('firstAnimation', [
      state('inactive', style({
        backgroundColor: '#eee',
        transform: 'scale(1)'
      })),
      state('active',   style({
        backgroundColor: '#cfd8dc',
        transform: 'scale(1.1)'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ]),
    trigger('flyInOut', [
    state('in', style({transform: 'translateX(0)'})),
    state('out', style({transform: 'translateX(200%)'})),
    state('idle',style({transform : 'translateX(-200%)'})),
    transition('* => in'  , animate(500)),
    transition('in => out',animate(500))
    ])]
})
export class DashboardPageComponent implements OnInit {

  animState1 = "in";
  animState2 = "idle";
  animState3 = "idle";
  localUser = JSON.parse(localStorage.getItem('currentUser'));
  isFirstTime =  this.localUser.isFirstTime;
  genres = ["Pop","Rock","Metal","Rap","Hip-Hop","Dubstep"];


  constructor() { }

  ngOnInit() {
  }

}
