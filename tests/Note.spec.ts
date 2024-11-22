import { test, expect } from '@playwright/test';


test.beforeEach(async ({ page }) => {
	await page.goto('http://localhost:9000/');
	page.reload();
});


test('test creating a note', async ({ page }) => {
	await page.getByText('folderAll notes2 chevron_right').click();
	await page.locator('button').filter({ hasText: 'note_add' }).click();
	// note title
	await page.getByPlaceholder('Note Title...').fill('Hello Note');

	// note body
	await page.getByPlaceholder('Write your notes here...').click();
	await page.getByPlaceholder('Write your notes here...').fill('I need to finish this exam...');

	// add categories
	await page.locator('div').filter({ hasText: /^add$/ }).getByRole('button').click();
	await page.getByLabel('todo').locator('div').nth(2).click();
	await page.getByRole('button', { name: 'OK' }).click();

	// finish editing
	await page.locator('button').filter({ hasText: 'arrow_back' }).click();
	// check persistance
	await page.reload()
	// make sure note was created
	await page.getByText('Hello NoteI need to finish this').click();
	await expect(page.getByPlaceholder('Note Title...')).toHaveValue('Hello Note');
});

// test modifying the note categories, and seeing that he indeed shown in each selected category 
test('test note categories', async ({ page }) => {
	await page.getByText('folderAll notes2 chevron_right').click();
	await page.locator('button').filter({ hasText: 'note_add' }).click();
	await page.getByPlaceholder('Note Title...').fill('test note categories');
	
	// choose categories
	await page.locator('div').filter({ hasText: /^add$/ }).getByRole('button').click();
	await page.getByLabel('todo').locator('div').nth(2).click();
	await page.getByLabel('groceries').locator('div').nth(2).click();
	await page.getByRole('button', { name: 'OK' }).click();
	
	// check persistance
	page.reload();

	//  go to todo category
	await page.goto("http://localhost:9000/todo")
	await page.getByText('test note categories').click();
	//  make sure todo category exist inside the note
	await page.getByLabel('todo');

	// repeat with groceries category
	await page.goto("http://localhost:9000/groceries");
	await page.getByText('test note categories').click();
	page.getByLabel('groceries')
});

