import Layout from "../../components/Layout/Layout";
import PlaceList from "../../components/Place/PlaceList";
import { requireAuthentication } from "../../resources/requireAuthentication";

const Place = () => {
  return (
    <Layout>
      <PlaceList />
    </Layout>
  );
};

export default Place;

export const getServerSideProps = requireAuthentication(async (ctx) => {
  return {
    props: {},
  };
});
