import React, { Component } from 'react';
import Header from './Header';
import { connect } from 'react-redux';
import { actions } from '../components/redux';
import styled from 'styled-components';

import Modal from './shared/Modal';
import Loading from './shared/Loading';

const LayoutContainer = styled.div`
    padding-top: 45px;
    .containerWrap {
        max-width: 1050px;
        margin: 0 auto;
    }
`;

class Layout extends Component {
    constructor(props) {
        super(props);
        // console.log(props);
        const { data } = props;
        this.state = {
            data
        };
    }
    render() {
        const { children, modalType, csvLoading } = this.props;
        return (
            <LayoutContainer>
                <Header />
                <div className="containerWrap">{children}</div>

                {modalType && <Modal />}
                {csvLoading && <Loading />}
            </LayoutContainer>
        );
    }
}

const mapStateToProps = state => {
    const {
        csvLoading,
        data,
        modal: { modalType },
        searchDate
    } = state.baseStore;
    return {
        csvLoading,
        data,
        modalType,
        searchDate
    };
};
const mapDispatchProps = dispatch => {
    return {
        modalFlag: (modalType, title, contents, Fn) => {
            dispatch(actions.MODAL(modalType, title, contents, Fn));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchProps
)(Layout);
