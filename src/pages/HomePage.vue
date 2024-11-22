<script setup lang='ts' >
import { Category, Note, getCategoryNotes} from 'src/models';

function createCategory() {
    Category.create({name: `NewCategory${Category.all()[Category.all().length - 1].id! + 1}`})
}

</script>

<template>
    <q-page>
        <q-list  bordered  >
            <!-- all notes -->
            <q-item clickable  v-ripple to="/notes" >
                <q-item-section avatar>
                    <q-icon name="folder" />
                </q-item-section>
                <q-item-section class="item-title">All notes</q-item-section>
                <q-item-section side class="notes-amount">{{ Note.all().length }} <q-icon name="chevron_right" /> </q-item-section>

            </q-item>
        </q-list>

        <!-- * by category * -->
        <div class="categories-list-header q-px-sm">
            <h6>By category</h6>
            <q-btn flat fab icon="add" 
            @click="createCategory" />
        </div>
        <q-list bordered >
            <div v-for="noteCategory in Category.all()" :key="noteCategory.id">
                <q-item clickable v-ripple :to="`/${noteCategory.name}`" > 
                    <q-item-section avatar>
                        <q-icon :name="noteCategory.iconName" />
                    </q-item-section>
                    <q-item-section class="item-title">{{ noteCategory.name }}</q-item-section>
                    <q-item-section side class="notes-amount">
                        {{ getCategoryNotes(noteCategory.name!).length }} <q-icon name="chevron_right" />
                    </q-item-section>

                </q-item>
                <q-separator inset="item" v-if="noteCategory.id !== Category.all()[Category.all().length - 1].id" />
            </div>
        </q-list>
        
    </q-page>
</template>

<style scoped lang='scss'>

.categories-list-header{
    display: flex;
    justify-content: space-between;
    h6{
        margin: 0;
        display: flex;
        align-items: center;
    }
}

.q-item{
    position: relative;
}

.notes-amount{
    position: relative;
    display: flex!important;
    flex-direction: row!important;
    align-items: center!important;
    color: white;
}

</style>