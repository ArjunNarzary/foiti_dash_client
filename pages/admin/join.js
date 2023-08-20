import { Alert, AlertTitle, Button } from "@mui/material";
import React from "react";
import JoinRequestTable from "../../components/JoinRequestTable/JoinRequestTable";
import Layout from "../../components/Layout/Layout";
import { requireAuthentication } from "../../resources/requireAuthentication";

const join = () => {
  return (
    <Layout>
      <JoinRequestTable />
    </Layout>
  );
};

export default join;

export const getServerSideProps = requireAuthentication(async (ctx) => {
  return {
    props: {},
  };
});
