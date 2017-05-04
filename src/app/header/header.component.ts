import { Component} from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { FirstTimeComponent } from '../first-time/first-time.component'; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  selectedLang = "";
  translate:any;
  langs = [
    {value: 'tr', viewValue: 'TURKISH', class: 'flag-icon-tr' },
    {value: 'en', viewValue: 'ENGLISH', class: 'flag-icon-gb'},
    {value: 'jp', viewValue: 'JAPON', class: 'flag-icon-jp'}
  ];
  constructor(private service: AppService, private _router: Router) {
     
    this.translate = service.getTranslate();
    this.selectedLang = service.getCookie("lang");
    }

    logout()
    {
      this.service.logout();
    }

    gotoHome()
    {
      this._router.navigate(['home']);
    }

    gotoDashboard()
    {
      this._router.navigate(['dashboard']);
    }

    gotoProfile()
    {
      this._router.navigate(['profile']);
    }

    gotoSettings()
    {
      this._router.navigate(['settings']);
    }
    gotoFirstTime()
    {
      this._router.navigate(['dashboard']);
      setTimeout(()=>{this.service.isFirstTime = true;
      this.service.setFirstTimeSearch();},250);
      

    }

    changeLang(lang)
    {
      this.translate.use(lang.value);
      this.selectedLang = lang.value;
      this.service.setCookie("lang",lang.value);
    }

}
