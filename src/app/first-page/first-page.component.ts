import { Component, OnInit } from '@angular/core';
import { AppService} from '../app.service';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.css']
})
export class FirstPageComponent implements OnInit {
  
  translate:any;


  constructor(private service: AppService) {
            this.translate = service.getTranslate();
    }

  ngOnInit() {


  }

}
