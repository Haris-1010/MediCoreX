import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ApiService {
    constructor(http) {
        this.http = http;
        this.baseUrl = environment.apiUrl;
    }
    get(endpoint, params) {
        const httpParams = this.buildParams(params);
        return this.http.get(`${this.baseUrl}/${endpoint}`, { params: httpParams })
            .pipe(map(response => this.handleResponse(response)), catchError(this.handleError));
    }
    getById(endpoint, id) {
        return this.http.get(`${this.baseUrl}/${endpoint}/${id}`)
            .pipe(map(response => this.handleResponse(response)), catchError(this.handleError));
    }
    post(endpoint, body) {
        return this.http.post(`${this.baseUrl}/${endpoint}`, body)
            .pipe(map(response => this.handleResponse(response)), catchError(this.handleError));
    }
    put(endpoint, id, body) {
        return this.http.put(`${this.baseUrl}/${endpoint}/${id}`, body)
            .pipe(map(response => this.handleResponse(response)), catchError(this.handleError));
    }
    patch(endpoint, id, body) {
        return this.http.patch(`${this.baseUrl}/${endpoint}/${id}`, body)
            .pipe(map(response => this.handleResponse(response)), catchError(this.handleError));
    }
    delete(endpoint, id) {
        return this.http.delete(`${this.baseUrl}/${endpoint}/${id}`)
            .pipe(map(response => this.handleResponse(response)), catchError(this.handleError));
    }
    upload(endpoint, formData) {
        return this.http.post(`${this.baseUrl}/${endpoint}`, formData)
            .pipe(map(response => this.handleResponse(response)), catchError(this.handleError));
    }
    download(endpoint, fileName) {
        return this.http.get(`${this.baseUrl}/${endpoint}`, {
            responseType: 'blob'
        }).pipe(map(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
            return blob;
        }), catchError(this.handleError));
    }
    buildParams(params) {
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
    handleResponse(response) {
        if (response.succeeded) {
            return response.data;
        }
        throw new Error(response.message || 'An error occurred');
    }
    handleError(error) {
        let errorMessage = 'An unknown error occurred';
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        }
        else if (error.error?.message) {
            errorMessage = error.error.message;
        }
        else if (error.error?.errors?.length) {
            errorMessage = error.error.errors.join(', ');
        }
        else {
            switch (error.status) {
                case 400:
                    errorMessage = 'Bad request';
                    break;
                case 401:
                    errorMessage = 'Unauthorized';
                    break;
                case 403:
                    errorMessage = 'Access denied';
                    break;
                case 404:
                    errorMessage = 'Resource not found';
                    break;
                case 500:
                    errorMessage = 'Internal server error';
                    break;
            }
        }
        return throwError(() => new Error(errorMessage));
    }
    static { this.ɵfac = function ApiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ApiService)(i0.ɵɵinject(i1.HttpClient)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ApiService, factory: ApiService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ApiService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.HttpClient }], null); })();
//# sourceMappingURL=api.service.js.map