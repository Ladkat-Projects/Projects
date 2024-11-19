import { getSavedJobs } from "@/api/apiJobs";
import JobCard from "@/components/job-card";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const SavedJobs = () => {
  const { isLoaded } = useUser();
  const [savedJobs, setSavedJobs] = useState([]);

  const {
    loading: loadingSavedJobs,
    data: dataSavedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  // Fetch jobs on component load or when the user is loaded
  useEffect(() => {
    if (isLoaded) fnSavedJobs();
  }, [isLoaded]);

  // Update local state when data is fetched
  useEffect(() => {
    if (dataSavedJobs) {
      setSavedJobs(dataSavedJobs);
    }
  }, [dataSavedJobs]);

  // Handle job removal
  const handleJobRemove = (jobId) => {
    const updatedJobs = savedJobs.filter((job) => job.id !== jobId);
    setSavedJobs(updatedJobs);

    // Optionally, sync removal with server
    fnSavedJobs(); // To re-fetch data if needed
  };

  // Show loader while data is being loaded
  if (!isLoaded || loadingSavedJobs) {
    return (
      <BarLoader className="mt-4" width={"100%"} color="rgb(129, 29, 29)" />
    );
  }

  return (
    <div>
      <h1 className="text-center font-semibold gradient-title text-3xl sm:text-5xl md:text-6xl pb-7">
        Saved Jobs
      </h1>

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedJobs.length > 0 ? (
          savedJobs.map((saved) => (
            <JobCard
              key={saved.id}
              job={saved.job}
              savedInit={true}
              onJobSaved={() => handleJobRemove(saved.id)}
            />
          ))
        ) : (
          <div>No Saved Jobs Found</div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
