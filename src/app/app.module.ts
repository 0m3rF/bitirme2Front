import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';


import { CookieService} from 'angular2-cookie/core';
import { AppService } from './app.service';
import { AuthGuard } from './auth.guard'; 
import { routes } from './app.router';


import { AppComponent } from './app.component';
import { FirstPageComponent } from './first-page/first-page.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { FirstTimeComponent } from './first-time/first-time.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { UserStatsComponent } from './user-stats/user-stats.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { MusicPlayerComponent } from './music-player/music-player.component';
import { SongShowerComponent } from './song-shower/song-shower.component';
import { SafePipe } from './safe.pipe';

export function httpFactory(http:Http) {
  return new TranslateStaticLoader(http, '/assets/i18n', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    FirstPageComponent,
    LoginComponent,
    HeaderComponent,
    DashboardPageComponent,
    FirstTimeComponent,
    PlaylistsComponent,
    UserStatsComponent,
    UserProfileComponent,
    UserSettingsComponent,
    MusicPlayerComponent,
    SongShowerComponent,
    SafePipe
  ],
  imports: [
    ChartsModule,
    routes,
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: httpFactory,
            deps: [Http]
        })
  ],
  providers: [AppService,CookieService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
