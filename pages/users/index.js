import React from "react";
import Layout from "../../components/Layout/Layout";
import UserList from "../../components/User/UserList";
import { requireAuthentication } from "../../resources/requireAuthentication";

const Users = () => {
  return (
    <Layout>
      <UserList />
    </Layout>
  );
};

export default Users;

export const getServerSideProps = requireAuthentication(async (ctx) => {
  return {
    props: {},
  };
});
