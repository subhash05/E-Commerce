import { Colour } from "./colour";
import { Price } from "./price";

export class Product {
    id : string = "";
    brand : string = "";
    discount : number = 0;
    rating : number = 0.0;
    image : string = "";
    title : string = "";
    colour = new Colour();
    price = new Price();

    Product(){
        this.id = "";
        this.brand = "";
        this.discount = 0;
        this.rating = 0.0;
        this.image = "";
        this.title = "";
        this.colour = new Colour();
        this.price = new Price();
    }
}
