import { useUser } from "@clerk/clerk-react";
import { Card, CardFooter } from "./ui/card";
import { CardHeader } from "./ui/card";
import { CardTitle } from "./ui/card";
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { CardContent } from "./ui/card";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { deleteJob, saveJob } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobCard = ({
  job,
  isMyJob = false,
  savedInit = false,
  onJobSaved = () => {},
}) => {
  const [saved, setSaved] = useState(savedInit);

  const {
    fn: fnSavedJob,
    data: savedJob,
    loading: loadingSavedJobs,
  } = useFetch(saveJob, {
    alreadySaved: saved,
  });

  const { user } = useUser();

  const handleSavedJob = async () => {
    await fnSavedJob({
      user_id: user.id,
      job_id: job.id,
    });
    onJobSaved();
  };

  const {
    loading: loadingDeleteJob,
    fn: fnDeleteJob,
  } = useFetch(deleteJob, {
    job_id : job.id,
  });

  const handleDeleteJob = async () => {
    await fnDeleteJob()
    onJobSaved();
  } 

  

  useEffect(() => {
    if (savedJob !== undefined) setSaved(savedJob?.length > 0);
  }, [savedJob]);

  return (
    <Card className="border-gray-600 flex flex-col h-full">
      {loadingDeleteJob && (
        <BarLoader className="mt-4" width={"100%"} color="rgb(129, 29, 29)" />
      )}
      <CardHeader>
        <CardTitle className="flex justify-between font-bold sm:text-2xl md:text-2xl text-l">
          {job.title}

          {isMyJob && (
            <Trash2Icon
              fill="none"
              size={20}
              className="cursor-pointer text-red-700"
              onClick={handleDeleteJob}
            />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between gap-4">
          <div>
            {job.company && <img src={job.company.logo_url} className="h-5" />}
          </div>

          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} /> {job.location}
          </div>
        </div>
        <hr className="border-gray-700 h-5 mt-4" />

        {job.description ? (
          <p>
            {(() => {
              // Check if description contains a full stop
              const firstPeriodIndex = job.description.indexOf(".");
              if (firstPeriodIndex !== -1) {
                // Truncate after the first full stop
                return job.description.substring(0, firstPeriodIndex + 1);
              }
              // If no full stop, return the whole description
              return job.description;
            })()}
          </p>
        ) : (
          <p className="text-gray-500">No description available.</p>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 mt-auto">
        {" "}
        {/* mt-auto pushes the footer to the bottom */}
        <Link to={`/jobs/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>
        {!isMyJob && (
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSavedJob}
            disabled={loadingSavedJobs}
          >
            {saved ? (
              <Heart
                size={20}
                stroke="rgb(129, 29, 29)"
                fill="rgb(129, 29, 29)"
              />
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
