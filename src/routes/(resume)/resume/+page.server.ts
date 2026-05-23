import type { Resume } from "$lib/data/resume";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
  const response = await fetch("/resume.json");
  const resume: Resume = await response.json();
  return { resume };
};
