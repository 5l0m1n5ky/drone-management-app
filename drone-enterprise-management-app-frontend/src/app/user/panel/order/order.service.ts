import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, tap, throwError } from "rxjs";

import { Service } from '../models/service.model';
import { Subservice } from "../models/subservice.model";
import { BgMusic } from "../models/bg-music.model";
import { State } from "../models/state.model";

@Injectable({ providedIn: 'root' })

export class OrderCreateService {

  constructor(private http: HttpClient) { }

  fetchOrdersWithDetials() {
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
    return this.http.get<{ [subservice: string]: Subservice }>('http://localhost:8000/api/subservices').pipe(map(responseData => {
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
    return this.http.get<{ [bgMusic: string]: BgMusic }>('http://localhost:8000/api/background-music').pipe(map(responseData => {
      const backgroundMusicArray: BgMusic[] = [];
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
    return this.http.get<{ [state: string]: State }>('http://localhost:8000/api/states').pipe(map(responseData => {
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

    let errorMessage = 'Wystapił błąd';
    if (errorResponse.error.data) {
      errorMessage = errorResponse.error.data;
    } else {
      errorMessage = errorResponse.error.message;
    }

    return throwError(errorMessage);
  }

  private handleRevesrseGeocodingResponse(responseData: string) {
    console.log(responseData);
  }


}
