import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white ">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full mt-10">
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;
