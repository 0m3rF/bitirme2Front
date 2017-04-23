import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';
import { AuthenticationService} from '../authentication.service';
declare var $:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  translate:any;
  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(
    private _service: AppService,
    private _authenticationService: AuthenticationService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { this.translate = _service.getTranslate(); }

  ngOnInit() {
    $('.message a').click(function(e){
        e.preventDefault();
          $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
    });
    // reset login status
    this._authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = "dashboard";//this._route.snapshot.queryParams['returnUrl'] || '/';
  }

    login() {
        this.loading = true;
        var username = $("input")[0].value;
        var password = $("input")[1].value;

        this._authenticationService.login(username, password)
            .subscribe(
                data => {

                    this._router.navigate([this.returnUrl]);
                },
                error => {
                    console.log("Hata! = " + error);
                    
                    this.loading = false;
                });
    }

    register(){

        var username = $("input")[2].value;
        var password = $("input")[3].value;
        var email = $("input")[4].value;

        this._service.create(username,password,email).subscribe(res =>{
          console.log("register res = " + JSON.stringify(res));

          if(res.register == "success")
          {
            $('.message a')[0].click();
            this._service.openSnackBar('REGISTER_SUCCESS','OK');
            
          }
          else{
            this._service.openSnackBar('REGISTER_FAIL','OK');
          }

        })

    }



}
