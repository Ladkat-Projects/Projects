import supabaseClient from "@/utils/supabase";

// Function for fetching jobs via the API
export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .select("*, company: companies(name, logo_url), saved: saved_jobs(id)");

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching jobs", error);
    return null;
  }

  return data;
}


// Function for saving jobs
export async function saveJob(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    // Delete the saved job if it already exists
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id);

    if (deleteError) {
      console.error("Error deleting saved job", deleteError);
      return null;
    }

    return data;

  } else {
    // Insert a new saved job if it doesn’t exist
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([saveData])
      .select();

    if (insertError) {
      console.error("Error inserting saved job", insertError);
      return null;
    }

    return data;
  }
}


// function to get single dedicated job page via job_id

export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .select(
      "*, company: companies(name,logo_url), applications: applications(*)"
    )
    .eq("id", job_id)
    .single();

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Job:", error);
    return null;
  }

  return data;
}

// used for updating hiring status
export async function updateHiringStatus(token, { job_id } , isOpen) {
  const supabase = await supabaseClient(token);


  const { data, error } = await supabase
    .from("jobs")
    .update({isOpen})
    .eq("id", job_id)
    .select();

  

  if (error) {
    console.error("Error updating Job:", error);
    return null;
  }

  return data;
}

// used to add new jobs by recruiters
export async function addNewJob(token, _, jobData) {
  const supabase = await supabaseClient(token);


  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])  
    .select();

  

  if (error) {
    console.error("Error Creating Job:", error);
    return null;
  }

  return data;
}

// used for fetching saved jobs
export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);


  const { data, error } = await supabase
    .from("saved_jobs")
    .select("* , job:jobs(*,company: companies(name , logo_url))");

  

  if (error) {
    console.error("Error Fetching Saved Job:", error);
    return null;
  }

  return data;
}


// used for fetching my created jobs
export async function getMyJobs(token , {recruiter_id}) {
  const supabase = await supabaseClient(token);


  const { data, error } = await supabase
    .from("jobs")
    .select("* , company: companies(name , logo_url)")
    .eq("recruiter_id" , recruiter_id);

  

  if (error) {
    console.error("Error Fetching Created Jobs :", error);
    return null;
  }

  return data;
}

// used for fetching my created jobs
export async function deleteJob(token , {job_id}) {
  const supabase = await supabaseClient(token);


  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id" , job_id)
    .select();

  

  if (error) {
    console.error("Error Deleteing Job :", error);
    return null;
  }

  return data;
}
