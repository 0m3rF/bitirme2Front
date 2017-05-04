import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {
  
  translate = null;
  
  constructor(private service: AppService) {
    this.translate = service.getTranslate();
   }

  ngOnInit() {
  }

}
