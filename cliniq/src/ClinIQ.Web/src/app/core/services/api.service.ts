import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  succeeded: boolean;
  data: T;
  message: string;
  errors: string[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface QueryParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: QueryParams): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, { params: httpParams })
      .pipe(
        map(response => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  getById<T>(endpoint: string, id: string | number): Observable<T> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${id}`)
      .pipe(
        map(response => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(
        map(response => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  put<T>(endpoint: string, id: string | number, body: any): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${id}`, body)
      .pipe(
        map(response => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  patch<T>(endpoint: string, id: string | number, body: any): Observable<T> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${id}`, body)
      .pipe(
        map(response => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  delete<T>(endpoint: string, id: string | number, params?: QueryParams): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${id}`, { params: httpParams })
      .pipe(
        map(response => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  upload<T>(endpoint: string, formData: FormData): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, formData)
      .pipe(
        map(response => this.handleResponse(response)),
        catchError(this.handleError)
      );
  }

  download(endpoint: string, fileName: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${endpoint}`, {
      responseType: 'blob'
    }).pipe(
      map(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        return blob;
      }),
      catchError(this.handleError)
    );
  }

  private buildParams(params?: QueryParams): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return httpParams;
  }

  private handleResponse<T>(response: ApiResponse<T>): T {
    if (response.succeeded) {
      return response.data;
    }
    throw new Error(response.message || 'An error occurred');
  }

  private handleError(error: HttpErrorResponse | Error): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error instanceof Error && !(error instanceof HttpErrorResponse)) {
      errorMessage = error.message || errorMessage;
    } else if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.succeeded === false && error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.title) {
        errorMessage = error.error.title;
      } else if (error.error?.errors?.length) {
        errorMessage = error.error.errors.join(', ');
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else {
        switch (error.status) {
          case 0: errorMessage = 'Cannot connect to server. Please check if the backend is running.'; break;
          case 400: errorMessage = 'Bad request'; break;
          case 401: errorMessage = 'Please log in again'; break;
          case 403: errorMessage = 'You do not have permission for this action'; break;
          case 404: errorMessage = 'Resource not found'; break;
          case 500: errorMessage = 'Server error. Please try again later.'; break;
          case 502: errorMessage = 'Backend server is unavailable'; break;
          case 503: errorMessage = 'Service temporarily unavailable'; break;
        }
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
