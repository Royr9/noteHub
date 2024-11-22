import { Row } from './db';

export class Category extends Row {
    public name?: 'All Notes' | string;
	public iconName: string = "folder"; 
}

export interface Contact {
    fullName: string,
    phoneNumber: string
}

export class Note extends Row {
	public title: string = "";
	public body: string = "";
	public categories: number[] = [];
	public dateCreated : Date = new Date();
	public contactsMentioned : Contact[] = [];
	public progress?: 0| 25 | 50 | 75 | 100;
}

export const progressColors = {
    0: 'grey-3',
    25: 'warning',
    50: 'negative',
    75: 'accent',
    100: 'secondary'
}

export function getCategoryNotes(categoryName: string): Note[] {
	if (categoryName === "All Notes") {
		return Note.all()
	}

	const category = getCategoryByName(categoryName);
	if (category) {
		return Note.all().filter((note) =>{
			return note.categories.includes(category.id!)
		});
	}

	return []
}

// get category by name assuming that the name has to be unique
export function getCategoryByName(name: string): Category | null {
	let category:Category | null = null;
	for (const cat of Category.all()) {
		if ( cat.name === name) {
			category = cat;
			break
		}
	}
	return category;
}


export function removeCategoryFromNotes(categoryId:number) {
	const modifiedNotes:Note[] = []
	Note.all().forEach((note)=>{
		note.categories = note.categories.filter(catId => {
			if (catId === categoryId) {
				modifiedNotes.push(note);
			}
			return catId !== categoryId
		});
	});
	return modifiedNotes;
}



if (Category.all().length === 0){
	Category.create({
		id: 1,
		name: "todo"
	})
	Category.create({
		id: 2,
		name: "groceries"
	})
}

if (Note.all().length === 0) {
	Note.create({
		id: 1,
		title: "New note",
		body: "Whats on your mind today?",
	});

	Note.create({
		id: 2,
		title: "New note2",
		body: "add your text",
		categories: [1, 2]
	})
}

