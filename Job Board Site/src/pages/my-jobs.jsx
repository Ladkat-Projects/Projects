//this page shwos my applied jobs

import CreatedApplications from "@/components/created-applications";
import CreatedJobs from "@/components/created-jobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";

const MyJobs = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <BarLoader className="mt-4" width={"100%"} color="rgb(129, 29, 29)" />
    );
  }

  return (
    <div>
      <h1 className="text-center font-semibold gradient-title text-3xl sm:text-5xl md:text-6xl pb-7">
        {user?.unsafeMetadata.role === "candidate"
          ? "My Applications"
          : "My Jobs"}
      </h1>

      {user?.unsafeMetadata?.role === "candidate" ? (
        <CreatedApplications />
      ) : (
        <CreatedJobs />
      )}
    </div>
  );
};

export default MyJobs;
