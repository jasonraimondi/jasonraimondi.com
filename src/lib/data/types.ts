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
