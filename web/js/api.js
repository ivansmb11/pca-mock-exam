import axios from "https://esm.sh/axios@1.7.9";
import { SUPABASE_URL } from "../config.js";
import { getAccessToken } from "./auth.js";

// Calls the `coach` Edge Function. Returns { model, coaching, new_questions }.
export async function callCoach(attempt, history) {
  const token = await getAccessToken();
  if (!token) throw new Error("Not signed in");

  try {
    const { data } = await axios.post(
      `${SUPABASE_URL}/functions/v1/coach`,
      { attempt, history },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 120000, // coaching + question generation can take a while
      },
    );
    return data;
  } catch (err) {
    const status = err.response?.status;
    const detail = err.response?.data ? JSON.stringify(err.response.data) : err.message;
    throw new Error(`coach failed${status ? ` (${status})` : ""} ${detail}`);
  }
}
