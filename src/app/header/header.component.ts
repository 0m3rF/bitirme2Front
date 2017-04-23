import { Component, Renderer2 } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { AppService } from '../app.service';


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
  constructor(private _service: AppService,private _renderer : Renderer2) {
     
    this.translate = _service.getTranslate();
    this.selectedLang = _service.getCookie("lang");
    }

    ngAfterViewInit(){


    
    }

    changeLang(lang)
    {
      this.translate.use(lang.value);
      this.selectedLang = lang.value;
      this._service.setCookie("lang",lang.value);
    }
}
