
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		redirect: "/",
		children: [
			{
				path: '/',
				component: () => import('pages/HomePage.vue'),
				name: 'NoteHub'
			},
			{
				path: "/:categoryName",
				component: () => import('pages/CategoryNotesPage.vue'),
				name: 'Category',
				meta: {
					navigateBack: true
				}
			},
			{
				path: "/notes",
				component: () => import('pages/CategoryNotesPage.vue'),
				name: 'All Notes',
				meta: {
					navigateBack: true
				}
			},
			{
				path: "/notes/:noteId",
				component: () => import('pages/NotePage.vue'),
				name: 'Note',
				meta: {
					navigateBack: true
				}
			}
			]
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/ErrorNotFound.vue'),
		name: 'Error'
	},
];

export default routes;
