
<script setup lang="ts">
import { useQuasar } from 'quasar';
import ToolbarButtons from 'src/components/ToolbarButtons.vue';
import { Category, Note, getCategoryByName } from 'src/models';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const $q = useQuasar();

// title
const pageTitle = computed(() => {
	return route.name
});

// Set dark mode as default mode
$q.dark.set(true)

// navigate back or to previous page that make sense
function navigateBack() {
	if (route.name === "Category") {
		return router.push("/")
	}
	return router.back()
}

function getCurrentNote() {
	if (route.params.noteId) {
		return Note.get(parseInt(route.params.noteId as string));
	}
}

function getCurrentCategory() {
	if (route.params.categoryName && route.params.categoryName !== 'notes') {
		const category = getCategoryByName(route.params.categoryName as string);
		if (category) {
			return Category.get(category.id!)	
		}
	}
}

</script>

<template>
	<q-layout view="hHh lpR fff">
		<q-header reveal elevated class="bg-primary text-white">
			<q-toolbar>
				<q-btn v-if="route.meta.navigateBack"
					flat 
					icon="arrow_back"
					@click="navigateBack" />
				
				<div class="absolute fixed-top-right">
					<toolbar-buttons v-if="getCurrentNote()" :note="getCurrentNote()"/>
					<toolbar-buttons v-else-if="getCurrentCategory()" :category="getCurrentCategory()"/>
					<toolbar-buttons v-else/>
				</div>
				
			</q-toolbar>
		</q-header>

		<q-page-container>
			<router-view />
		</q-page-container>

	</q-layout>
</template>


