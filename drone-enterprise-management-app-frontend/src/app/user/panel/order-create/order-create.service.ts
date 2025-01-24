import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { OrderData } from "../models/order-data.model";

interface PlaceOrderResponse {
  data: string,
  message: string
}

interface OrderDates {
  date: String
}

@Injectable({ providedIn: 'root' })

export class OrderCreateService {

  private domain: string | undefined;

  constructor(private http: HttpClient) {
    this.domain = environment.ApiDomain;
  }

  fetchOrderDates() {
    return this.http.get<{ [date: string]: OrderDates }>(`${this.domain}/api/dates`).pipe(map(responseData => {
      const datesArray: OrderDates[] = [];
      for (const date in responseData) {
        if (responseData.hasOwnProperty(date)) {
          datesArray.push({ ...responseData[date] });
        }
      }
      return datesArray;
    })
    );
  }

  placeOrder(orderData: OrderData) {
    return this.http.post<PlaceOrderResponse>(`${this.domain}/api/orders`,
      // formData,
      orderData,
      {
        withCredentials: true,
        reportProgress: true
      }
    ).pipe(catchError(this.handleError),
      tap(response => {
        return response.message;
      }
      ));
  }

  geocoding(geocodingAddress: String) {
    return this.http.get<any>(`https://nominatim.openstreetmap.org/search?q=${geocodingAddress}&format=json`,
    ).pipe(
      catchError(this.handleError),
      tap(response => {
        return response[0];
      }
      ));
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
