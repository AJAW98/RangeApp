<template>
  <div class="w-screen h-screen fixed bg-white p-3">
    <div class="flex gap-3 align-items-center">
      <i class="pi pi-arrow-left cursor-pointer" @click="cancel"/>
      <InputText v-model="waypoint.display_name" class="flex-grow-1" :placeholder="$leaflet.getPlaceholder($leaflet.currentWaypointIndex)"
                 @update:model-value="$leaflet.lookupAddress(waypoint)"/>
    </div>
    <div v-for="address in $leaflet.addresses" class="pb-3 pt-3 border-bottom-1 border-100 cursor-pointer"
         @click="chooseAddress(address)">
      <span>{{ address.display_name }}</span>
    </div>
  </div>
</template>
<script setup>

import {useNuxtApp} from "#app";

const nuxtApp = useNuxtApp();

function chooseAddress(address) {
  nuxtApp.$leaflet.chooseAddress(address);
  nuxtApp.$leaflet.currentWaypointIndex = null;
  nuxtApp.$leaflet.addresses = [];
}

function cancel() {
  nuxtApp.$leaflet.waypoints[nuxtApp.$leaflet.currentWaypointIndex].display_name = null;
  nuxtApp.$leaflet.addresses = [];
}

const waypoint = computed(() => {
  return nuxtApp.$leaflet.waypoints[nuxtApp.$leaflet.currentWaypointIndex];
})

</script>