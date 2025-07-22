import {HttpClient} from '@angular/common/http'
import { Injectable } from '@angular/core';
import {Observable } from 'rxjs'
import {environment} from "../../../environments/environment";
import {PageMetaComponent, PageMetaSlider} from "../interfaces/content-item.interface";
import {CardContent, IAddCardContent, ICardContent, OrderCardContent} from "../interfaces/card-content.interface";
import {map} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class ComponentListService {
  env = environment;
  URL_BASE: string;
  /**
   * Constructor
   */
  constructor(private _http: HttpClient) {

    this.URL_BASE = `${this.env.API_APP_URL}/api/v1/cards-content`;
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  getInnerResponse(response: any): any {
    return response;
  }

  add(cardId: string, payload : any):  Observable<CardContent>  {
    const url = this.URL_BASE  + `/${cardId}/card`
    console.log(`${url}`);
    return this._http
      .post<CardContent>(url, payload)
      .pipe(map(this.getInnerResponse))
  }


  findAll(cardId: string,filters: any): Observable<PageMetaComponent> {
    console.log(`${this.URL_BASE}`);
    const strFilters = this.checkParams(filters);
    return this._http
      .get<any>(
        `${this.URL_BASE}/${cardId}/card${strFilters}`
      )
  }

  updateGlobalColors(cardId: string,colors: any): Observable<PageMetaComponent> {
    console.log(`${this.URL_BASE}/${cardId}/change-color`);
    return this._http
      .post<any>(
        `${this.URL_BASE}/${cardId}/change-color`,
        colors
      )
  }


  enable(ccId: string, update: any): Observable<PageMetaComponent> {
    console.log(`${this.URL_BASE}`);
    return this._http
      .post<any>(
        `${this.URL_BASE}/${ccId}/enable`,
        update
      )
  }

  del(ccId: string): Observable<PageMetaComponent> {
    console.log(`${this.URL_BASE}`);
    return this._http
      .delete<any>(
        `${this.URL_BASE}/${ccId}`
      )
  }

  update(cardId: string, update: Partial<CardContent>): Observable<any> {
    console.log(`${this.URL_BASE}`);
    return this._http
      .put<any>(
        `${this.URL_BASE}/${cardId}/card`,
        update
      )
  }

  reorder(cardId: string, update: Partial<OrderCardContent[]>): Observable<any> {
    console.log(`${this.URL_BASE}`);
    return this._http
      .put<any>(
        `${this.URL_BASE}/${cardId}/reorder`,
        update
      )
  }


  checkParams(filters: any) {
    let strFilters = '';
    strFilters +=
      typeof filters['q'] !== 'undefined' && filters['q'] !== ''
        ? `?q=${filters.q}&`
        : '?';
    strFilters +=
      typeof filters['order'] !== 'undefined'
        ? `order=${filters.order}&`
        : 'order=ASC&';
    strFilters +=
      typeof filters['page'] !== 'undefined' && filters['page'] >= 0
        ? `page=${filters.page}&`
        : `page=1&`;
    strFilters +=
      typeof filters['take'] !== 'undefined' && filters['take'] >= 0
        ? `take=${filters.take}&`
        : `take=10`;
    return strFilters;
  }

}
