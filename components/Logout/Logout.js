import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Router from "next/router";
import { useLogoutTeamQuery } from "../../Redux/services/servicesApi";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { logoutTeam } from "../../Redux/customApi/api";

const Logout = () => {
  const logout = async () => {
    const data = await logoutTeam();
    if (data.status == 200) {
      Cookies.remove("user");
      Router.push("/login");
    }
  };
  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Logout;
