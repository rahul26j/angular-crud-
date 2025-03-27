import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
  public apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }
  
  private productIdsSubject = new BehaviorSubject<string[]>([]);
  productIds$ = this.productIdsSubject.asObservable();

  addProductId(id: any): void {
    const currentIds = this.productIdsSubject.getValue();
    this.productIdsSubject.next([...currentIds, id.toString()]);
  }

  removeProductId(id: any): void {
    const currentIds = this.productIdsSubject.getValue();
    const updatedIds = currentIds.filter((productId) => productId !== id);
    this.productIdsSubject.next(updatedIds);
  }

  getproductList(): Observable<any> {
    return this.http.get(`${this.apiUrl}`)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  getProductsByIds(ids: any[]): Observable<any> {
    const idParams = ids.map(id => `id=${id}`).join('&');
    return this.http.get(`${this.apiUrl}?${idParams}`).pipe(
      retry(1),
      catchError(this.errorHandler)
    );
  }

  getProductById(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      retry(1),
      catchError(this.errorHandler)
    );
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, product).pipe(
      catchError(this.errorHandler)
    );
  }

  updateProduct(id: any, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product).pipe(
      catchError(this.errorHandler)
    );
  }

  patchProduct(id: number, partialProduct: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, partialProduct).pipe(
      catchError(this.errorHandler)
    );
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.errorHandler)
    );
  }
  private errorHandler(error: any): Observable<never> {
    return throwError(() => error);
  }
}
