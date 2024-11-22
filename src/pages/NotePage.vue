<script setup lang='ts' >
import { Category, Note} from 'src/models';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar'
import MentionContacts from 'src/components/MentionContacts.vue';
import NoteProgressKnob from 'src/components/NoteProgressKnob.vue';

const route = useRoute();
const router = useRouter();
const note = Note.get(parseInt(route.params.noteId as string));
const $q = useQuasar();

const paletteColorsNames = [
    'secondary',
    'accent',
    'positive',
    'negative',
    'info',
    'warning'
];

function addCategory() {
    $q.dialog({
        title: 'Select Categories',
        message: 'Choose the matching categories for this note',
        options: {
            type: 'toggle',
            model: note.categories,
            items: Category.all().map((category) => {
                return {
                    label: category.name!, value: category.id, color:'accent'
                }
            }),
        },
        color:'warning',
        cancel: true,

    }).onOk(data => {
        note.categories = data;
    })
}

function addKnob() {
    note.progress = 0;
}

</script>

<template>
    <q-page padding>
        <q-input v-model="note.title" type="textarea" class="notebook-title text-h4" placeholder="Note Title..." borderless
            autofocus autogrow />

        <!-- some features to add to the note -->
        <div class="note-actions row">
            <div class="col-6 row ">
                <label>Categories</label>
                <div class="category-badges ">
                    <q-badge v-for="categoryId, index in note.categories" :key="index" class="q-mr-sm "
                        style="padding: 3px 8px;" outline :color="paletteColorsNames[index % paletteColorsNames.length]"
                        @click="router.push(`/${Category.get(categoryId).name}`)" :label="Category.get(categoryId).name" />
                    <q-btn @click="addCategory" icon="add" flat round size="sm" />
                </div>
            </div>

            <!-- knob component for note progress -->
            <div class="note-progress col-6 row justify-center">
                <label>Progress
                    <q-btn v-if="note.progress === undefined" @click="addKnob" icon="add" flat round size="sm" />
                </label>
                <note-progress-knob v-if="note.progress !== undefined && note.progress >= 0" v-model="note.progress" :progress="note.progress"/>

            </div>

            <MentionContacts :note-id="note.id" />

        </div>
        <q-input v-model="note.body" type="textarea" class="notebook-body" placeholder="Write your notes here..." dense
            borderless autogrow />

    </q-page>
</template>


