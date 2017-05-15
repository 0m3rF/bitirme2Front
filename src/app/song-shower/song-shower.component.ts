import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../app.service';
@Component({
  selector: 'app-song-shower',
  templateUrl: './song-shower.component.html',
  styleUrls: ['./song-shower.component.css']
})
export class SongShowerComponent implements OnInit {
@Input() info;

  constructor(private service : AppService) { }

  ngOnInit() {
  }

  isSongChecked(sarkiId)
  {
    return this.service.favSongs.indexOf(sarkiId) == -1  ? false : true; 
  }

  toggleSongFav(sarkiId)
  {
  var index = this.service.favSongs.indexOf(sarkiId);
    console.log("sarki id = " + sarkiId);
    
    if(index == -1)
    {
      this.service.favSongs.push(sarkiId);
      this.service.addSongTime(this.info).subscribe();
    }else
    {
      this.service.favSongs.splice(index,1);
      this.service.minusSongTime(this.info).subscribe();
    }

    var local = JSON.parse(localStorage.getItem("currentUser"));
    local.favSongId = this.service.favSongs;
    localStorage.setItem("currentUser",JSON.stringify(local));

    this.service.setFirstTimeInfo(local).subscribe(res=>{

    });
  }

  playSong(song)
  {
   console.log("Çalınacak parça = " + JSON.stringify(song) ); 
   this.service.musicPlayerComponent.song = song;
   this.service.musicPlayerComponent.bufferValue = 0;
   this.service.musicPlayerComponent.playSong();
   
   this.service.addSongHistory(song).subscribe(res=>{
     console.log("şarkı geçmişe eklendi :  " + JSON.stringify(res));
   });
  }

}
