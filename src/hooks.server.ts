import type { Handle } from "@sveltejs/kit";

export const handle: Handle = ({ event, resolve }) => {
  const layoutClass = event.url.pathname.startsWith("/resume") ? "layout-resume" : "";
  if (!layoutClass) return resolve(event);
  return resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace('<html lang="en">', `<html lang="en" class="${layoutClass}">`),
  });
};
