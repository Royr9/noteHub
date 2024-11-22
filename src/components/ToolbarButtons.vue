<script setup lang='ts' >
// will handle the different buttons and actions depending on the current page (see MailLayout.vue)

import { useQuasar } from 'quasar';
import { Category, Note, removeCategoryFromNotes } from 'src/models';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();


const props = defineProps({
    category: Category,
    note: Note
});


const undo = ref(false);

// note creation
function createNote() {
    const newNote = Note.create({});
    if (props.category && props.category.name !== "All Notes") {
        newNote.categories.push(props.category.id!);
    }
    router.push(`/notes/${newNote.id}`)
}

const deleteMessages = {
    note: "Are you sure you want to delete this note?",
    category: "Are you sure you want to delete this category, (the notes in it wont be deleted)"
}

interface DeleteData {
    type: 'note' | 'category',
    typeValue: Note | Category
}

function handleDelete(deleteData: DeleteData) {
    $q.dialog({
        title: 'Warning',
        message: deleteMessages[deleteData.type],
        ok: {
            push: true,
            color: 'negative'
        },
        cancel: {
            push: true,
            color: 'accent'
        }
    }).onOk(() => {
        const objectCopy = deleteData.typeValue.clone()
        deleteData.typeValue.delete();

        // remove the category from corresponding notes
        let modifiedNotes: Note[] = [];
        if (deleteData.type === 'category') {
            modifiedNotes = removeCategoryFromNotes(deleteData.typeValue.id!);
        }

        notifyDelete({ type: deleteData.type, typeValue: objectCopy }, modifiedNotes);
        if (objectCopy instanceof Note) {
            if (!objectCopy.categories.length) {
                return router.push("/");
            }
            return router.back();
        }
        return router.push("/");
    })
}


function notifyDelete(data: DeleteData, modifiedNotes?: Note[]) {
    $q.notify({
        progress: true,
        message: `${data.type.toUpperCase()} deleted`,
        actions: [
            {
                label: 'Dismiss',
                color: 'warning',
            },
            {
                label: 'Undo',
                color: 'positive',
                handler: () => {
                    undo.value = true;
                }
            }
        ],
        timeout: 3000,
        onDismiss() {
            if (undo.value) {
                if (data.typeValue instanceof Note) {
                    Note.create(data.typeValue)
                } else {
                    Category.create(data.typeValue);
                    // restore relation for notes associated with category 
                    modifiedNotes?.forEach((note) => {
                        note.categories.push(data.typeValue.id!)
                        console.log(note.categories);

                    })
                }
                $q.notify({
                    message: `${data.type.toUpperCase()} Restored!`
                })
            }
            undo.value = false;
        },
    });

}

</script>

<template>
    <q-btn-group v-if="(route.name as string) !== 'Note'" class=" no-box-shadow q-gutter-x-none">
        <!-- add note in category mode -->
        <q-btn style="padding: 0;" v-if="route.name === 'Category'" icon="note_add" flat  color="warning" @click="createNote" />
        <!-- add note in home mode -->
        <q-btn style="padding: 0;" v-else icon="note_add" flat fab  color="warning" @click="createNote" />
        <!-- delete category only in home mode -->
        <q-btn  style="padding: 0;" v-if="route.name === 'Category' && props.category?.name !== 'All Notes'" icon="delete" flat fab
            color="warning" @click="handleDelete({ type: 'category', typeValue: props.category! })" />
    </q-btn-group>

    <!-- delete note -->
    <q-btn-group v-else class="no-box-shadow">
        <q-btn flat fab color="warning" icon="delete" @click="handleDelete({ type: 'note', typeValue: props.note! })" />
    </q-btn-group>
</template>
