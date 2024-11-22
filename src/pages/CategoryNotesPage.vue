<script setup lang='ts' >
import TimePassedLabel from 'src/components/TimePassedLabel.vue';
import { Category, Note, getCategoryByName, getCategoryNotes, progressColors } from 'src/models';
import { ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
let category = {} as Category;

if (route.fullPath === "/notes") {
    category = new Category()
    category.name = "All Notes"
} else {
    let thisCategory = getCategoryByName(route.params.categoryName as string)
    if (!thisCategory) {
        router.push({ name: "Error" })
    } else {
        category = thisCategory
    }

    // add watcher to make sure category name is not empty(for routing)
    watch(category, (newVal) => {
        if (newVal.name === "") {
            category.name = `Category${category.id}`
        }
    })
}

// if no notes redirect to new note page to create new note:
if (!getCategoryNotes(category.name!).length) {
    const newNote = Note.create({});
    if (category.name !== "All Notes") {
        newNote.categories.push(category.id!);
    }
    router.push(`/notes/${newNote.id}`)
}

const searchFilter = ref("")

function renderBodyTeaser(text: string) {
    if (text === "") {
        return text
    }
    const moreTextDots = text.split(" ").length > 5 ? " ....." : ""
    return text.split(" ").slice(0, 5).join(" ") + moreTextDots
}

// Reactively adjust notes based on category and filter 
let notes = computed(() => {
    const allCategoryNotes = getCategoryNotes(category.name!)
    // if no notes redirect to new note page to create new note:
 
    if (searchFilter.value) {
        return allCategoryNotes.filter((note) => {
            return searchFilter.value.toLowerCase() === note.title.toLowerCase()
        })
    }
    return allCategoryNotes
})
</script>

<template>
    <q-page>
        <q-input autofocus v-if="category.name !== 'All Notes'" v-model="category.name" class="text-h4" type="text" borderless />
        <h4 v-else>{{ category.name }}</h4>

        <!-- search note -->
        <q-input  class="q-my-lg"
         standout bottom-slots v-model="searchFilter" 
         label="Search" hint="Search by note title"
         bg-color="secondary"
            counter maxlength="30" dense>
            <template v-slot:append>
                <q-icon name="search" />
            </template>
        </q-input>

        <!-- category notes -->
        <q-list bordered dark>
            <div v-for="note in notes" :key="note.id">
                <q-item clickable v-ripple :to="`/notes/${note.id}`">
                    <q-item-section>
                        <q-item-label :class="`text-${progressColors[note.progress ?? '0']}`">{{ note.title }}</q-item-label>
                        <q-item-label caption lines="1">{{ renderBodyTeaser(note.body!) }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <time-passed-label :note="note" />
                    </q-item-section>
                </q-item>
                <q-separator inset v-if="note.id !== notes[notes.length - 1].id" />
            </div>
        </q-list>

    </q-page>
</template>

<style scoped lang='scss'>
.q-input{
    color: white !important;
}

</style>