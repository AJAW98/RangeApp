import { reactive } from 'vue';
import { defineNuxtPlugin } from 'nuxt/app';
import {ref} from "vue/dist/vue";

export default defineNuxtPlugin(nuxtApp => {
    const plugin = reactive({
        batteryAtDesination: null,
        roundtripBattery: null,
        voltageChoices: [
            32, 48, 60, 72
        ],
        ridingStyles: [
            {
                name: 'Efficient',
                whPenalty: 0
            },
            {
                name: 'Moderate',
                whPenalty: 10
            },
            {
                name: 'Speeding',
                whPenalty: 25
            }
        ],
        vehicle: {
            batteryPercentage: 100,
            voltage: null,
            capacityAh: null,
            nominalPowerWatts: null,
            massKg: null,
            efficiencyWhKm: 20,
            ridingStyle: {
                name: 'Efficient',
                whPenalty: 0
            },
        },
        calculateRideDetails() {
            if (this.vehicle.voltage && this.vehicle.capacityAh) {
                const route = nuxtApp.$leaflet.route._selectedRoute;
                const distance = route.summary.totalDistance; // distance in meters
                const totalBatteryCapacityWh = this.vehicle.voltage * this.vehicle.capacityAh; // total battery capacity in watt-hours

                // Calculate the initial available energy based on the current battery percentage
                const initialAvailableEnergyWh = (this.vehicle.batteryPercentage / 100) * totalBatteryCapacityWh;

                const adjustedEfficiencyWhKm = this.vehicle.efficiencyWhKm + this.vehicle.ridingStyle.whPenalty;
                const totalEnergyConsumedWh = (distance / 1000) * adjustedEfficiencyWhKm; // convert distance to km and calculate energy consumed

                // Calculate remaining energy after the ride
                const remainingEnergyWh = initialAvailableEnergyWh - totalEnergyConsumedWh;
                const remainingBatteryPercentage = (remainingEnergyWh / totalBatteryCapacityWh) * 100;

                this.batteryAtDesination = remainingBatteryPercentage;

                // Check for negative remaining energy which implies battery depletion before destination
                if (remainingBatteryPercentage < 0) {
                    console.error("Battery will be depleted before reaching the destination.");
                }
            } else {
                this.batteryAtDesination = null;
                this.roundtripBattery = null;
            }
        }
    });

    // Provide the leaflet object globally
    nuxtApp.vueApp.$vehicle = plugin;
    return {
        provide: {
            vehicle: plugin
        }
    };
});
