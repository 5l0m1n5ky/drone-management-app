import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { Service } from "./service.model";
import { Subservice } from "./subservice.model";
import { BackgroundMusic } from "./background-music.model";
import { State } from "./state.model";

@Injectable({ providedIn: 'root' })

export class OrderCreateService {

  constructor(private http: HttpClient) { }

  reverseGeocoding(latLng: string) {
    const apiKey = environment.googleMapsApiKey;
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latLng + '&key=' + apiKey + '&language=pl&result_type=street_address'
    return this.http.get<any>(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }).pipe(catchError(this.handleError),
      tap(responseData => {
        this.handleRevesrseGeocodingResponse(responseData);
      }
      ));
  }

  fetchServices() {
    return this.http.get<{ [post: string]: Service }>('http://localhost:8000/api/services').pipe(map(responseData => {
      const servicesArray: Service[] = [];
      for (const service in responseData) {
        if (responseData.hasOwnProperty(service)) {
          servicesArray.push({ ...responseData[service] });
        }
      }
      return servicesArray;
    })
    );
  }

  fetchSubervices() {
    return this.http.get<{ [post: string]: Subservice }>('http://localhost:8000/api/subservices').pipe(map(responseData => {
      const subservicesArray: Subservice[] = [];
      for (const subservice in responseData) {
        if (responseData.hasOwnProperty(subservice)) {
          subservicesArray.push({ ...responseData[subservice] });
        }
      }
      return subservicesArray;
    })
    );
  }

  fetchBackgroundMusicTypes() {
    return this.http.get<{ [post: string]: BackgroundMusic }>('http://localhost:8000/api/background-music').pipe(map(responseData => {
      const backgroundMusicArray: BackgroundMusic[] = [];
      for (const musicType in responseData) {
        if (responseData.hasOwnProperty(musicType)) {
          backgroundMusicArray.push({ ...responseData[musicType] });
        }
      }
      return backgroundMusicArray;
    })
    );
  }

  fetchStates() {
    return this.http.get<{ [post: string]: State }>('http://localhost:8000/api/states').pipe(map(responseData => {
      const statesArray: State[] = [];
      for (const state in responseData) {
        if (responseData.hasOwnProperty(state)) {
          statesArray.push({ ...responseData[state] });
        }
      }
      return statesArray;
    })
    );
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'Wystapił błąd. Spróbuj ponownie';
    if (!errorResponse || !errorResponse.error) {
      return throwError(errorMessage);
    }
    switch (errorResponse.error.message) {
      case 'CREDENTIALS_MISMATCH':
        errorMessage = 'Nieprawidłowe dane logowania'
    };
    return throwError(errorMessage);
  }

  private handleRevesrseGeocodingResponse(responseData: string) {
    console.log(responseData);
  }
}
