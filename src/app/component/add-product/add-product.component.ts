import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../model/product.model';
import { ProductServiceService } from '../../service/product-service.service';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-add-product',
  standalone: false,
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode: boolean = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductServiceService,
    private toastService: ToastService,
    private dialogRef: MatDialogRef<AddProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id?: number }
  ) { }

  ngOnInit(): void {
    this.isEditMode = !!this.data?.id;
    this.initializeForm();
    if (this.isEditMode && this.data.id) {
      this.productId = this.data.id;
      this.fetchProductById(this.data.id);
    }
  }

  //for form 

  initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      specifications: this.fb.array([], this.minSpecificationsValidator(1)),
    });
  }

  // for one specification 

  minSpecificationsValidator(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      return formArray.length >= min ? null : { minSpecifications: true };
    };
  }

  // Get specifications FormArray

  get specifications(): FormArray {
    return this.productForm.get('specifications') as FormArray;
  }

  // Add Dynamic Field

  addField(key: string = '', value: any = ''): void {
    this.specifications.push(
      this.fb.group({
        key: [key, Validators.required],
        value: [value, Validators.required],
      })
    );
  }

  // Remove Dynamic Field

  removeField(index: number): void {
    this.specifications.removeAt(index);
  }

  // Fetch Product by ID (Edit Mode)

  fetchProductById(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (product: Product) => {
        this.productForm.patchValue({ name: product.name });
        if (product.data) {
          Object.entries(product.data).forEach(([key, value]) => {
            this.addField(key, value);
          });
        }
      },
      error: (err) => console.error('Error fetching product:', err),
    });
  }

  // Submit Form (Add or Edit)

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const { name, specifications } = this.productForm.value;
    const dynamicData = specifications.reduce(
      (acc: Record<string, any>, spec: { key: string; value: any }) => {
        acc[spec.key] = spec.value;
        return acc;
      },
      {}
    );

    const product: Product = {
      name,
      data: dynamicData,
      ...(this.isEditMode && this.productId ? { id: this.productId } : {}),
    };

    this.isEditMode ? this.updateProduct(product) : this.addProduct(product);
  }

  // Add Product

  addProduct(product: Product): void {
    this.productService.addProduct(product).subscribe({
      next: (res) => {
        this.toastService.showSuccess("Product added successfully")
        this.productService.addProductId(res.id);
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.toastService.showError(err.error.error)
      }
    });
  }

  // Update Product

  updateProduct(product: Product): void {
    this.productService.updateProduct(this.productId!, product).subscribe({
      next: (res) => {
        this.dialogRef.close(true),
        this.toastService.showSuccess("Product update successfully")
      },
      error: (err) => {
        this.toastService.showError(err.error.error)
      }
    });
  }

  // Cancel Dialog

  onCancel(): void {
    this.dialogRef.close();
  }
}
