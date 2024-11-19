import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/use-fetch";
import { applyToJob } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";

const schema = z.object({
  experience: z
    .number()
    .min(0, { message: "Experience must be atleast 0" })
    .int(),

  skills: z.string().min(1, { message: "Skills are required" }),

  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Education is required",
  }),

  resume: z
  .any()
  .refine(
    (file) =>
      file[0] &&
      (file[0].type === "application/pdf" || // PDF (format is application and not applications)
        file[0].type === "application/msword" || // DOC
        file[0].type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // DOCX
      ),
    { message: "Only PDF, DOC, and DOCX documents are allowed" }
  ),

});

const ApplyJobDrawer = ({ user, job, applied = false, fetchJob }) => {
  // hook to use implemnt zod into our form and ause react-hook-form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob);

  const onSubmit = (data) => {
    fnApply({
      ...data,
      job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      status: "applied",
      resume: data.resume[0],
    }).then(() => {
      fetchJob();
      reset();
    });
  };

  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger>
        <Button
          className="mt-5 p-6 sm:text-xl text-md"
          size="lg"
          variant={job?.isOpen && !applied ? "blue" : "destructive"}
          disabled={!job?.isOpen || applied}
        >
          {/* apply button visible only if not applied till now */}
          {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed!"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Apply for {job?.title} at {job?.company?.name}
          </DrawerTitle>

          <DrawerDescription>Please fill the form below</DrawerDescription>
        </DrawerHeader>

        {/* form for applying to a job */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4"
        >
          <Input
            type="number"
            placeholder="Years of Experience"
            className="flex-1 p-3"
            {...register("experience", {
              valueAsNumber: true,
            })}
          />
          {errors.experience && (
            <p className="text-red-600">{errors.experience.message}</p>
          )}

          <Input
            type="text"
            placeholder="Skills (Comma Separated)"
            className="flex-1 p-3"
            {...register("skills")}
          />
          {errors.skills && (
            <p className="text-red-600">{errors.skills.message}</p>
          )}

          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} {...field}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Graduate" id="graduate" />
                  <Label htmlFor="graduate">Graduate</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Post Graduate" id="post graduate" />
                  <Label htmlFor="post graduate">Post-graduate</Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.education && (
            <p className="text-red-600">{errors.education.message}</p>
          )}

          <Input
            type="file"
            className="flex-1 p-3 file:text-gray-400"
            accept=".pdf , .doc , .docx"
            {...register("resume")}
          />
          {errors.resume && (
            <p className="text-red-600">{errors.resume.message}</p>
          )}

          {errorApply?.message && (
            <p className="text-red-600">{errorApply?.message}</p>
          )}

          {/* barloader */}
          {loadingApply && (
            <BarLoader width={"100%"} color="rgb(129, 29, 29)" />
          )}

          <Button type="submit" variant="blue" size="lg">
            Apply
          </Button>
        </form>

        <DrawerFooter>
          <DrawerClose>
            <Button variant="destructive">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyJobDrawer;
