export interface ResumeBasics {
	name: string;
	label: string;
	picture: string;
	email: string;
	website: string;
	summary: string;
	location: {
		city: string;
		countryCode: string;
		region: string;
	};
	profiles: Array<{
		network: string;
		username: string;
		url: string;
	}>;
}

export interface ResumeWork {
	company: string;
	position: string;
	website?: string;
	startDate: string;
	endDate: string;
	summary?: string;
	highlights: string[];
}

export interface ResumeEducation {
	institution: string;
	area: string;
	studyType: string;
	endDate: string;
	courses: string[];
}

export interface ResumePublication {
	name: string;
	releaseDate: string;
	website: string;
	summary: string;
}

export interface ResumeSkill {
	name: string;
	keywords: string[];
}

export interface Resume {
	basics: ResumeBasics;
	work: ResumeWork[];
	education: ResumeEducation[];
	publications: ResumePublication[];
	skills: ResumeSkill[];
}
