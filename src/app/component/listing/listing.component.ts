import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../model/product.model';
import { ProductServiceService } from '../../service/product-service.service';
import { ToastService } from '../../service/toast.service';
import { AddProductComponent } from '../add-product/add-product.component';
import { ViewProductComponent } from '../view-product/view-product.component';

@Component({
  selector: 'app-listing',
  standalone: false,
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.scss'
})
export class ListingComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  products: Product[] = [];
  newlyaddedProduct: any = []
  editControl = new FormControl('');
  editingProductId: any = null;

  constructor(
    private productService: ProductServiceService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {

  }
  ngOnInit(): void {
    this.getProducts()
  }

  // get all product

  getProducts(): void {
    let newProduct: any[] = [];
    this.productService.productIds$.subscribe((ids) => {
      this.newlyaddedProduct = ids;
      if (this.newlyaddedProduct.length > 0) {
        this.productService.getProductsByIds(this.newlyaddedProduct).subscribe({
          next: (response) => {
            newProduct = response;
            this.fetchAndMergeProducts(newProduct);
          },
          error: (error) => {
            console.error('Error fetching new products:', error);
          },
        });
      } else {
        this.fetchAndMergeProducts([]);
      }
    });
  }

  // fetch newly added product and merge with default api static data 

  fetchAndMergeProducts(newProduct: any[]): void {
    this.productService.getproductList().subscribe({
      next: (response) => {
        this.products = [...newProduct, ...response];
      },
      error: (err) => {
        this.toastService.showError(err.error.error)
      }
    });
  }

  //open add edit dialog 

  openProductDialog(productId?: number): void {
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: '600px',
      data: productId ? { id: productId } : null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getProducts();
      }
    });
  }

  // open view dialog

  openViewDialog(product: Product) {
    this.dialog.open(ViewProductComponent, {
      width: '600px',
      data: product,
    });
  }

  // delete product 

  deleteProduct(id: any) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.toastService.showSuccess(`Product with ID ${id} deleted successfully`)
          this.productService.removeProductId(id);
        },
        error: (err) => {
          this.toastService.showError(err.error.error)
        }
      });
    }
  }

  // pertially name edit using patch api 

  enableEdit(product: Product): void {
    this.editingProductId = product.id;
    this.editControl.setValue(product.name);
  }

  updateProductName(product: Product): void {
    if (this.editControl.valid && this.editControl.value !== product.name) {
      const updatedName = { name: this.editControl.value };

      this.productService.patchProduct(product.id, updatedName).subscribe({
        next: (updatedProduct) => {
          product.name = updatedProduct.name;
          this.cancelEdit();
          this.toastService.showSuccess("Product updated")
        },
        error: (err) => {
          this.toastService.showError(err.error.error)
        }
      });
    } else {
      this.cancelEdit();
    }
  }

  cancelEdit(): void {
    this.editingProductId = null;
    this.editControl.reset();
  }
}
