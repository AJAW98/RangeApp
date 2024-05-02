<template>
  <div v-if="$leaflet.route?._selectedRoute && $vehicle.batteryAtDesination" class="bg-white border-round p-3 fixed top-0 mt-7 right-0 m-3 flex flex-column" >
    <span class="font-semibold mb-2">Ride Details</span>
    <span>Distance: {{ Math.round($leaflet.route._selectedRoute.summary.totalDistance / 1000) }}km</span>
    <span>Battery at destination: {{ Math.round($vehicle.batteryAtDesination) }}%</span>
    <span>Roundtrip battery: {{ 'static 53%' }}</span>
  </div>
</template>

<script setup>
import {watch} from 'vue';
import {useNuxtApp} from 'nuxt/app';
const nuxtApp = useNuxtApp();

watch(() => nuxtApp.$vehicle.vehicle, recalculateRide, { deep: true })

function recalculateRide() {
  nuxtApp.$vehicle.calculateRideDetails();
}
</script>