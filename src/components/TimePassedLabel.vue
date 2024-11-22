<script setup lang='ts' >
import { Note } from 'src/models';
import { computed } from 'vue';

const {note} = defineProps({
    note : Note
})

const getTimePassed = computed(()=> {
    const ms = new Date().getTime() - new Date(note!.dateCreated).getTime()

    let data:{unit:string, value:number};

    switch (true) {
        case ms < 1000: // Less than 1 second
            data = { unit: 'milliseconds', value: ms };
            break
        case ms < 1000 * 60: // Less than 1 minute
            data = { unit: 'seconds', value: Math.floor(ms / 1000) };
            break
        case ms < 1000 * 60 * 60: // Less than 1 hour
            data = { unit: 'minutes', value: Math.floor(ms / (1000 * 60)) };
            break
        case ms < 1000 * 60 * 60 * 24: // Less than 1 day
            data = { unit: 'hours', value: Math.floor(ms / (1000 * 60 * 60)) };
            break
        default: // 1 day or more
            data = { unit: 'days', value: Math.floor(ms / (1000 * 60 * 60 * 24)) };
    }
    return `Created ${data.value} ${data.unit} ago`
})

</script>

<template>
<q-item-label caption>{{ getTimePassed }}</q-item-label>
</template>
