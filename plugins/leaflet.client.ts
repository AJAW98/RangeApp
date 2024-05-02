import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { reactive } from 'vue';
import { defineNuxtPlugin } from 'nuxt/app';
import _ from "lodash";
import debounce from "lodash/debounce";

export default defineNuxtPlugin(nuxtApp => {
    const plugin = reactive({
        map: null,
        userLocation: null,
        routingControl: null,
        markers: [],
        route: null,
        geocoder: null,
        waypoints:  [{
            display_name: null
        }, {
            display_name: null
        }],
        addresses: [],
        currentWaypointIndex: null,
        alphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        async createMap(element: string | HTMLElement) {
            const options = await this.getUserLocation();

            if (!this.map) {
                this.map = L.map(element, options);
                // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                // }).addTo(this.map);

                L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox/light-v10',
                    tileSize: 512,
                    zoomOffset: -1,
                    accessToken: 'pk.eyJ1IjoiYWphdyIsImEiOiJjbHJ4a3llZzMxYmZpMnFteDNxaWJtNGc5In0.OPyk_3BdMjlo_MjDm0vnYg'
                }).addTo(this.map);

            }


            this.geocoder = L.Control.Geocoder.nominatim();

            // Adding routing
            this.route = L.Routing.control({
                show: false,
                routeWhileDragging: true,
                geocoder: this.geocoder,
                fitSelectedRoutes: true,
                waypoints: this.waypoints,
                createMarker: (i, waypoint) => {
                    return this.createDivMarker(i, waypoint.latLng);
                }
            }).addTo(this.map);

            this.route.on('waypointschanged', (e) => {
                setTimeout(() => {
                    this.waypoints = e.waypoints.map(w => ({
                        ...w,
                        display_name: w.name,
                        routed: true
                    }));
                    nuxtApp.$vehicle.calculateRideDetails();
                }, 1000)
            });

            await nuxtApp.$leaflet.getUserLocation();
            this.createUserIcon()

            return this.map;
        },
        createZone(position: L.LatLngExpression, options: L.CircleMarkerOptions) {
            if (this.map) {
                let zonePosition = position ? position : this.userLocation;
                L.circle(zonePosition, options).addTo(this.map);
            }
        },
        createDivMarker(index: Number, position: L.LatLngExpression) {
            if (this.map) {

                const letter = this.alphabet[index];
                const myCustomMarker = L.divIcon({
                    className: 'custom-map-marker',
                    html: letter,
                    iconSize: [25, 25]
                });

                return L.marker(position, {
                    icon: myCustomMarker
                })
            }
        },
        createMarker(position: L.LatLngExpression, options) {
            if (this.map) {
                return L.marker(position, options).addTo(this.map);
            }
        },
        createUserIcon() {
            this.createZone(this.userLocation.coords, {
                radius: this.userLocation.accuracy,
                opacity: 0.5
            });

            this.createZone(this.userLocation.coords, {
                radius: 50,
                stroke: false,
                fillOpacity: 1,
            });
        },
        async getUserLocation(options: Object | null = null): Promise<L.MapOptions> {
            try {
                const userLocation = await new Promise<L.LatLngTuple>((resolve, reject) => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            position => {
                                this.userLocation = {
                                    coords: [position.coords.latitude, position.coords.longitude],
                                    accuracy: position.coords.accuracy,
                                    speed: position.coords.speed
                                };
                                resolve([position.coords.latitude, position.coords.longitude]);
                            },
                            () => {
                                reject("Geolocation is not supported by this browser or user has denied access.");
                            }
                        );
                    } else {
                        reject("Geolocation is not supported by this browser.");
                    }
                });
                return {
                    center: userLocation,  // Use user location if available
                    zoom: 13,  // Default zoom level
                    ...options
                };
            } catch (error) {
                console.error('Error getting user location:', error);
                return {
                    center: [47.21322, -1.559482],  // Fallback to Nantes, France
                    zoom: 13,
                    ...options
                };
            }
        },
        lookupAddress: debounce(async (waypoint) => {
            await nuxtApp.$leaflet.enrichWaypoint(waypoint);
        }, 1000),
        enrichWaypoint(waypoint: Object) {
            return new Promise(async (resolve, reject) => {
                try {
                    this.currentWaypointIndex = this.waypoints.findIndex(w => w === waypoint);
                    const addresses = await $fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${waypoint.display_name}`);
                    if (addresses.length === 1) {
                        this.chooseAddress(addresses[0])
                    }  else if (addresses.length > 1) {
                        this.addresses = addresses;
                    }
                    resolve(addresses)
                } catch (e) {
                    reject(e);
                }
            });
        },
        getPlaceholder(index) {
            if (index === 0) return 'Choose start point';
            else if (index + 1 === this.waypoints.length) return 'Choose destination';
            else return 'Choose stop point';
        },
        updateRoute() {
            this.route.setWaypoints(this.waypoints);
        },
        chooseAddress(address) {
            this.waypoints[this.currentWaypointIndex] = {
                display_name: address.display_name,
                latLng: {
                    lat: address.lat,
                    lng: address.lon
                }
            }
            this.route.setWaypoints(this.waypoints);
        }
    });

    // Provide the leaflet object globally
    nuxtApp.vueApp.$leaflet = plugin;
    return {
        provide: {
            L,
            leaflet: plugin
        }
    };
});
