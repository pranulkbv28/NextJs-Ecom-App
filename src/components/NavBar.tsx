import Link from "next/link";
import React from "react";

function NavBar() {
  return (
    <div>
      <Link className="text-black" href={"/auth/login"}>
        Login
      </Link>
    </div>
  );
}

export default NavBar;
