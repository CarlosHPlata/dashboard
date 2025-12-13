import type { APIRoute } from "astro";
import { getEvents } from "../../lib/server/getEvents";
import moment from "moment";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const { start } = Object.fromEntries(new URL(request.url).searchParams.entries());

    // Validate that start is in ISO date format
    if (start && !moment(start, moment.ISO_8601, true).isValid()) {
      return new Response("Invalid start date. Must be in ISO 8601 format.", { status: 400 });
    }

    const events = await getEvents(start);
    return new Response(JSON.stringify(events), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error fetching calendar events", { status: 500 });
  }
}
