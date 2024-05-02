<template>
  <Dialog v-model:visible="model" modal header="Edit Vehicle Information" class="w-30rem">
    <span class="p-text-secondary block mb-5">Update your information to calculate your range.</span>
    <div class="flex align-items-center justify-content-between gap-1 mb-3">
      <label for="username" class="font-semibold">Battery Voltage</label>
      <Dropdown v-model="$vehicle.vehicle.voltage" :options="$vehicle.voltageChoices" placeholder="Select your battery voltage"/>
    </div>
    <div class="flex align-items-center justify-content-between gap-1 mb-3">
      <label for="username" class="font-semibold">Battery Capacity (Ah)</label>
      <InputNumber v-model="$vehicle.vehicle.capacityAh" inputId="integeronly" suffix="Ah"/>
    </div>
    <div class="flex align-items-center justify-content-between gap-1 mb-3">
      <label for="username" class="font-semibold">Peak Motor Power (Watts)</label>
      <InputNumber v-model="$vehicle.vehicle.nominalPowerWatts" inputId="integeronly"/>
    </div>
    <div class="flex align-items-center justify-content-between gap-1 mb-3">
      <label for="username" class="font-semibold">Vehicle Weight (kg)</label>
      <InputNumber v-model="$vehicle.vehicle.massKg" inputId="integeronly" suffix="kg"/>
    </div>
    <div class="flex align-items-center justify-content-between gap-1 mb-3">
      <label for="username" class="font-semibold">Rider Weight (kg)</label>
      <InputNumber v-model="riderMassKg" inputId="integeronly" suffix="kg"/>
    </div>
    <Panel header="Advanced Settings" toggleable :collapsed="true">
      <div class="flex align-items-center justify-content-between gap-1 mb-3">
        <label for="username" class="font-semibold">Efficiency</label>
        <InputNumber v-model="$vehicle.vehicle.efficiencyWhKm" inputId="integeronly" suffix="wh/km"/>
      </div>
      <div class="flex align-items-center justify-content-between gap-1 mb-3">
        <label for="username" class="font-semibold">Temperature</label>
        <InputNumber v-model="temperatureCelsius" inputId="integeronly" suffix="c"/>
      </div>
    </Panel>
    <div class="flex justify-content-end gap-2 mt-4">
      <Button type="button" label="Close" @click="emit('close')"></Button>
    </div>
  </Dialog>
</template>
<script setup>
  const model = defineModel();
  const riderMassKg = ref(80);
  const temperatureCelsius = ref(25);
  const emit = defineEmits(['close']);
</script>