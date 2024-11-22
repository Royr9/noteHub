<script setup lang='ts' >
import { progressColors } from 'src/models';
import { computed } from 'vue';

const noteProgress = defineModel();

const color = computed(()=>{
    return progressColors[noteProgress.value as 0 | 25 | 50 | 75 | 100]
});

</script>

<template>
    <q-knob  :min="0" :max="100" :step="25"
        v-model="(noteProgress as number)" show-value size="75px" :thickness="0.22" :color="color"
        track-color="grey-3" class="q-ma-sm q-pa-sm text-subtitle1">
        {{ noteProgress }}
        <q-badge style=" z-index: 19;" rounded color="negative" floating @click="noteProgress = undefined">
            <q-icon name="close" />
        </q-badge>
    </q-knob>
</template>

<style scoped lang='scss'></style>