import { Component, OnInit } from '@angular/core';
import Product from 'src/app/models/product.model';
import { ServerService } from 'src/app/services/server.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products?: Product[] = [];
  totalLength: any;
  page: number = 1;

  constructor(private serverService: ServerService, private router: Router) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.serverService.getAllProducts().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.products = data.reverse();
      this.totalLength = data.length;
    });
  }

  deleteProduct(keyProduct: string, keyFile: string, nameFile: string): void {
    this.serverService.deleteProduct(keyProduct).then(() => {
      this.serverService.deleteFile(keyFile, nameFile);
    }).catch(err => console.log(err));
  }

  editProduct(key: string) {
    this.router.navigate(['/system/edit', key]);
  }

}
