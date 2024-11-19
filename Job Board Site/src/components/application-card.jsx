import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import useFetch from "@/hooks/use-fetch";
import { updateApplicationStatus } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application.job_id,
    }
  );

  const handleStatusChange = (status) => {
    fnHiringStatus(status);
  };

  return (
    <Card className="mt-2 relative">
      {loadingHiringStatus && (
        <div className="absolute top-0 left-0 w-full">
          <BarLoader width={"100%"} color="rgb(129, 29, 29)" />
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex justify-between gap-3 font-bold text-2xl text-blue-600">
          {isCandidate
            ? `${application?.job?.title} at ${application?.job?.company?.name}`
            : application?.name}

          <Download
            size={18}
            className="bg-white text-black font-extrabold rounded-full h-8 w-8 cursor-pointer p-1.5"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness size={15} /> {application?.experience} years of
            experience
          </div>
          <div className="flex gap-2 items-center">
            <School size={15} /> {application?.education}
          </div>
          <div className="flex gap-2 items-center">
            <Boxes size={15} /> Skills : {application?.skills}
          </div>
        </div>
        <hr />
      </CardContent>
      <CardFooter className="flex- justify-between">
        <span>Date: {new Date(application?.created_at).toLocaleString()}</span>
        {isCandidate ? (
          <span className="capitalize font-bold">
            Status : {application.status}
          </span>
        ) : (
          <Select onValueChange={handleStatusChange} defaultValue={application.status}>
            <SelectTrigger className="w-52">
              <SelectValue
                placeholder="Application Status"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
