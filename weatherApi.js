import { LightningElement, track, wire } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import performCallout from '@salesforce/apex/WebServiceLWC.performCallout';
import weather from '@salesforce/resourceUrl/weather';
 
export default class WeatherDataLWC extends LightningElement {
 
    @track lat;
    @track long;
 
    @track mapMarkers = [];
    zoomLevel = 10;
    @track result;
    @track value;
 
    connectedCallback() {
        performCallout({location: 'Denver,CO'}).then(data => {
            this.mapMarkers = [{
                location: {
                    Latitude: data['cityLat'],
                    Longitude: data['cityLong']
                },
                title: data['cityName'] + ', ' + data['state'],
            }];
            this.result = data;
        }).catch(err => console.log(err));
        loadStyle(this, weather).then(result => {
            console.log('what is the result?' , result);
        });
    }
 
    get getCityName() {
        if (this.result) {
            return this.result.cityName + ' Information';
        } else {
            return '---'
        }
    }
 
    get getConvertedTemp() {
        if (this.result) {
            return Math.round((this.result.cityTemp * (9/5)) + 32) + ' deg';
        } else {
            return '--'
        }
    }
 
    get getCurrentWindSpeed() {
        if (this.result) {
            return this.result.cityWindSpeed + ' mph';
        } else {
            return '--'
        }
    }
 
    get getCurrentPrecip() {
        if (this.result) {
            return this.result.cityPrecip + " inches"
        } else {
            return '--'
        }
    }
 
    get options() {
        return [
            { label: 'San Diego, CA', value: 'San Diego,CA' },
            { label: 'Philadelphia, PA', value: 'Philadelphia,PA' },
            { label: 'Arvada, CO', value: 'Arvada,CO' },
            { label: 'Austin, TX', value: 'Austin,TX' },
            { label: 'Sacramento, CA', value: 'Sacramento,CA' },
            { label: 'Raleigh, NC', value: 'Raleigh,NC' }
        ];
    }
 
    handleChange(event) {
        this.value = event.detail.value;
        performCallout({location: this.value}).then(data => {
            this.mapMarkers = [{
                location: {
                    Latitude: data['cityLat'],
                    Longitude: data['cityLong']
                },
                title: data['cityName'] + ', ' + data['state'],
            }];
            this.result = data;
        }).catch(err => console.log(err));
    }
}