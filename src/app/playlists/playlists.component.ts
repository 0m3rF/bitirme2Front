import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/distinctUntilChanged';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {
  @ViewChild("searchInput") searchInput;

  translate = null;
  searchSongs = null;
  forYouSongs = null;
  countrySongs = null;
  ageSongs = null;
  genreSongs = null;
  first = null;
  stateCtrl: FormControl; // autocomplete için
  filteredStates: any;
  selectedGenre = 0;
  
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

        var local =  JSON.parse(localStorage.getItem("currentUser"));
          this.service.getPlaylistRecommendation(local.country,local.age,0,1).subscribe(res=>{
            this.forYouSongs = res;
            console.log("kişiye özel res = " + JSON.stringify(res));
          });
   /*
    this.service.getPopularSongs().subscribe(res =>{
      this.forYouSongs = res;
      console.log("res = " + JSON.stringify(res));
      
    });*/
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
    this.selectedGenre = e.value;
    this.service.getPlaylistRecommendation(local.country,local.age,e.value,2)
    .subscribe(res=>{

      this.genreSongs = res;
    });
  }

  ngOnInit() {

      var keyups = Observable.fromEvent(<HTMLInputElement>this.searchInput.nativeElement,"keydown")
      .map((e:KeyboardEvent) => (<HTMLInputElement>e.target).value )
      .filter( val => val.length > 2 )
      .debounceTime(500)
      .distinctUntilChanged();
      
      keyups.subscribe(val =>{ 
          console.log("You search that :" + val);
          this.service.searchSong(val).subscribe(res =>{
          this.searchSongs = res;
          });
      })
  }

  refreshPlayList(type)
  { // type 0 = for you, 1 = ülkeler , 2 = türler , 3 = yaş 
    var local = JSON.parse(localStorage.getItem("currentUser"));

    switch(type)
    {
      case 0:
      this.service.getPlaylistRecommendation(local.country,local.age,0,1)
        .subscribe(res=>{
          this.forYouSongs = res;
        });
      break;

      case 1:
      this.service.getPlaylistRecommendation(local.country,local.age,0,3)
        .subscribe(res=>{
          this.countrySongs = res;
        });
      break;

      case 2:
      this.service.getPlaylistRecommendation(local.country,local.age,this.selectedGenre,2)
        .subscribe(res=>{
          this.genreSongs = res;
        });
      break;

      case 3:
      this.service.getPlaylistRecommendation(local.country,local.age,0,4)
        .subscribe(res=>{
          this.ageSongs = res;
        });
      break;
    }

  }

  

}
