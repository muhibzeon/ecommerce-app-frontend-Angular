import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string;
  searchMode: boolean = false;

  //property for pagination
  thePageNumber: number = 1;
  thepageSize: number = 10;
  theTotalElements: number = 0;

  previousKeyword: string;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
    this.listProducts();
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProduct();
    } else {
      this.handleListProduct();
    }
  }

  handleSearchProduct() {
    const theKeyword: string = String(
      this.route.snapshot.paramMap.get('keyword')
    );

    //if we hav a different keyword than previous
    //then set thePageNumber to 1

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;
    console.log(`Keyword=${theKeyword},thePageNumber=${this.thePageNumber}`);

    //now search for the products using keyword
    this.productService
      .searchProductsPaginate(
        this.thePageNumber - 1,
        this.thepageSize,
        theKeyword
      )
      .subscribe(this.processResult());
  }

  handleListProduct() {
    //check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      //get the id param string, convert it to a number using the "+" symbol
      this.currentCategoryId = Number(this.route.snapshot.paramMap.get('id'));

      //get the "name" param string
      this.currentCategoryName = String(
        this.route.snapshot.paramMap.get('name')
      );
    } else {
      //not a category id available... default to category id 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    //check if we have a different category than previous
    //Note: Angular will reuse a component if it is currently being viewed

    //if we have a different category id then previous
    //then set the page Number back to 1

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(
      `currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`
    );

    //get pagination from service
    this.productService
      .getProductListPaginate(
        this.thePageNumber - 1,
        this.thepageSize,
        this.currentCategoryId
      )
      .subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.theTotalElements = data.page.totalElements;
      this.thepageSize = data.page.size;
    };
  }

  updatePageSize(pageSize: number) {
    this.thepageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to Cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }
}
