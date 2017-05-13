import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {
  
  translate = null;
  forYouSongs = null;
  countrySongs = null;
  ageSongs = null;
  genreSongs = null;
  first = null;
  stateCtrl: FormControl; // autocomplete için
  filteredStates: any;
  
  constructor(private service: AppService) {
    this.first = 100;
    this.translate = service.getTranslate();

    
    this.stateCtrl = new FormControl();

        this.filteredStates = this.stateCtrl.valueChanges
        .startWith(null)
        .map(name => this.filterStates(name));

        this.stateCtrl.valueChanges
        .debounceTime(750)
        .subscribe(a =>{
          var local = JSON.parse(localStorage.getItem("currentUser"));
          this.service.getPlaylistRecommendation(this.service.getCountryIdFromname(a),local.age,0,3).subscribe(res=>{
            console.log("ülkeye göre res = " + JSON.stringify(res));
            this.countrySongs = res;
          }) 
        });

   
    this.service.getPopularSongs().subscribe(res =>{
      this.forYouSongs = res;
      console.log("res = " + JSON.stringify(res));
      
    });
   }

  filterStates(val: string) {
    var vals = this.service.countries.map(val => val.country);
    return val ? vals.filter(s => new RegExp(`^${val}`, 'gi').test(s))
               : vals;
  }

  genreChanged(e)
  {
    var local = JSON.parse(localStorage.getItem("currentUser"));
    console.log("e = " + e.value);
    this.service.getPlaylistRecommendation(local.country,local.age,e.value,2)
    .subscribe(res=>{
      console.log("genreye göre res = " + JSON.stringify(res));
      this.genreSongs = res;
    });
  }

  ngOnInit() {
  }

}
