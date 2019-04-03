import React, { Component } from 'react';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { actions } from '../components/redux';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

const HeaderWrap = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 96%;
    line-height: 45px;
    background: #00a47b;
    padding: 0 2%;
    font-size: 1.5em;
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
    display: ${({ toggle }) => `${toggle ? 'block' : 'none'}`};
    position: absolute;
    top: 44px;
    right: 0;
    border: 1px solid #00a47b;
    line-height: 1;
    font-size: 0.8em;
    padding: 1.5%;
    .radioWrap {
        padding-bottom: 10px;
        font-size: 0.8em;
        line-height: 1.5;
        input {
            margin: 0 10px;
            vertical-align: middle;
            margin-top: -3px;
        }
    }
`;

const SearchBtn = styled.div`
    background: #00a47b;
    border: 1px solid #00a47b;
    font-size: 0.7em;
    text-align: center;
    color: #fff;
    line-height: 2;
    margin-top: 10px;
    cursor: pointer;
    border-radius: 5px;
    &:hover {
        color: #00a47b;
        background: #fff;
    }
    ${({ savable }) => {
        if (!savable)
            return `
        opacity:0.5;
        cursor: not-allowed;
        `;
    }}
`;
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggle: true,
            singleDate: false
        };
        this.toggleFn = this.toggleFn.bind(this);
        this.singleDateFn = this.singleDateFn.bind(this);
        this.searchFn = this.searchFn.bind(this);
    }
    searchFn() {
        const { data } = this.state;
        const {
            csvRequest,
            searchDate: { startDate, endDate }
        } = this.props;
        const addDays = (date, days) => {
            var date = new Date(date.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };
        const formatDate = date => {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            return Number([year, month, day].join(''));
        };
        const getDates = (startDate, stopDate) => {
            var dateArray = new Array();
            var currentDate = startDate;
            while (currentDate <= stopDate) {
                dateArray.push(formatDate(new Date(currentDate)));
                currentDate = addDays(currentDate, 1);
            }
            return dateArray;
        };
        let csvDataArr = [];
        if (startDate && endDate) {
            csvDataArr = getDates(startDate, endDate);
        }
        if (startDate && !endDate) {
            csvDataArr = [formatDate(startDate)];
        }
        console.log('csvDataArr', csvDataArr);
        csvRequest({
            url: '/api/',
            path: 'data',
            params: {
                data: csvDataArr
            }
        });
    }
    componentDidMount() {
        // 데이터 파일 기간 : 2018/12/30 ~ 2019/01/29
        // 기간이 1월 이라고 가정하에 페이지 시작.
        this.props.changeDate(new Date('01/31/2019'), 'start');
        // this.props.changeDate(new Date('01/31/2019'), 'start');
        this.props.changeDate(new Date('01/31/2019'), 'end');
        //this.searchFn();
    }
    toggleFn() {
        this.setState({
            toggle: !this.state.toggle
        });
    }
    singleDateFn() {
        let newState = {
            singleDate: !this.state.singleDate
        };
        if (!this.state.singleDate) {
            this.props.changeDate(null, 'end');
        }
        this.setState(newState);
    }
    render() {
        const {
            csvLoading,
            data,
            searchDate: { startDate, endDate },
            changeDate,
            modalFlag
        } = this.props;
        const { toggle, singleDate } = this.state;
        let savable = false;
        let errTxt = '';
        //startDate, endDate
        if (startDate || endDate) {
            let timeRange = [null, null];
            if (startDate) timeRange[0] = new Date(startDate).getTime();
            if (endDate) timeRange[1] = new Date(endDate).getTime();

            if (singleDate) {
                if (timeRange[0]) savable = true;
                else errTxt = '시간선택을 먼저 해주세요.';
            } else {
                if (timeRange[0] && timeRange[1]) {
                    if (timeRange[0] <= timeRange[1]) savable = true;
                    else errTxt = '시간선택이 잘못 되었습니다.';
                } else errTxt = '시간선택을 먼저 해주세요.';
            }
        }
        console.log(savable, errTxt);
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
                    <i className="fas fa-search" onClick={this.toggleFn} />
                </div>
                <SearchDateWrap toggle={toggle}>
                    <div className="radioWrap">
                        기간 검색
                        <input
                            type="radio"
                            name="dateRangeFlag"
                            value={false}
                            checked={!singleDate}
                            onChange={e => {
                                this.singleDateFn();
                            }}
                        />
                        일일 검색
                        <input
                            type="radio"
                            name="dateRangeFlag"
                            value={true}
                            checked={singleDate}
                            onChange={e => {
                                this.singleDateFn();
                            }}
                        />
                    </div>
                    {singleDate ? (
                        <DatePicker
                            selected={startDate}
                            onChange={date => changeDate(date, 'single')}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Search Date"
                            readOnly={csvLoading}
                        />
                    ) : (
                        <>
                            <DatePicker
                                selected={startDate}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                onChange={date => changeDate(date, 'start')}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Start Date"
                                readOnly={csvLoading}
                            />
                            <DatePicker
                                selected={endDate}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                onChange={date => changeDate(date, 'end')}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="End Date"
                                readOnly={csvLoading}
                            />
                        </>
                    )}
                    <SearchBtn
                        savable={savable}
                        onClick={() => {
                            if (!savable) {
                                //modalType, title, contents, Fn
                                modalFlag('err', '', errTxt);
                            } else {
                                this.searchFn();
                            }
                        }}
                    >
                        검색하기
                    </SearchBtn>
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
        csvRequest: apiForm => {
            dispatch({
                type: 'CSV_CALL_REQUEST',
                apiForm
            });
        },
        modalFlag: (modalType, title, contents, Fn) => {
            dispatch(actions.MODAL(modalType, title, contents, Fn));
        },
        changeDate: (date, flag) => {
            dispatch(actions.CHANGEDATE(date, flag));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchProps
)(Header);
