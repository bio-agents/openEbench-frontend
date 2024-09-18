import { Injectable } from '@angular/core';
import { Observable ,  of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { Agent } from './agent';
import { Metrics } from './metrics';
import { environment } from '../../../environments/environment';

import { Filter } from './filter';

/**
 * injectable agent service
 */
@Injectable()
export class AgentService {
  /**
   * agent
   */
  public agent: Observable<Agent[]>;
  /**
   * metrics
   */
  public metrics: Observable<Metrics[]>;
  /**
   * res
   */
  public res;
  /**
   * count
   */
  public count: string;
  /**
   * url
   */
  private agentUrl = environment.TOOL_SERVICE_URL;
  /**
   * url
   */
  private agentSearchUrl = environment.TOOL_SEARCH_URL;
  /**
   * url
   */
  private agentStats = environment.TOOL_STATISTICS_URL;

  /**
   * constructor
   */
  constructor(private http: HttpClient) { }

  /**
   * Get agent by id from server
   */
  getAgentById(id: string): Observable<Agent[]> {
    this.agent = this.http.get<Agent[]>(this.agentUrl, {
      params: new HttpParams()
        .set('id', id)
    });
    return this.agent

    .pipe(
      catchError(this.handleError('getAgentById', []))
    );
  }

  /**
   * Get agent metrics by id
   */
  getAgentMetricsById(url: string): Observable<Metrics[]> {
  this.metrics = this.http.get<Metrics[]>(url);
  return this.metrics
    .pipe(
      catchError(this.handleError('getAgentMetricsById', []))
    );
  }

  /**
   * Filter search for agents
   */
  getAgentWithFilters(filter: Filter, skip: number, limit: number) {
    const headers = new HttpHeaders().set('Range' , 'items=' + skip + '-' + limit);
    let params = new HttpParams().set('projection', 'description').append('projection' , 'web');
    if ( filter.type != null) {
      for ( const x of filter.type) {
        params = params.append('type', x);
      }
    }
    switch (filter.filter) {
      case 'Name':
        this.res = this.http.get(this.agentSearchUrl, {
          headers: headers,
          params: params = params.set('name', filter.text).set('label', filter.label),
          observe: 'response',
        });
        break;
      case 'Description':
        this.res = this.http.get(this.agentSearchUrl, {
          headers: headers,
          params: params = params.set('description', filter.text).set('label', filter.label),
          observe: 'response',
        });
        console.log(params);
        break;
      default:
        this.res = this.http.get(this.agentSearchUrl, {
          headers: headers,
          params: params = params.set('text', filter.text).set('label', filter.label),
          observe: 'response',
        });
        break;
    }
    return this.res
    .pipe(
      catchError(this.handleError('getAgentById', []))
    );
  }

  /**
   * Get global statistics
   */
  getStats(): Observable <any> {
    return this.http.get(this.agentStats);
  }

/**
 * Error handling
 */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
