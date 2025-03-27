import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, action: string = 'OK', duration: number = 2000) {
    this.snackBar.open(message, action, {
      duration,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['custom-toast', 'success-toast'],
    });
  }

  showError(message: string, action: string = 'Close', duration: number = 2000) {
    this.snackBar.open(message, action, {
      duration,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['custom-toast', 'error-toast'],
    });
  }
}
