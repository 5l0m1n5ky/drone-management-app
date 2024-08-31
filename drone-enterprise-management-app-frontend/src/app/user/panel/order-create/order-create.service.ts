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

  constructor(private http: HttpClient) { }

  // future feature
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

  fetchOrderDates() {
    return this.http.get<{ [date: string]: OrderDates }>('http://localhost:8000/api/dates').pipe(map(responseData => {
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
    return this.http.post<PlaceOrderResponse>('http://localhost:8000/orders/create',
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
