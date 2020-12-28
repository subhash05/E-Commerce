import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { Product } from 'src/app/model/product';
import { User } from 'src/app/model/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterItem } from 'src/app/model/filter-item';
import { BrandFilter } from 'src/app/model/brand-filter';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  searchProd: FormGroup;
  currentUser = new User();

  tempProducts : Product[] = [];
  allProducts : Product[] = [];
  originalAllProducts : Product[] = [];
  
  allFilters : FilterItem[] = [];
  colorFilter : BrandFilter[] = [];
  brandFilter : BrandFilter[] = [];
  
  selectedColor : BrandFilter[] = [];
  selectedBrand : BrandFilter[] = [];

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
        this.originalAllProducts = data;
        this.allProducts = data;  
        this.getAllFilters();
      });
  }

  resetFilters() {
    console.log("ënter into reset Filter");
    this.allProducts = this.originalAllProducts;
    this.tempProducts = [];
    this.selectedBrand = [];
    this.selectedColor = [];

    for(let i=0;i<this.brandFilter.length;i++)
      this.brandFilter[i].isChecked = false;

    for(let i=0;i<this.colorFilter.length;i++)
      this.colorFilter[i].isChecked = false;

  }

  getAllFilters() { 
    this.authenticationService.getAllFilters()
   .pipe(first())
   .subscribe(
      data => {console.log(data);
        this.allFilters = data; 
        this.brandFilter = this.allFilters[0].values;
        this.colorFilter = this.allFilters[1].values; 

        for(let i=0;i<this.brandFilter.length;i++)
        this.brandFilter[i].isChecked = false;
  
       for(let i=0;i<this.colorFilter.length;i++)
        this.colorFilter[i].isChecked = false;
      });
  }


  selectColor(selectedClr : BrandFilter){
    if(!this.selectedColor.includes(selectedClr))
      this.selectedColor.push(selectedClr);
    else  
      this.selectedColor.splice(this.selectedColor.indexOf(selectedClr), 1);

      console.log("color filter size = "+selectedClr.isChecked);
      this.tempProducts = [];

    for(let i=0;i<this.selectedColor.length;i++){
      for(let j=0;j<this.originalAllProducts.length;j++){
          if(this.originalAllProducts[j].colour.color === this.selectedColor[i].color){
            this.tempProducts.push(this.originalAllProducts[j]);
            break;
          }
      }
    }

    this.allProducts = this.tempProducts;
  }

  selectBrand(selectedBrd : BrandFilter){
    if(!this.selectedBrand.includes(selectedBrd))
      this.selectedBrand.push(selectedBrd);
    else  
       this.selectedBrand.splice(this.selectedBrand.indexOf(selectedBrd), 1);
    
       this.tempProducts = [];
    for(let i=0;i<this.selectedBrand.length;i++){
      for(let j=0;j<this.originalAllProducts.length;j++){
          if(this.originalAllProducts[j].title === this.selectedBrand[i].title){
            this.tempProducts.push(this.originalAllProducts[j]);
            break;
          }
      }
    }

    this.allProducts = this.tempProducts;
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
