import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../model/product.model';

@Component({
  selector: 'app-view-product',
  standalone: false,
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.scss'
})
export class ViewProductComponent {

  constructor(
    public dialogRef: MatDialogRef<ViewProductComponent>,
    @Inject(MAT_DIALOG_DATA) public product: Product
  ) { }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  close(): void {
    this.dialogRef.close();
  }
}
