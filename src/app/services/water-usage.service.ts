import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class WaterUsageService {
  public filterValue$ = new Subject();

  constructor(public http: HttpClient) {
  }

  public url = `${environment.apiBaseUrl}/api`;

  // public getAll(): Observable<{ locations: any[], indexes: any[], invoices: any[] }> {
  //   return this.http.get<{ locations: any[], indexes: any[], invoices: any[] }>(`${this.url}`);
  // }

  public getLocations(): Observable<{ locations: any[] }> {
    return this.http.get<{ locations: any[] }>(`${this.url}/locations`);
  }

  public getIndexes(filters: object): Observable<{ indexes: any[] }> {
    const params = Object.keys(filters)
      .map(key => (filters[key] !== '') ? `${key}=${encodeURIComponent(filters[key])}` : null)
      .filter(param => param)
      .join('&');
    return this.http.get<{ indexes: any[] }>(`${this.url}/indexes?${params}`);
  }

  public setIndex(filters: object, index: number, indexDate: string): Observable<boolean> {
    const params = Object.keys(filters)
      .map(key => (filters[key] !== '') ? `${key}=${encodeURIComponent(filters[key])}` : null)
      .filter(param => param)
      .join('&');
    return this.http.post<boolean>(`${this.url}/indexes?${params}`, { value: index, date: indexDate });
  }

  public getInvoices(filters: object): Observable<{ invoices: any[] }> {
    const params = Object.keys(filters)
      .map(key => (filters[key] !== '') ? `${key}=${filters[key]}` : null)
      .filter(param => param)
      .join('&');
    return this.http.get<{ invoices: any[] }>(`${this.url}/invoices?${params}`);
  }

  public getInvoice(id): Observable<any> {
    return this.http.get(`${this.url}/invoices/${id}`);
  }

  public getUsage(filters: object): Observable<any[]> {
    const params = Object.keys(filters)
      .map(key => (filters[key] !== '') ? `${key}=${encodeURIComponent(filters[key])}` : null)
      .filter(param => param)
      .join('&');
    return this.http.get<any[]>(`${this.url}/usage?${params}`);
  }

  public getBills(filters: object): Observable<any[]> {
    const params = Object.keys(filters)
      .map(key => (filters[key] !== '') ? `${key}=${encodeURIComponent(filters[key])}` : null)
      .filter(param => param)
      .join('&');
    return this.http.get<any[]>(`${this.url}/bills?${params}`);
  }

  public filterValue() {
    return this.filterValue$.asObservable();
  }

}
