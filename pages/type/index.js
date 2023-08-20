import React from "react";
import Layout from "../../components/Layout/Layout";
import TypeList from "../../components/Type/TypeList";
import { requireAuthentication } from "../../resources/requireAuthentication";

const Types = () => {
  return (
    <Layout>
      <TypeList />
    </Layout>
  );
};

export default Types;

export const getServerSideProps = requireAuthentication(async (ctx) => {
  return {
    props: {},
  };
});
