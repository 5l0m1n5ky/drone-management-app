import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Leaflet from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})


export class MapComponent implements OnInit, AfterViewInit {

  map: Leaflet.Map;
  center: Leaflet.LatLngExpression = [53.122028, 18.000292];
  marker: Leaflet.Marker;

  origin = Leaflet.latLng(53.186200, 18.033310);

  ngAfterViewInit(): void {
    this.mapConfig();

    const customIcon = Leaflet.icon({
      iconUrl: 'assets/icons/map-marker.png',
      iconSize: [40, 40], // Adjust as needed
      iconAnchor: [20, 40],
    });

    this.map.on('click', (event: Leaflet.LeafletMouseEvent) => {
      const lat = event.latlng.lat;
      const lng = event.latlng.lng;
      const marker = Leaflet.marker([lat, lng],)

      if (this.marker != undefined) {
        this.map.removeLayer(this.marker);
      }

      this.marker = Leaflet.marker([lat, lng], { icon: customIcon })
        .addTo(this.map)
        .bindPopup(`Zlecenie o współrzędnych:<br>Latitude: ${lat}<br>Longitude: ${lng}`, {
          offset: Leaflet.point(0, -40)
        })
        .openPopup();

      // const markerLatLng = Leaflet.latLng(event.latlng.lat, event.latlng.lng);

      // const distance = this.map.distance(this.origin, Leaflet.latLng(lat, lng));


      const distance = this.origin.distanceTo(Leaflet.latLng(lat, lng));
      console.log((distance / 1000).toFixed(1));


      // this.calculateDistance();
    });
  }


  ngOnInit(): void {

  }

  calculateDistance() {
    // const control = Leaflet.Routing.control({
    //   waypoints: [this.origin, this.marker.getLatLng()],
    //   routeWhileDragging: true,
    // });

    // // Listen for the 'routesfound' event to get the distance of the route
    // control.on('routesfound', function(event) {
    //   // The distance is in meters, we need to convert it to kilometers
    //   const distanceInMeters = event.routes[0].summary.totalDistance;
    //   const distanceInKm = (distanceInMeters / 1000).toFixed(2); // Convert to kilometers with two decimal places

    //   console.log(`The distance between the points is: ${distanceInKm} km`);
    // });

    // const distance = Leaflet.latLng(this.origin).distanceTo()
  }


  mapConfig() {
    this.map = Leaflet.map('map', {
      center: this.center,
      zoom: 19,

    });

    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 1,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // this.map.on('click', this.onMapClick)
  }

  // onMapClick(event: Leaflet.LeafletMouseEvent) {
  //   console.log(event.latlng.lat, event.latlng.lat);
  //   const marker = Leaflet.marker([event.latlng.lat, event.latlng.lat]);
  //   marker
  //     .addTo(this.map)
  //     .bindPopup(`You clicked at:<br>Latitude: ${event.latlng.lat} 54<br>Longitude: ${event.latlng.lng}`)
  //     .openPopup();
  // }
}
