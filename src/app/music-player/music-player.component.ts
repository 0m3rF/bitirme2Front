import { Component, OnInit,Input } from '@angular/core';
import { AppService } from '../app.service'; 
@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements OnInit {

isPlaying = false;
intervalId = null;
passedMs = 0;
second = null;
min = null;
song = {
  sarkiId : 0,
  sarkiismi : "",
  sanatciIsmi : "",
  genreId : 0
};
bufferValue = 0;

  constructor(public service: AppService) {
    service.musicPlayerComponent = this;
   }

  playSong()
  {
    this.isPlaying = true;
    this.passedMs = 0;

    if(this.bufferValue >= 0)
    {
      this.min = 0;
      this.second = 0;
    }

    this.intervalId = setInterval(()=>{

      if(this.isPlaying)
      {
        
        if(this.bufferValue < 100)
        {
          this.bufferValue += 0.5;  

          if(this.bufferValue > 30)
          {
            this.second = (this.bufferValue * 2) - ((Math.floor(this.bufferValue/30) * 30 )*2);
            this.min = Math.floor(this.bufferValue/30);
          }
          else
          {
            this.second = this.bufferValue *2 ;
            this.min = 0 ;
          }

          if(this.second <= 9)
              this.second = "0" + this.second;
          
        } 
        else
        {
          this.pauseSong();
          return;        
        }

          this.passedMs += 1000;           
          if(this.passedMs % 10000 == 0) // her 10 snde bir dinlenme kısmını güncelliyor
          {
            this.service.addSongTime(this.song).subscribe((res)=>{
            console.log("10 sn geçti dinlenme süresine eklendi! "  + JSON.stringify(res));            
            });
          }
      }

    },1000)


  }

  bufferValueToSecond(val)
  {
    return val * (100/55); 
  }

  pauseSong()
  {
    this.isPlaying = false;
    clearInterval(this.intervalId);
  }

  togglePlay()
  {
    if(this.bufferValue >= 100)
    {
      this.service.addSongHistory(this.song).subscribe((res)=>{

      });
      this.bufferValue = 0;
      this.second  = 0;
      this.min = 0;
      this.playSong();
      return;
    }

    if(this.isPlaying)
    {
      this.pauseSong();
    }
    else
    {
      this.playSong();  
    }
  }
  ngOnInit() {
  }

}
