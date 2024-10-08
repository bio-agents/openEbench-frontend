import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {debounceTime, distinctUntilChanged, map, tap, switchMap, catchError} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import * as $ from 'jquery';

@Injectable()
export class ElasticsearchService {

  public ES_URL = environment.ES_URL;
  public  PARAMS = new HttpParams({});

  constructor(private http: HttpClient) {}

  /**
   * Serch function
   */
  search(term: string) {
    if (term === '') {
      return of([]);
    }

    return this.http
      .get(this.ES_URL, {params: this.PARAMS.set('text', term)}).pipe(
        map(response =>
          $.map(response['hits'].hits, function(agent) {
            const t = [];
            t.push(agent['_source'].name);
            return t;
          }
        )
      ));
  }
}
