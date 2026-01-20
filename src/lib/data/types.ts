export interface Project {
	name: string;
	emoji: string;
	url: string;
	description: string;
}

export interface ProjectsData {
	projects: Project[];
}

export interface Post {
	title: string;
	slug: string;
	date: string;
	description: string;
	categories?: string[];
	tags?: string[];
	images?: string[];
	imageCredit?: string;
	archived?: boolean;
	lastmod?: string;
}

export interface Thing {
	title: string;
	slug: string;
	date: string;
	description: string;
	categories?: string[];
	tags?: string[];
	images?: string[];
	aliases?: string[];
}

export interface Archive {
	name: string;
	url: string;
	description?: string;
}

export interface ArchivesData {
	archives: Archive[];
}

export interface Book {
	name: string;
}

export interface BooksData {
	books: Book[];
}
