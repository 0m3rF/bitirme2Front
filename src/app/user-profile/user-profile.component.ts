import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/distinctUntilChanged';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @ViewChild("searchInput") searchInput;
  songs = null;
  translate = null;
  constructor(private service: AppService) 
  { 
    this.translate = service.getTranslate();
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
          this.songs = res;
          });
      })
  }

  isSongChecked(sarkiId)
  {
    return this.service.favSongs.indexOf(sarkiId) == -1  ? false : true; 
  }

  isGenreChecked(check)
  {
    return this.service.favGenres.indexOf(check) == -1 ? false : true;
  }

  
  addFavSong(sarkiId)
  {
    var index = this.service.favSongs.indexOf(sarkiId);
    console.log("sarki id = " + sarkiId);
    
    if(index == -1)
    {
      this.service.favSongs.push(sarkiId);
    }

    else
    {
      this.service.favSongs.splice(index,1);
    }

    var local = JSON.parse(localStorage.getItem("currentUser"));
    local.favSongId = this.service.favSongs;
    localStorage.setItem("currentUser",JSON.stringify(local));

    this.service.setFirstTimeInfo(local).subscribe(res=>{

    });
  }

  addFavGenre(genreId)
  {
    var index = this.service.favGenres.indexOf(genreId);
    console.log("genre id = " + genreId);
    
    if(index == -1)
    {
      this.service.favGenres.push(genreId);
    }

    else
    {
      this.service.favGenres.splice(index,1);
    }

    var local = JSON.parse(localStorage.getItem("currentUser"));
    local.favGenreId = this.service.favGenres;
    localStorage.setItem("currentUser",JSON.stringify(local));

    this.service.setFirstTimeInfo(local).subscribe(res=>{

    });
  }

}
