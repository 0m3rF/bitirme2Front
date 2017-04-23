import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { LoginComponent } from './login/login.component';
import 'rxjs/add/operator/map';
 
@Injectable()
export class AuthenticationService {
  private apiUrl = 'http://localhost:3000/api/db';
  
    constructor(private http: Http) { }
 
    login(username: string, password: string) {
         var body = { "username": username, "password": password };
        return this.http.post(this.apiUrl+"/loginUser", body)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    
                    //this.loginComp.openSnackBar("LOGIN_SUCCESS","OK");
                    console.log("hello! currentUser = " + JSON.stringify(user));
                    
                }else{
                    //this.loginComp.openSnackBar("LOGIN_FAIL","OK");
                }
            });
    }
 
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}
