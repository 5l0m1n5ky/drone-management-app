import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map } from "rxjs";
import { Service } from "./models/service.model";
import { Subservice } from "./models/subservice.model";
import { BgMusic } from "./models/bg-music.model";
import { State } from "./models/state.model";
import { OrderItem } from "./models/order-item.model";

interface OrderResponseData {
  order: OrderItem[],
}
@Injectable({ providedIn: 'root' })

export class PanelService {

  constructor(private http: HttpClient) { }

  private orderToShow = new BehaviorSubject<OrderItem[] | null>(null);
  orderToShowObservable$ = this.orderToShow.asObservable();


  assignOrderItem(orderItem: OrderItem[]){
    this.orderToShow.next(orderItem);
  }

  fetchServices() {
    return this.http.get<{ [service: string]: Service }>('http://localhost:8000/api/services').pipe(map(responseData => {
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
    return this.http.get<{ [bgMusc: string]: BgMusic }>('http://localhost:8000/api/background-music').pipe(map(responseData => {
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

  fetchOrders() {
    return this.http.get<{ [order: string]: OrderItem }>('http://localhost:8000/orders',
      {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }),
        withCredentials: true
      }
    ).pipe(map(responseData => {
      const ordersArray: OrderItem[] = [];
      for (const order in responseData) {
        if (responseData.hasOwnProperty(order)) {
          ordersArray.push({ ...responseData[order] });
        }
      }
      return ordersArray;
    })
    );

  }



  // private handleError(errorResponse: HttpErrorResponse) {

  //   let errorMessage = 'Wystapił błąd';
  //   if (errorResponse.error.data) {
  //     errorMessage = errorResponse.error.data;
  //   } else {
  //     errorMessage = errorResponse.error.message;
  //   }

  //   return throwError(errorMessage);
  // }

  // private handleRevesrseGeocodingResponse(responseData: string) {
  //   console.log(responseData);
  // }


}
