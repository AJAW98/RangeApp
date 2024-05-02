<template>
<!--  <pre class="max-h-20rem overflow-auto">{{$leaflet.waypoints}}</pre>-->
  <AddressPicker v-if="$leaflet.addresses.length"/>
  <div v-else>
    <RidePlanner v-if="showRidePlanner" @close="showRidePlanner = false"/>
    <div class="w-screen h-screen absolute z-0 flex flex-column">
      <div class="p-3">
        <i class="pi pi-cog cursor-pointer" @click="showVehicleCustomize = true"></i>
      </div>
      <div ref="mapContainer" class="bg-blue-100 h-full">
      </div>
    </div>
    <div class="fixed bottom-0 z-1 flex justify-content-center w-screen mb-4">
      <Button v-if="!showRidePlanner" type="button" icon="pi pi-plus" label="Plan Ride" @click="showRidePlanner = true"/>
    </div>
    <VehicleDetails v-model:visible="showVehicleCustomize" @close="showVehicleCustomize = false"/>
    <RideDetails/>
  </div>


</template>

<script setup>

import {ref} from 'vue';
import {useNuxtApp} from 'nuxt/app';
import VehicleDetails from "~/components/VehicleDetails.vue";
import RidePlanner from "~/components/RidePlanner.vue";
import RideDetails from "~/components/RideDetails.vue";
import AddressPicker from "~/components/AddressPicker.vue";

const nuxtApp = useNuxtApp();

const mapContainer = ref(null);
const showVehicleCustomize = ref(false);
const showRidePlanner = ref(false);

onMounted(async () => {
  // Ensure the DOM element is available
  if (mapContainer.value) {
    await nuxtApp.$leaflet.createMap(mapContainer.value);
  }
});






</script>