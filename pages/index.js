import axios from "axios";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { requireAuthentication } from "../resources/requireAuthentication";

function Home() {

  return (
    <Layout>
      <div>
        <div>dashboard</div>
      </div>
    </Layout>
  );
}

export default Home;

export const getServerSideProps = requireAuthentication(async (ctx) => {
  return {
    props: {},
  };
});
