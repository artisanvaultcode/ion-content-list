import {HttpClient} from '@angular/common/http'
import { Injectable } from '@angular/core';
import {Observable } from 'rxjs'
import {environment} from "../../../environments/environment";
import {PageMetaSlider} from "../interfaces/content-item.interface";

@Injectable({providedIn: 'root'})
export class ContentTypesService {
  env = environment;
  URL_BASE: string;
  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {

    this.URL_BASE = `${this.env.API_APP_URL}/api/v1/content-types`;
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  getInnerResponse(response: any): any {
    return response;
  }

  findAvailable(filters: any): Observable<PageMetaSlider> {
    console.log(`${this.URL_BASE}`);
    const strFilters = this.checkParams(filters);
    return this._httpClient
      .get<any>(
        `${this.URL_BASE}${strFilters}`
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
