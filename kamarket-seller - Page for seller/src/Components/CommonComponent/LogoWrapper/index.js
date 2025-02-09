import React, { useContext } from "react";
import ToggleButton from "./ToggleButton";
import Logo from "./Logo";
import Image from "next/image";
import SettingContext from "../../../Helper/SettingContext";
import I18NextContext from "@/Helper/I18NextContext";
import Link from "next/link";

const LogoWrapper = ({ setSidebarOpen }) => {
  const { state } = useContext(SettingContext)
  const { i18Lang } = useContext(I18NextContext)
  return (
    <div className="logo-wrapper logo-wrapper-center">
      <Logo />
      <Link href={`/${i18Lang}/dashboard`} className='logo-sm w-auto'>
        <h2 className="text-white">KA</h2>
      </Link>
      {/* <Image className="img-fluid logo-sm w-auto" src="/assets/images/logo/logo.png" alt="Tiny Logo" width={100} height={100} /> */}
      <ToggleButton setSidebarOpen={setSidebarOpen} />
    </div>
  );
};

export default LogoWrapper;
