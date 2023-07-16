// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }

  type Resume = {
    basics: Basics;
    work: Work[];
    education: Education[];
    publications: Publication[];
    skills: Skill[];
  };

  type Basics = {
    name: string;
    label: string;
    picture: string;
    email: string;
    website: string;
    summary: string;
    location: Location;
    profiles: Profile[];
  };

  type Location = {
    city: string;
    countryCode: string;
    region: string;
  };

  type Profile = {
    network: string;
    username: string;
    url: string;
  };

  type Education = {
    institution: string;
    area: string;
    studyType: string;
    endDate: Date;
    courses: string[];
  };

  type Publication = {
    name: string;
    releaseDate: Date;
    website: string;
    summary: string;
  };

  type Skill = {
    name: string;
    keywords: string[];
  };

  type Work = {
    company: string;
    position: string;
    website?: string;
    startDate: Date;
    endDate: string;
    summary?: string;
    highlights: string[];
  };
}

export {};
