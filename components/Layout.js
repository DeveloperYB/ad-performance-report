import React, { Component } from 'react';
import Header from './Header';
import { connect } from 'react-redux';
import { actions } from '../components/redux';

class Layout extends Component {
    constructor(props) {
        super(props);
        // console.log(props);
        const { data } = props;
        this.state = {
            data
        };
    }
    componentDidMount() {
        const { data } = this.state;
        const { csvRequest } = this.props;
        if (!Object.keys(data).length) {
            csvRequest({
                url: '/api/',
                path: 'data',
                params: {
                    data: []
                }
            });
        }
    }
    render() {
        const { children } = this.props;
        return (
            <div>
                <Header />
                {children}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { csvLoading, data } = state.baseStore;
    return {
        csvLoading,
        data
    };
};
const mapDispatchProps = dispatch => {
    return {
        csvRequest: apiForm => {
            dispatch({
                type: 'CSV_CALL_REQUEST',
                apiForm
            });
        },
        modalFlag: (modalType, title, contents, Fn) => {
            dispatch(actions.MODAL(modalType, title, contents, Fn));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchProps
)(Layout);
