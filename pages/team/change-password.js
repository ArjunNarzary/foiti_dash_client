import { LoadingButton } from "@mui/lab";
import { Backdrop, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import TransitionAlerts from "../../components/Alert/Alert";
import Layout from "../../components/Layout/Layout";
import { useUpdatePasswordMutation } from "../../Redux/services/servicesApi";
import { requireAuthentication } from "../../resources/requireAuthentication";

const ChangePassword = () => {
  const [alertText, setAlertText] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [showAlert, setShowAlert] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState({});

  const [updatePassword, { data, isLoading, isSuccess, isError, error }] =
    useUpdatePasswordMutation();

  //VALIDATE FORM
  //FORM VALIDATION
  const isValidForm = () => {
    if (!currentPassword.trim()) {
      setErrorMsg({ currentPassword: "Please enter current password" });
      return false;
    }
    if (!newPassword.trim()) {
      setErrorMsg({ newPassword: "Please enter new password" });
      return false;
    }
    if (newPassword.trim().length < 8) {
      setErrorMsg({
        newPassword: "Password must contain atleast 8 characters",
      });
      return false;
    }
    if (currentPassword.trim() == newPassword.trim()) {
      setErrorMsg({
        newPassword: "New password can't be same as current password",
      });
      return false;
    }
    if (!confirmPassword.trim()) {
      setErrorMsg({ confirmPassword: "Please enter confirm password" });
      return false;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg({
        confirmPassword: "Password does not match",
      });
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (isSuccess) {
      setErrorMsg({});
      setAlertText("Password updated successfully");
      setAlertType("success");
      setShowAlert(true);
    }
    if (isError) {
      setErrorMsg(error.data.message);
    }
  }, [isSuccess, isError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValidForm()) {
      const body = {
        newPassword,
        currentPassword,
        confirmPassword,
      };

      await updatePassword(body);
    }
  };

  return (
    <Layout>
      <TransitionAlerts
        text={alertText}
        alertType={alertType}
        showAlert={showAlert}
      />
      {isLoading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <div className="md:flex md:justify-center">
          <div className="md:w-1/2">
            <h1 className="text-center font-bold text-2xl">Change Password</h1>
            <div>
              <TextField
                error={errorMsg?.currentPassword ? true : false}
                helperText={errorMsg.currentPassword}
                required
                id="outlined-required"
                label="Current Password"
                type="password"
                onChange={(e) => {
                  setErrorMsg({});
                  setCurrentPassword(e.target.value);
                }}
                className="w-full mt-4"
              />

              <TextField
                error={errorMsg?.newPassword ? true : false}
                helperText={errorMsg.newPassword}
                required
                id="outlined-required"
                label="New Password"
                type="password"
                onChange={(e) => {
                  setErrorMsg({});
                  setNewPassword(e.target.value);
                }}
                className="w-full mt-4"
              />

              <TextField
                error={
                  errorMsg?.confirmPassword || errorMsg?.general ? true : false
                }
                helperText={errorMsg.confirmPassword || errorMsg?.general}
                required
                id="outlined-required"
                label="Confirm Password"
                type="password"
                onChange={(e) => {
                  setErrorMsg({});
                  setConfirmPassword(e.target.value);
                }}
                className="w-full mt-4"
              />
            </div>

            <div className="mt-4">
              <LoadingButton
                loading={isLoading}
                onClick={handleSubmit}
                className="w-full bg-green-600 text-white rounded py-2 hover:bg-green-500"
              >
                Update
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ChangePassword;

export const getServerSideProps = requireAuthentication(async (ctx) => {
  return {
    props: {},
  };
});
