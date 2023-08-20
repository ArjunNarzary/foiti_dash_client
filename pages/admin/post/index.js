import React from "react";
import Layout from "../../../components/Layout/Layout";
import UserPosts from "../../../components/Post/UserPosts";
import { requireAuthentication } from "../../../resources/requireAuthentication";

const index = () => {
  return (
    <Layout>
      <UserPosts />
    </Layout>
  );
};

export default index;

export const getServerSideProps = requireAuthentication(async (ctx) => {
  return {
    props: {},
  };
});
