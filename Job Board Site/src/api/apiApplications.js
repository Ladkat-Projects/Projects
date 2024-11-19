// this is used to implement the candidate application process


import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function applyToJob(token, _, jobData) {
    const supabase = await supabaseClient(token);

    // logic for assigning file name to each resume
    const random = Math.floor(Math.random() * 90000);
    const fileName = `resume-${random}-${jobData.candidate_id}`;

    const { error: storageError } = await supabase.storage.from("resumes").upload(fileName, jobData.resume);

    if (storageError) {
      console.error("Error Uploading Resume :" , storageError);
      return null;
    }

    const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;


    const { data, error } = await supabase
    .from("applications")
    .insert([ 
      {
        ...jobData,
        resume,
      },
    ])
    .select();

    if (error) {
        console.error("Error submitting application", error);
    }

    return data;
}

// used to update application status (hired, rejected, interviewing , applied)
export async function updateApplicationStatus(token , {job_id} , status){
    const supabase = await supabaseClient(token);

    // used to update hiring status
    const { data, error } = await supabase
      .from("applications")
      .update({status})
      .eq("job_id" , job_id)
      .select("*");

    if (error || data.length === 0 ) {
      console.error("Error Updatinng Application Status ", error);
      return null;
    }

    return data;
}

// used to display my applied jobs
export async function getApplications(token , {user_id}){
    const supabase = await supabaseClient(token);

    // used to update hiring status
    const { data, error } = await supabase
      .from("applications") 
      .select("*, job:jobs(title,company: companies(name))")
      .eq("candidate_id" , user_id);

    if (error) {
      console.error("Error Fetching Applications : ", error);
      return null;
    }

    return data;
} 