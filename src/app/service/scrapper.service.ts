import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScrapperService {
  public prefix: string = 'http://localhost:3000';

  public API_URL: string = `${this.prefix}/scrap`;
  public API_SCRAP_COLORS: string = `${this.prefix}/colors`;

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(`Something went wrong: ${error.message}`);
  }

  scrape(url: string): Observable<any> {
    var reqBody = {
      url: url,
    };
    return this.http
      .post<any>(this.API_URL, reqBody)
      .pipe(catchError(this.handleError));
  }

  scrapeColors(file: File): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const formData = new FormData();
      formData.append('image', file);

      this.http.post<any>(this.API_SCRAP_COLORS, formData).subscribe({
        next: (response) => {
          resolve(response.colors);
        },
        error: (error) => {
          catchError(this.handleError);
          reject(error);
        },
      });
    });
  }
}
