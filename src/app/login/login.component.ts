import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';
import { FormsModule,FormGroup, FormBuilder , Validators} from '@angular/forms';
declare var $:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit  {

  translate:any;
  model: any = {};
  loading = false;
  returnUrl: string;

  rForm : FormGroup;
  post: any;
  name: string = '';
  pass: string = '';
  mail: string = '';

  constructor(
    private service: AppService,
    private _route: ActivatedRoute,
    private _router: Router,
    private fb: FormBuilder
  ){ 
    this.translate = service.getTranslate(); 
    this.rForm = fb.group({
      'name' : [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)]) ],
      'pass' : [null, Validators.compose([Validators.required, Validators.minLength(6)])  ],
      'mail' : [null, Validators.compose([Validators.required, Validators.email]) ] 
    }); 
    
    
  }

  ngOnInit() {
    $('.message a').click(function(e){

          $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
    });
   }

   animateForm()
   {
     $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
   }

   // TODO : giriş komponentlerinde form kontrolleri yapılacak!
    login() {
        this.loading = true;
        var username = $("input")[0].value;
        var password = $("input")[1].value;

       this.service.login(username,password).subscribe(res=>{

         if(res.LOGIN == "success")
         {
            localStorage.setItem("currentUser",JSON.stringify(res));
            this.service.isFirstTime = res.isFirstTime;
            this.service.isLoggedin = true;
            this.service.setLocalInfos();
            this._router.navigate(['dashboard']);
            this.service.openSnackBar("LOGIN_SUCCESS","OK");
            
         }
         else{
            this.service.openSnackBar("LOGIN_FAIL","OK");
         }
       });
    }

    registerUser(form)
    {
      console.log(form)
      this.service.create(form.name,form.pass,form.mail).subscribe(res =>{

          if(res.register == "success")
          {
            $('.message a')[0].click();
            this.service.openSnackBar('REGISTER_SUCCESS','OK');
            
          }
          else{
            this.service.openSnackBar('REGISTER_FAIL','OK');
          }

        })
    }

    register(e){


        var username = $("input")[2].value;
        var password = $("input")[3].value;
        var email = $("input")[4].value;

        this.service.create(username,password,email).subscribe(res =>{

          if(res.register == "success")
          {
            $('.message a')[0].click();
            this.service.openSnackBar('REGISTER_SUCCESS','OK');
            
          }
          else{
            this.service.openSnackBar('REGISTER_FAIL','OK');
          }

        })

    }



}
