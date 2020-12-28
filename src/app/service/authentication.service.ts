import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currUser = new User();
  //private currentUserSubject: BehaviorSubject<User>;
  //public currentUser: Observable<User>;

  constructor(private http: HttpClient,  private router: Router) { 
   //this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
   //this.currentUser = this.currentUserSubject.asObservable();
  }

  //public get currentUserValue(): User {
    //return this.currentUserSubject.value;
  //}

  login(username: string, password: string) {
    console.log("username === ",username);
    this.currUser.username = username;
    this.currUser.password = password;
    return this.http.get<any>("https://xebiascart.herokuapp.com/users?username="+username, httpOptions)
        .pipe(map(user => {
            // login successful if there's a jwt token in the response
            if (user) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('currentUserFullName', user.fullName);
                //this.currentUserSubject.next(user);
            }else{
              this.router.navigate(['/login']);
              alert("invalid username and password");
            }

            return user;
        }));
  }

  getAllProducts() {
    return this.http.get<any>("https://xebiascart.herokuapp.com/products")
        .pipe(map(data => {

            return data;
        }));
  }


  getAllFilters() {
    return this.http.get<any>("https://xebiascart.herokuapp.com/filters")
        .pipe(map(data => {
            return data;
        }));
  }


  searchByName(name: string) {
    return this.http.get<any>("https://xebiascart.herokuapp.com/products?title="+name)
        .pipe(map(data => {

            return data;
        }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    //this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
