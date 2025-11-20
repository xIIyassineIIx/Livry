import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import * as polyline from '@mapbox/polyline';
import { RouterModule } from '@angular/router';
import { User } from '../../models/user';
@Component({
  selector: 'app-mypackage',
  standalone: true,
  imports: [FormsModule,RouterModule],
  templateUrl: './mypackage.component.html',
  styleUrl: './mypackage.component.css'
})
export class MypackageComponent implements AfterViewInit {
  client: User = new User(0,'','','','','CLIENT');

    start = '10.1815,36.8065';
    end = '10.1955,36.8625';

  private map!: L.Map;
  private routePolyline?: L.Polyline;
  private startMarker?: L.Marker;
  private endMarker?: L.Marker;

  ngAfterViewInit(): void {
    this.initMap();
    this.updateRoute();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [36.8065, 10.1815],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  async updateRoute() {
    const startCoords = this.start.trim();
    const endCoords = this.end.trim();
    if (!startCoords || !endCoords) return;

    const url = `https://router.project-osrm.org/route/v1/driving/${startCoords};${endCoords}?overview=full&geometries=polyline`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.code !== 'Ok') {
        alert('Routing error: ' + (data.message || 'unknown'));
        return;
      }

      const route = data.routes[0].geometry;
      const decoded = polyline.decode(route).map(([lat, lon]) => [lat, lon] as [number, number]);

      if (this.routePolyline) this.map.removeLayer(this.routePolyline);

      this.routePolyline = L.polyline(decoded as L.LatLngExpression[], { color: 'blue', weight: 5 }).addTo(this.map);
      this.map.fitBounds(this.routePolyline.getBounds());

      if (this.startMarker) this.map.removeLayer(this.startMarker);
      if (this.endMarker) this.map.removeLayer(this.endMarker);

      const [lon1, lat1] = startCoords.split(',').map(Number);
      const [lon2, lat2] = endCoords.split(',').map(Number);

      this.startMarker = L.marker([lat1, lon1]).addTo(this.map).bindPopup('Start').openPopup();
      this.endMarker = L.marker([lat2, lon2]).addTo(this.map).bindPopup('Destination').openPopup();

    } catch (err) {
      console.error(err);
      alert('Error fetching route');
    }
  }


onClick() {
  
  console.log(JSON.stringify(this.client));
}
}
