import React from 'react';
import { connect } from 'react-redux';
const Modal = props => {
    return <div>???</div>;
};
const mapStateToProps = state => {
    const { modal } = state.baseStore;
    return {
        modal
    };
};
export default connect(mapStateToProps)(Modal);
