import { json } from "@sveltejs/kit";
import resume from "$resume";

export const prerender = true;

export async function GET() {
  return json(resume);
}
