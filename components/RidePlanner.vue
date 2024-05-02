<template>
  <div class="card fixed bg-white z-5 w-screen p-3 ">
    <div class="flex justify-content-between">
      <h3 class="mt-0">Plan Ride</h3>
      <i class="pi pi-times cursor-pointer" @click="emit('close')"></i>
    </div>
    <div>
      <div v-for="(waypoint, index) in $leaflet.waypoints" :key="index">
        <InputGroup class="mb-2">
          <InputGroupAddon>
            {{ $leaflet.alphabet[index] }}
          </InputGroupAddon>
          <InputText v-model="$leaflet.waypoints[index].display_name":placeholder="$leaflet.getPlaceholder(index)"
                     @update:model-value="$leaflet.lookupAddress(waypoint)"/>
          <InputGroupAddon>
            <i class="pi pi-map-marker cursor-pointer" v-tooltip.left="'Use current location'" @click="setCurrentLocation(waypoint)"></i>
          </InputGroupAddon>
          <InputGroupAddon v-if="$leaflet.waypoints.length > 2">
            <i class="pi pi-times cursor-pointer" v-tooltip.left="'Delete waypoint'" @click="deleteWaypoint(index)"></i>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <Button severity="secondary" size="small" @click="$leaflet.waypoints.push({ display_name: ''})">Add Stop</Button>
      <h4>Vehicle Details</h4>
      <div class="flex gap-3 flex-wrap">
        <div class="flex flex-column justify-content-between gap-1 mb-3 flex-grow-1">
          <label class="font-semibold text-sm">Battery Voltage</label>
          <Dropdown v-model="$vehicle.vehicle.voltage" :options="$vehicle.voltageChoices" placeholder="Select your battery voltage"/>
        </div>
        <div class="flex flex-column justify-content-between gap-1 mb-3 flex-grow-1">
          <label class="font-semibold text-sm">Battery Capacity (Ah)</label>
          <InputNumber v-model="$vehicle.vehicle.capacityAh" inputId="integeronly" suffix="Ah"/>
        </div>
      </div>
      <div class="flex flex-column justify-content-between gap-1 mb-3 flex-grow-1">
        <label class="font-semibold text-sm">Current Battery Level ({{ $vehicle.vehicle.batteryPercentage }}%)</label>
        <Slider v-model="$vehicle.vehicle.batteryPercentage" class="mt-2"/>
      </div>
      <h4>Riding Style</h4>
      <div class="flex gap-3">
        <div class="flex flex-column justify-content-between gap-1 mb-3 flex-grow-1">
          <label class="font-semibold text-sm">Riding Style</label>
          <Dropdown v-model="$vehicle.vehicle.ridingStyle" :options="$vehicle.ridingStyles" option-label="name" placeholder="Select your riding style"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>

const nuxtApp = useNuxtApp();
const emit = defineEmits(['close']);

function setCurrentLocation(waypoint) {
  let selected = nuxtApp.$leaflet.waypoints.find(w => w === waypoint)
  selected.lat =  nuxtApp.$leaflet.userLocation.coords[0];
  selected.lon =  nuxtApp.$leaflet.userLocation.coords[1];
  selected.display_name = nuxtApp.$leaflet.userLocation.coords;
  nuxtApp.$leaflet.updateRoute();
}

function deleteWaypoint(index) {
  console.log(`deleting ${index}`)
  nuxtApp.$leaflet.waypoints.splice(index, 1);
  nuxtApp.$leaflet.updateRoute();
}

</script>