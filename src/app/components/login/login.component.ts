import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';
import { User } from 'src/app/model/user';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup ;
  submitted = false;
  returnUrl: string = "";
  currUser = new User();

  constructor( private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,  private authenticationService: AuthenticationService) {
      this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });
     }

    

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
  });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.authenticationService.login(this.f.username.value, this.f.password.value)
        .pipe(first())
        .subscribe(
            data => {console.log(data);
              if(data.length > 0){
                this.currUser = data[0];
                localStorage.setItem('currentUser', JSON.stringify(this.currUser));
                localStorage.setItem('currentUserFullName', this.currUser.fullName);
                this.router.navigate(["/items"]);
               }else{
                alert("invalid username or password");
                this.router.navigate(["/login"]);
              }  
             
            },
            error => {
              alert("invalid username or password");
              this.router.navigate(["/login"]);
            });
  }


}
