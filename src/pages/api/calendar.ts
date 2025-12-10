import type { APIRoute } from "astro";
import { getEvents } from "../../lib/server/getEvents";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const events = await getEvents();
    return new Response(JSON.stringify(events), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error fetching calendar events", { status: 500 });
  }
}
