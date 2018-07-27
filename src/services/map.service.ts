import { Injectable } from "@angular/core";

@Injectable()
export class MapService {
    private rad(x) { return x * Math.PI / 180; }
    public findClosestMarker(position, gmarkers) {
        let lat = position.lat;
        let lng = position.lng;
        let R = 6371; // radius of earth in km
        let distances = [];
        let closest = -1;
        for (let i = 0; i < gmarkers.length; i++) {
            if (gmarkers[i]) {
                let mlat = gmarkers[i].geometry.location.lat();
                let mlng = gmarkers[i].geometry.location.lng();
                let dLat = this.rad(mlat - lat);
                let dLong = this.rad(mlng - lng);
                let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(this.rad(lat)) * Math.cos(this.rad(lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
                let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                let d = R * c;
                distances[i] = d;
                if (closest == -1 || d < distances[closest]) {
                    closest = i;

                }
            }
        }

        return (gmarkers[closest]);

    }

} 