//shows my posted jobs (recruiter)

import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/add-company-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { data } from "autoprefixer";
import { State } from "country-state-city";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";
 

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Descriptionis required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or add a new company" }),
  requirement: z.string().min(1, { message: "requirement are mandatory" }),
});

const PostJobs = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      requirement: "",
    },
    resolver: zodResolver(schema),
  });

  const {
    fn: fnCompanies,
    data: companies,
    loading: loadingCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  const{
    loading:loadingCreateJob,
    error : errorCreateJob,
    data : dataCreateJob,
    fn : fnCreateJob
  } = useFetch(addNewJob)

  const onSubmit  = (data) => {
    fnCreateJob({
    ...data,
    recruiter_id : user.id,
    isOpen : true,
  })
  }

  useEffect(()=>{
    if(dataCreateJob?.length > 0)navigate("/jobs")
  },[loadingCreateJob])

  if (!isLoaded || loadingCompanies) {
    return (
      <BarLoader className="mb-4" width={"100%"} color="rgb(129, 29, 29)" />
    );
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div>
      <h2 className="text-center font-semibold gradient-title text-3xl sm:text-5xl md:text-6xl  pb-7">
        Post a Job
      </h2>

      <div className="flex flex-col gap-3">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 bg-slate-950">
          <Input
            placeholder="Job Title"
            {...register("title")}
            className="border-2 border-gray-700 rounded-md p-2  placeholder-gray-400"
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}

          <Textarea
            placeholder="Job Description"
            {...register("description")}
            className="border-2 border-gray-700 rounded-md p-2 placeholder-gray-400 bg-slate-950"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}

          {/* location filter */}

          <div className="flex gap-4 items-center">
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="font-semibold border-gray-700 border-2 bg-slate-950">
                    <SelectValue placeholder="Select Job Location" />
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
              )}
            />

            <Controller
              name="company_id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="font-semibold border-gray-600 border-2 bg-slate-950 ">
                    <SelectValue
                      placeholder="Choose Company"
                      className="text-rgb(148, 163, 184)"
                    >
                      {field.value
                        ? companies?.find(
                            (com) => com.id === Number(field.value)
                          )?.name
                        : "Company"}
                    </SelectValue>
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
              )}
            />

            {/* add company drawer to actually add companies */}

              <AddCompanyDrawer fetchCompanies = {fnCompanies}  />

          </div>
          {errors.location && (
            <p className="text-red-500">{errors.location.message}</p>
          )}
          {errors.company_id && (
            <p className="text-red-500">{errors.company_id.message}</p>
          )}
          <div className="bg-inherit p-5">
          <Controller
            name="requirement"
            control={control}
            render={({ field }) => (
              <MDEditor value={field.value} onChange={field.onChange} className="font-xl bg-slate-600 rounded-3xl "/>
            )}
          />

          
          {errors.requirement && (
            <p className="text-red-500">{errors.requirement.message}</p>
          )}
          {errorCreateJob?.message  && (
            <p className="text-red-500">{errorCreateJob?.message}</p>
          )}
          </div>

          {loadingCreateJob && <BarLoader className="mb-4" width={"100%"} color="rgb(129, 29, 29)" />}
          <Button type="submit" variant="blue" size="lg" className="mt-2">Submit</Button>

        </form>
      </div>
    </div>
  );
};

export default PostJobs;
