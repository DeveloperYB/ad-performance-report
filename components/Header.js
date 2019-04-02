import React, { Component } from 'react';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { actions } from '../components/redux';

import 'react-datepicker/dist/react-datepicker.css';

const HeaderWrap = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    line-height: 45px;
    background: #00a47b;
    padding: 0 2%;
    font-size: 1.5em;
    overflow: hidden;
    .homeBtnWrap {
        float: left;
    }
    .menuWrap {
        float: right;
    }
    i {
        color: #fff;
        cursor: pointer;
    }
`;
const SearchDateWrap = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    border: 1px solid #00a47b;
`;
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggle: false,
            singleDate: false
        };
        this.toggleFn = this.toggleFn.bind(this);
        this.singleDateFn = this.singleDateFn.bind(this);
    }
    toggleFn() {
        this.setState({
            toggle: !this.state.toggle
        });
    }
    singleDateFn() {
        this.setState({
            singleDate: !this.state.singleDate
        });
    }
    render() {
        const { csvLoading, data, searchDate } = this.props;
        const { toggle, singleDate } = this.state;
        // console.log(this);
        return (
            <HeaderWrap>
                <div className="homeBtnWrap">
                    <Link href="/">
                        <a className="homeBtn">
                            <i className="fas fa-home" />
                        </a>
                    </Link>
                </div>
                <div className="menuWrap">
                    <i className="fas fa-search" />
                </div>
                <SearchDateWrap toggle={toggle}>
                    <DatePicker
                        selected={searchDate.startDate}
                        selectsStart
                        startDate={searchDate.startDate}
                        endDate={searchDate.endDate}
                        onChange={this.handleChangeStart}
                        dateFormat="yyyyMMdd"
                        placeholderText="Start Date"
                        readOnly={csvLoading}
                    />

                    <DatePicker
                        selected={searchDate.endDate}
                        selectsEnd
                        startDate={searchDate.startDate}
                        endDate={searchDate.endDate}
                        onChange={this.handleChangeEnd}
                        dateFormat="yyyyMMdd"
                        placeholderText="End Date"
                        readOnly={csvLoading}
                    />
                </SearchDateWrap>
            </HeaderWrap>
        );
    }
}

const mapStateToProps = state => {
    const { csvLoading, data, searchDate } = state.baseStore;
    return {
        csvLoading,
        data,
        searchDate
    };
};
const mapDispatchProps = dispatch => {
    return {
        modalFlag: (modalType, title, contents, Fn) => {
            dispatch(actions.MODAL(modalType, title, contents, Fn));
        },
        changeDate: (startDate, endDte) => {
            dispatch(actions.CHANGEDATE(startDate, endDte));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchProps
)(Header);
