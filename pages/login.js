import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Router from "next/router";
import Cookies from "js-cookie";
import { useLoginTeamMutation } from "../Redux/services/servicesApi";
import { addUser } from "../Redux/slices/authSlice";
import styles from "../styles/Login.module.css";

function Login() {
  const [loginTeam, { data, error, isLoading, isError, isSuccess }] =
    useLoginTeamMutation();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState({});

  useEffect(() => {
    if (isSuccess) {
      const resData = {
        user: data.user,
      };

      const forClientCookie = {
        name: resData.user.name,
        email: resData.user.email,
      };
      dispatch(addUser(resData));
      Cookies.set("user", JSON.stringify(forClientCookie));
      Router.push("/");
    }
    if (isError) {
      setErrorMsg(error?.data?.message);
    }
    // (async () => {
    // })();
  }, [isSuccess, isError]);

  //Validations
  const isValidForm = () => {
    if (!username.trim()) {
      setErrorMsg({ username: "Please provide email address or username" });
      return false;
    }
    if (!password.trim()) {
      setErrorMsg({ username: "", password: "Please enter your password" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValidForm()) {
      const data1 = { username, password };
      await loginTeam(data1);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          hight: "100vh",
          width: "100vw",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <div className={styles.loginConatiner}>
        <h1 className="text-center text-2xl font-bold">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="pt-1 pb-2">
            <input
              className={`${
                errorMsg?.username || errorMsg?.general
                  ? "border-red-500"
                  : "border-gray-900"
              }`}
              type="text"
              placeholder="Enter Username or email address"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <span className="text-xs text-red-700 w-full">
              {errorMsg?.username || errorMsg?.general}
            </span>
          </div>
          <div className="pt-1 pb-2">
            <input
              className={`${
                errorMsg?.password ? "border-red-500" : "border-gray-900"
              }`}
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <span className="text-xs text-red-700 w-full">
              {errorMsg?.password}
            </span>
          </div>
          <div className="py-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 rounded w-full"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
