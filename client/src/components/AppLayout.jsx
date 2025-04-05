import { Outlet } from "react-router-dom";
import SidebarDemo from "./ResponsiveSidebar";

const AppLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
   <SidebarDemo />
  <main className="flex-1 overflow-y-auto "> {/* You can adjust padding as needed */}
  <Outlet />  {/* This is your main dashboard/page content */}
  </main>
</div>

  );
};

export default AppLayout;
