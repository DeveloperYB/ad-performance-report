import Layout from '../components/Layout';
import withRequest from '../components/hoc/withRequest';
const About = props => {
    console.log(props);
    return (
        <Layout>
            <h2>안녕하세요 저는 Wavi 입니다.</h2>
        </Layout>
    );
};

export default withRequest('/static/csv/')(About);
