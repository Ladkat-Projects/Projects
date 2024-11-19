import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen"> {/* Add flex and min-h-screen to ensure full height */}
      <div className="grid-background"></div>

      <main className="px-6 sm:px-16 flex-grow"> {/* Add flex-grow to allow the main content to grow and push footer down */}
        <Header />
        <Outlet />
      </main>
      
      <hr className="border-t-2 border-gray-700 h-10 mt-8" />

      <div className="flex flex-col items-center justify-center mb-4">
        <div className="font-mono sm:text-2xl text-xl text-white text-center bg-transparent">
          Made by Ajinkya Ladkat
        </div>
        <div className="flex gap-4">
          <a
            href="https://github.com/AjinkyaLadkat"
            className="text-white hover:text-gray-400"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
