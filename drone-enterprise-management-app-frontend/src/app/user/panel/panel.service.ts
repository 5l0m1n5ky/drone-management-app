import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, tap, throwError } from "rxjs";
import { Service } from "./models/service.model";
import { Subservice } from "./models/subservice.model";
import { BgMusic } from "./models/bg-music.model";
import { State } from "./models/state.model";
import { OrderItem } from "./models/order-item.model";
import { Notification } from "./models/notification.model";
import { Checklist } from "./models/checklist.model";
import { NgForm } from "@angular/forms";
import { environment } from "src/environments/environment";
import { User } from "../user.model";
import { UserData } from "./models/user-data.model";

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

  private domain: string | undefined;

  constructor(private http: HttpClient) {
    this.domain = environment.ApiDomain;
  }

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
    return this.http.get<{ [service: string]: Service }>(`${this.domain}/api/services`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }),
      withCredentials: true
    }).pipe(map(responseData => {
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
    return this.http.get<{ [subservice: string]: Subservice }>(`${this.domain}/api/subservices`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }),
      withCredentials: true
    }).pipe(map(responseData => {
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
    return this.http.get<{ [bgMusc: string]: BgMusic }>(`${this.domain}/api/background-music`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }),
      withCredentials: true
    }).pipe(map(responseData => {
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
    return this.http.get<{ [state: string]: State }>(`${this.domain}/api/states`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }),
      withCredentials: true
    }).pipe(map(responseData => {
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

  fetchChecklist(orderId: Number) {
    return this.http.get<{ [checklistItem: string]: Checklist }>(`${this.domain}/api/orders/checklist/${orderId}`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }),
      withCredentials: true
    }).pipe(map(responseData => {
      const checklistArray: Checklist[] = [];
      for (const checklistItem in responseData) {
        if (responseData.hasOwnProperty(checklistItem)) {
          checklistArray.push({ ...responseData[checklistItem] });
        }
      }
      return checklistArray;
    })
    );
  }

  updateChecklist(checklist: NgForm, orderId: Number) {
    console.log(checklist.value);

    const updatedChecklist = Object.fromEntries(
      Object.entries(checklist.value).map(([key, value]) => {
        return [key, value === "" ? false : value];
      })
    );

    return this.http.put<ResponseData>(`${this.domain}/api/orders/checklist/${orderId}`, updatedChecklist,
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

  fetchNotifications() {
    return this.http.get<{ [notification: string]: Notification }>(`${this.domain}/api/notifications`, {
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
    return this.http.put<ResponseData>(`${this.domain}/api/notifications`, { notificationId: notificationId },
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
    return this.http.get<{ [order: string]: OrderItem }>(`${this.domain}/api/orders`,
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

    return this.http.put<ResponseData>(`${this.domain}/api/orders`,
      // formData,
      {
        orderId: orderId,
        stateId: stateId,
        comment: comment
      },
      {
        withCredentials: true
      }
    ).pipe(catchError(this.handleError),
      tap(response => {
        return response;
      }
      ));
  }

  uploadInspectionReport(orderId: Number, reportFile: Blob, fileName: string) {
    const formData = new FormData;
    formData.append('orderId', orderId.toString());
    formData.append('reportFile', reportFile, fileName);

    return this.http.post<ResponseData>(`${this.domain}/api/orders/inspection-file`,
      formData,
      {
        withCredentials: true
      }
    ).pipe(catchError(this.handleError),
      tap(response => {
        return response;
      }
      ));
  }

  downloadInspectionReport(orderId: Number) {
    return this.http.get(`${this.domain}/api/orders/inspection-file/${orderId}`,
      {
        responseType: 'blob',
        withCredentials: true
      }
    ).pipe(catchError(this.handleError),
      tap(response => {
        return response;
      }
      ));
  }

  fetchUsers() {
    return this.http.get<{ [user: string]: UserData }>(`${this.domain}/api/users`,
      {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }),
        withCredentials: true
      }
    ).pipe(catchError(this.handleError), map(responseData => {
      const usersData: UserData[] = [];
      for (const user in responseData) {
        if (responseData.hasOwnProperty(user)) {
          usersData.push({ ...responseData[user] });
        }
      }
      return usersData;
    })
    );
  }

  updateUserSuspension(userId: number) {

    return this.http.patch<ResponseData>(`${this.domain}/api/users`,
      {
        id: userId,
      },
      {
        withCredentials: true
      }
    ).pipe(catchError(this.handleError),
      tap(response => {
        return response;
      }
      ));
  }

  private handleError(errorResponse: HttpErrorResponse) {

    let errorMessage = 'Wystapił błąd';

    if (errorResponse.error) {
      errorMessage = errorResponse.error.message;
    }

    return throwError(errorMessage);
  }


}
