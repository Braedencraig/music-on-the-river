import { createClient } from "../utils/supabase/server";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: responses, error } = await supabase
    .from("survey_responses")
    .select("*")
    .order("concert_date", { ascending: false });

  if (error) {
    console.error("Error fetching responses:", error);
    return <div>Error loading responses</div>;
  }

  return <AdminDashboard responses={responses} />;
}
