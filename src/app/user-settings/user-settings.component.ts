import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {
  stateCtrl: FormControl; // autocomplete için
  filteredStates: any;

  constructor(private service: AppService) {
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

  ngOnInit() {
  }

  saveChanges(email,pass,age,country)
  {    
    var body = {password:"",token :"",email:"",id:"",age : "",country : 1};
    
    body.token = this.service.local.token;
    body.email = email.value;
    body.id = this.service.local._id;
    body.age = age.value;
    body.password = pass.value;

    var obj = this.service.countries.filter(val =>{
      return val.country == country.value
    })
    if(obj[0])
      body.country = obj[0].cid;
    else
      body.country = 0;

    if(email.value == "")
      body.email = this.service.local.email;

    if(age == "")
      body.age = this.service.local.age;

    if(country.value == 0)
      body.country = this.service.local.country;
    
    this.service.saveChanges(body).subscribe(res=> {
      console.log(res);
      if(res.SAVE == "SUCCESS")
      {
        this.service.local.email = body.email;
        this.service.local.age = body.age;
        this.service.local.country = body.country;
        localStorage.setItem("currentUser",JSON.stringify(this.service.local));
      }
    });

  }

  deleteAccount()
  {
    this.service.deleteAccount().subscribe(res=>{
      if(res.DELETE == "SUCCESS")
      {
        this.service.openSnackBar("ACCOUNT_DELETED","OK");        
        this.service.logout();
      }
    });
  }

}
