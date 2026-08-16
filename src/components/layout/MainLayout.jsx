import { Outlet } from "react-router-dom";
import Navbar from "./navbar";

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg transition-colors duration-[400ms]">
      <Navbar />
      <main className="flex-1 bg-bg transition-colors duration-[400ms] min-[2560px]:py-4 min-[3840px]:py-8">
        <div className="w-full px-5 md:px-10 lg:px-[4.375rem] min-[2560px]:px-16 min-[3840px]:px-24 pb-10 min-[2560px]:pb-16">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
