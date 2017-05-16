import { Component, OnInit,Input } from '@angular/core';
import { AppService } from '../app.service'; 
import { DomSanitizer } from '@angular/platform-browser';

declare var YT: any;

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements OnInit {


isPlaying = false;
intervalId = null;
isMuted = false;
passedMs = 0;
second = null;
min = null;
durSec = null;
durMin = null;
@Input() song = {
  sarkiId : 0,
  sarkiismi : "",
  sanatciIsmi : "",
  genreId : 0
};
youtubesrc :any = null;
bufferValue = 0;
isIdLoaded = false;
ytplayer = null;

  constructor(public service: AppService,public sanitizer:DomSanitizer) {
    service.musicPlayerComponent = this;
   }
 ngOnInit() {
  }

   videoURL() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.youtubesrc);
  }

  playSong()
  {
    this.isIdLoaded = false;
    this.passedMs = 0;
    var search =  this.song.sarkiismi+ " " +  this.song.sanatciIsmi;

    this.service.getYoutubeSongID(search).subscribe(res=>{

      this.youtubesrc = "https://www.youtube.com/embed/"+res.id+"?autoplay=1&enablejsapi=1&version=3&playerapiid=ytplayer";
      this.youtubesrc = this.videoURL();
      this.isIdLoaded = true;
      
      setTimeout(()=>{
        this.ytplayer = new YT.Player('youtube');
        this.isPlaying = true;
        console.log(this.ytplayer);
    },300);
      

      this.intervalId = setInterval(()=>{
        
      if(this.isPlaying && this.ytplayer != null)
      {
        var time= this.ytplayer.getCurrentTime();
        this.min = Math.floor(time / 60);
        this.second = Math.floor(time - this.min * 60 );
        
        var durTime = this.ytplayer.getDuration();
        this.durMin = Math.floor(durTime / 60);
        this.durSec = Math.floor(durTime - this.durMin * 60 );

        this.bufferValue =  ( time / this.ytplayer.getDuration()) * 100;
        if(this.bufferValue >= 100)
          this.isPlaying = false;

          this.passedMs += 1000;           
          if(this.passedMs % 10000 == 0) // her 10 snde bir dinlenme kısmını güncelliyor
          {
            this.service.addSongTime(this.song).subscribe((res)=>{
            console.log("10 sn geçti dinlenme süresine eklendi! "  + JSON.stringify(res));            
            });
          }
      }

    },1000)

        });

  }

  resumeSong()
  {
    this.isPlaying = true;
    this.intervalId = setInterval(()=>{
        
      if(this.isPlaying && this.ytplayer != null) 
      {
        var time= this.ytplayer.getCurrentTime();
        this.min = Math.floor(time / 60);
        this.second = Math.floor(time - this.min * 60 );
        
        var durTime = this.ytplayer.getDuration();
        this.durMin = Math.floor(durTime / 60);
        this.durSec = Math.floor(durTime - this.durMin * 60 );

        this.bufferValue =  ( time / this.ytplayer.getDuration()) * 100;
        
        if(this.bufferValue >= 100)
          this.isPlaying = false;

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

  pauseSong()
  {
    this.isPlaying = false;
    var highestTimeoutId = setTimeout(";");
    for (var i = 0 ; i < highestTimeoutId ; i++) {
      window.clearInterval(i);
    } 
   
  }

  togglePlay()
  {
    if(this.bufferValue >= 100)
    {
      this.service.addSongHistory(this.song).subscribe((res)=>{});
      this.bufferValue = 0;
      this.second  = 0;
      this.min = 0;
      this.playSong();
      return;
    }

    if(this.isPlaying)
    {
      this.pauseSong();
      document.querySelector("iframe").contentWindow.postMessage('{"event":"command","func":"pauseVideo"}', '*');    
    }
    else
    {

      this.resumeSong();  
      document.querySelector("iframe").contentWindow.postMessage('{"event":"command","func":"playVideo"}', '*');    
    }
  }

  toggleMute()
  {

    console.log("MUTe ?" + this.isMuted);
    if(!this.isMuted)
    {
      this.ytplayer.mute();
      this.isMuted = true;
    }
    else
    {
      this.ytplayer.unMute();
      this.isMuted = false;
    }
  }


  closeMusicPlayer()
  {
    this.isPlaying = false;
    this.isIdLoaded = false;
    this.bufferValue = 0;
    this.second = 0;
    this.min = 0;
    this.song = {
      sarkiId : 0,
      sarkiismi : "",
      sanatciIsmi : "",
      genreId : 0
    };
  }


  sliderChange(e)
  {
    this.ytplayer.seekTo(this.ytplayer.getDuration() * e.value / 100);
  }

}



/*
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
        }*/
