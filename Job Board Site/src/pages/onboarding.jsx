import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const navigateUser = (currRole) => {
    navigate(currRole === "recruiter" ? "/post-jobs" : "/jobs");
  };

  const handleRoleSelection = async (role) => {
    await user
      .update({ unsafeMetadata: { role } })
      .then(() => {
        console.log(`Role updated to: ${role}`);
        navigateUser(role);
      })
      .catch((err) => {
        console.error("Error updating role:", err);
      });
  };

  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigateUser(user.unsafeMetadata.role);
    }
  }, [user]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="rgb(129, 29, 29)" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="gradient-title font-semibold text-4xl sm:text-5xl md:text-6xl tracking-tight text-center">
        Choose Your Role
      </h2>
      <div className="mt-8 w-full max-w-xs flex flex-col gap-3 sm:mt-12 md:mt-16 md:grid md:grid-cols-2 md:max-w-2xl md:gap-6 lg:max-w-3xl lg:gap-8 lg:mt-20">
        <Button
          variant="blue"
          className="h-16 w-full text-base sm:h-20 sm:text-lg md:h-24 md:text-xl lg:h-28 lg:text-2xl"
          onClick={() => handleRoleSelection("candidate")}
        >
          Candidate
        </Button>
        <Button
          variant="destructive"
          className="h-16 w-full text-base sm:h-20 sm:text-lg md:h-24 md:text-xl lg:h-28 lg:text-2xl"
          onClick={() => handleRoleSelection("recruiter")}
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
