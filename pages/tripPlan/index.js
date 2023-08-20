import Layout from "../../components/Layout/Layout";
import PlanList from "../../components/TripPlan/PlanList";
import { requireAuthentication } from "../../resources/requireAuthentication";

const TripPlan = () => {
    return (
        <Layout>
            <PlanList />
        </Layout>
    );
};

export default TripPlan;

export const getServerSideProps = requireAuthentication(async (ctx) => {
    return {
        props: {},
    };
});
