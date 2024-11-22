<script setup lang='ts' >
import { Contacts } from '@capacitor-community/contacts';
import { Contact, Note } from 'src/models';
import { computed } from 'vue';
import { ref } from 'vue';

const props = defineProps({
    noteId: Number
});

const note = Note.get(props.noteId!);
const searchFilter = ref("");
const toggleSelection = ref(false);
// comment out in web and use code below
const contacts = ref<Contact[]>([] as Contact[]);

// Random contacts, can be used to test on web application
// const contacts = ref<Contact[]>([
//     { fullName: "John Doe", phoneNumber: "+31 641642519" },
//     { fullName: "Jane Smith", phoneNumber: "+31 641642520" },
//     { fullName: "Mary Johnson", phoneNumber: "+31 641642521" },
//     { fullName: "Mike Brown", phoneNumber: "+31 641642522" },
//     { fullName: "Emily Davis", phoneNumber: "+31 641642523" },
//     { fullName: "Daniel Miller", phoneNumber: "+31 641642524" },
//     { fullName: "Laura Wilson", phoneNumber: "+31 641642525" },
//     { fullName: "James Moore", phoneNumber: "+31 641642526" },
//     { fullName: "Sophia Taylor", phoneNumber: "+31 641642527" },
//     { fullName: "David Anderson", phoneNumber: "+31 641642528" }
// ]);

function chooseContact(contact: Contact) {
    searchFilter.value = "";
    toggleSelection.value = !toggleSelection.value;
    note.contactsMentioned?.push(contact);
}

async function getContacts() {
    if (toggleSelection.value) {
        return toggleSelection.value = false;
    }

    if (!contacts.value.length) {
        const userContacts = await Contacts.getContacts({
            projection: {
                // Specify which fields should be retrieved.
                name: true,
                phones: true,
            },
        });

        for (const contact of userContacts.contacts) {
            const number = contact.phones?.[0]?.number;
            const fullName = contact.name?.display;
            if (number && fullName) {
                contacts.value = [...contacts.value, { fullName, phoneNumber: number }]
            }
        }
    }

    return toggleSelection.value = true;
}


function removeMentionedContact(name: string) {
    note.contactsMentioned = note.contactsMentioned.filter(contact => contact.fullName !== name);
}

// modify the current matching contacts
const outputtedContacts = computed(()=>{
    if (searchFilter.value === "") {
        return contacts.value ?? [] as Contact[]
    }
    return contacts.value.filter((contact)=>{
        return contact.fullName.toLowerCase() === searchFilter.value.toLowerCase()
    });
})

</script>
<template>
    <div class="q-my-md">
        <q-btn color="secondary" icon="contacts" label="Mention a contact" @click="getContacts" />
        <div class="mentioned-contacts q-my-sm q-gutter-y-sm">
            <q-badge v-for="contact, index in note.contactsMentioned" :key="index" class="text-h6 mentioned-contact" outline
                color="accent" style="position: relative;">
                <span class="text-secondary ">{{ contact.fullName }}</span>
                <q-badge class="q-ml-sm">{{ contact.phoneNumber }}</q-badge>
                <q-badge rounded color="negative" floating @click="removeMentionedContact(contact.fullName)">
                    <q-icon name="close" />
                </q-badge>
            </q-badge>
        </div>

        <div v-if="toggleSelection === true" class="q-my-sm">
            <!-- search filter to be implemented -->
            <q-list bordered>
                <q-input  standout bottom-slots v-model="searchFilter" label="Search"
                    hint="Search by name"

                    counter maxlength="30" dense>
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
                <!-- search by name -->
                <q-item v-for="contact, index in outputtedContacts" :key="index" clickable v-ripple @click="chooseContact(contact)">
                    <q-item-section>{{ contact.fullName }}</q-item-section>
                    <q-item-section>{{ contact.phoneNumber }}</q-item-section>
                </q-item>
            </q-list>
        </div>
    </div>
</template>

<style scoped lang='scss'>
div.selection {
    margin-top: 1rem;
}
.q-page{
    position: relative;
    
}
.q-list {
    max-height: 200px;
    overflow-y: scroll;
    width: 85vw;
}
</style>