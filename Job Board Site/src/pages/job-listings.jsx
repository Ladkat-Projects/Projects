//used to show all available jobs according to searches

import { getCompanies } from "@/api/apiCompanies";
import { getJobs, saveJob } from "@/api/apiJobs";
import JobCard from "@/components/job-card";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "country-state-city";

const JobListings = () => {
  // three states for searching and fetching jobs
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");

  const { isLoaded } = useUser();

  const {
    fn: fnJobs,
    data: jobs,
    loading: loadingJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  const { fn: fnCompanies, data: companies } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, location, company_id, searchQuery]);

  // handles searching (user defined function)
  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
  };

  // barloader
  if (!isLoaded) {
    return (
      <BarLoader className="mb-4" width={"100%"} color="rgb(129, 29, 29)" />
    );
  }

  return (
    <div>
      <h1 className="text-center font-semibold gradient-title text-3xl sm:text-5xl md:text-6xl  pb-7">
        Career Opportunities
      </h1>

      {/* // add filters here */}

      <form
        onSubmit={handleSearch}
        className="sm:h-14 h-10 flex w-full gap-4 items-center mb-3"
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title"
          name="search-query"
          className="h-full flex-1 px-4 py-3 text-md border-gray-600 font-semibold border-2"
        />

        <Button type="submit" className="h-full sm:w-28" variant="destructive">
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2">
      <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger className="font-semibold border-gray-600 border-2">
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger className="font-semibold border-gray-600 border-2 ">
            <SelectValue placeholder="Filter by Company" className="text-rgb(148, 163, 184)" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({ name, id }) => {
                return (
                  <SelectItem key={name} value={id}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select> 

        {/* clear filters button */}
        <Button onClick = {clearFilters}variant = "blue" className="sm:w-1/2 font-semibold">Clear Filters</Button>
      </div>

    {/* barloader */}
      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="rgb(129, 29, 29)" />
      )}

      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs?.length ? (
            jobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div> No Jobs Found </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListings;
