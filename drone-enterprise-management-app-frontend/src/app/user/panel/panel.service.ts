import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, tap, throwError } from "rxjs";
import { Service } from "./models/service.model";
import { Subservice } from "./models/subservice.model";
import { BgMusic } from "./models/bg-music.model";
import { State } from "./models/state.model";
import { OrderItem } from "./models/order-item.model";
import { Notification } from "./models/notification.model";

interface OrderResponseData {
  order: OrderItem[],
}

interface ResponseData {
  status: string,
  message: string,
  data: string
}

@Injectable({ providedIn: 'root' })

export class PanelService {

  constructor(private http: HttpClient) { }

  private orderToShow = new BehaviorSubject<OrderItem[] | null>(null);
  orderToShowObservable$ = this.orderToShow.asObservable();

  private badgeValueSubject = new BehaviorSubject<boolean>(false);
  badgeValue$ = this.badgeValueSubject.asObservable();

  updateBadgeValue() {
    this.badgeValueSubject.next(true);
  }

  assignOrderItem(orderItem: OrderItem[]) {
    this.orderToShow.next(orderItem);
  }

  fetchServices() {
    return this.http.get<{ [service: string]: Service }>('http://localhost:8000/services').pipe(map(responseData => {
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
    return this.http.get<{ [subservice: string]: Subservice }>('http://localhost:8000/subservices').pipe(map(responseData => {
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
    return this.http.get<{ [bgMusc: string]: BgMusic }>('http://localhost:8000/background-music').pipe(map(responseData => {
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
    return this.http.get<{ [state: string]: State }>('http://localhost:8000/states').pipe(map(responseData => {
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

  fetchNotifications() {
    return this.http.get<{ [notification: string]: Notification }>('http://localhost:8000/notifications', {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }),
      withCredentials: true
    }).pipe(map(responseData => {
      const notificationArray: Notification[] = [];
      for (const notification in responseData) {
        if (responseData.hasOwnProperty(notification)) {
          notificationArray.push({ ...responseData[notification] });
        }
      }
      return notificationArray;
    })
    );
  }

  updateNotificationSeenStatus(notificationId: Number) {
    return this.http.post<ResponseData>('http://localhost:8000/notifications/seen', { notificationId: notificationId },
      {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }),
        withCredentials: true
      }).pipe(catchError(this.handleError),
        tap(response => {
          return response;
        }
        ));
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
    ).pipe(catchError(this.handleError), map(responseData => {
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

  updateOrderState(orderId: Number, stateId: Number, comment: string) {
    const formData = new FormData;
    formData.append('orderId', orderId.toString());
    formData.append('stateId', stateId.toString());
    formData.append('comment', comment);

    return this.http.post<ResponseData>('http://localhost:8000/orders/state-update',
      formData,
      {
        withCredentials: true,
        reportProgress: true
      }
    ).pipe(catchError(this.handleError),
      tap(response => {
        return response;
      }
      ));
  }

  private handleError(errorResponse: HttpErrorResponse) {

    let errorMessage = 'Wystapił błąd';
    // if (errorResponse.error.data) {
    //   errorMessage = errorResponse.error.data;
    // } else {
    //   errorMessage = errorResponse.error.message;

    if (errorResponse.error) {
      errorMessage = errorResponse.error.message;
    }
    // }

    return throwError(errorMessage);
  }

  // private handleRevesrseGeocodingResponse(responseData: string) {
  //   console.log(responseData);
  // }
}
