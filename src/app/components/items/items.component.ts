import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { Product } from 'src/app/model/product';
import { User } from 'src/app/model/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  searchProd: FormGroup;
  currentUser = new User();
  allProducts : Product[] = [];
  //productName : string = "";

  constructor( private formBuilder: FormBuilder,
    private http: HttpClient, 
    private authenticationService: AuthenticationService) {
    this.searchProd = this.formBuilder.group({
      productName: ['', Validators.required]
    });
   }

  ngOnInit(): void {
    const userJson = localStorage.getItem('currentUser');
    this.currentUser = userJson !== null ? JSON.parse(userJson) : new User();
    this.getAllProducts();
  }

  get f() { return this.searchProd.controls; }

  getAllProducts() {
    console.log("ënter into getAllProducts");
    this.authenticationService.getAllProducts()
   .pipe(first())
   .subscribe(
      data => {console.log(data);
        this.allProducts = data;  
       
      });
  }

  searchProduct() {
    this.authenticationService.searchByName(this.f.productName.value)
    .pipe(first())
    .subscribe(
       data => {console.log(data);
         this.allProducts = data;  
        
       });
  }

  cartValue = 0;
  showItem = true;

  addItem(){
       this.showItem = true;
       return this.cartValue = this.cartValue + 1;
  }

}
