import React, { Component } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { connect } from 'react-redux';

class Index extends Component {
    render() {
        return (
            <Layout>
                <h1>안녕, Next.js</h1>
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    const { loading, data, error } = state.baseStore.toJS();
    return new Object({
        loading,
        error,
        data
    });
};
const mapDispatchProps = dispatch => {
    return {
        apiRequest: (dataInputTo, apiForm, modal) => {
            dispatch({
                type: 'API_CALL_REQUEST',
                dataInputTo,
                apiForm,
                modal
            });
        },
        kakaoRequest: (dataInputTo, apiForm) => {
            dispatch({
                type: 'KAKAO_IMG_CALL_REQUEST',
                dataInputTo,
                apiForm
            });
        },
        modalFlag: (flag, modalType, title, contents, size, Fn) => {
            dispatch(actions.MODAL(flag, modalType, title, contents, size, Fn));
        },
        errorHandler: flag => {
            dispatch(actions.ERRORHANDLER(flag));
        },
        imgInputQueFn: (dom, url, origin = '') => {
            dispatch(actions.IMGINPUTQUE(dom, url, origin));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchProps
)(Index);
