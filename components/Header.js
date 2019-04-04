import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { actions } from '../components/redux';
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
    > div {
        max-width: 1050px;
        margin: 0 auto;
    }
    .menuWrap {
        position: relative;
        float: right;

        .testBtn {
            font-size: 0.6em;
            display: inline-block;
            padding: 2px 10px;
            background: #014e3b;
            line-height: 1.5;
            vertical-align: middle;
            border-radius: 5px;
            cursor: pointer;
            color: #fff;
        }
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
    padding: 10px;
    background: #fff;
    .radioWrap {
        padding-bottom: 10px;
        font-size: 0.8em;
        line-height: 1.5;
        input {
            margin: 0 10px;
            vertical-align: middle;
            margin-top: -2px;
        }
    }
    .datePickerWrap {
        .react-datepicker-wrapper,
        .react-datepicker__input-container {
            width: 100%;
        }
        .react-datepicker__input-container > input {
            width: 100%;
            border-radius: 5px;
            border: 1px solid #ddd;
            padding: 0 15px;
            box-sizing: border-box;
            font-size: 0.9em;
            line-height: 1.5;
            margin-bottom: 10px;
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
            toggle: false
        };
        this.toggleFn = this.toggleFn.bind(this);
        this.formatDate = this.formatDate.bind(this);
    }
    toggleFn() {
        this.setState({
            toggle: !this.state.toggle
        });
    }
    formatDate(date) {
        var d = date,
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('');
    }
    componentDidMount() {
        const { changeDate, singleDateFn } = this.props;
        const getParameterByName = (name, url) => {
            name = name.replace(/[\[\]]/g, '\\$&');
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        };

        const dateStrFormat = date => {
            if (typeof date === 'number') date = String(date);
            if (date.indexOf('/') === -1) {
                return `${date.slice(4, 6)}/${date.slice(6, 8)}/${date.slice(0, 4)}`;
            } else {
                return `${date.slice(6, 10)}${date.slice(0, 2)}${date.slice(3, 5)}`;
            }
        };
        const addDays = (date, days) => {
            var date = new Date(date.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };
        const formatDate = date => {
            var d = date,
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
        Router.onBeforeHistoryChange = url => {
            const { searchDate, csvRequest } = this.props;
            const startDate = searchDate.startDate ? this.formatDate(searchDate.startDate) : null;
            const endDate = searchDate.endDate ? this.formatDate(searchDate.endDate) : null;

            const start = getParameterByName('start', url);
            const end = getParameterByName('end', url);
            if (start || end) {
                let csvDataArr = [];
                if (start) {
                    if (start !== startDate) changeDate(new Date(dateStrFormat(start)), 'start');
                } else changeDate(null, 'start');

                if (end) {
                    if (end !== endDate) changeDate(new Date(dateStrFormat(end)), 'end');
                } else changeDate(null, 'end');

                if (start && !end) {
                    singleDateFn(true);
                    csvDataArr = [formatDate(new Date(dateStrFormat(start)))];
                } else if (start) {
                    csvDataArr = getDates(new Date(dateStrFormat(start)), new Date(dateStrFormat(end)));
                }
                csvRequest({
                    url: '/api/',
                    path: 'data',
                    params: {
                        data: csvDataArr
                    }
                });
            }
        };
    }
    render() {
        const {
            csvLoading,
            data,
            searchDate: { startDate, endDate },
            changeDate,
            modalFlag,
            singleDate,
            singleDateFn
        } = this.props;
        const { toggle } = this.state;
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
                    if (timeRange[0] <= timeRange[1]) {
                        const diffTime = Math.abs(timeRange[1] - timeRange[0]);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        if (diffDays <= 31) {
                            savable = true;
                        } else {
                            errTxt = '기간검색은 최대 한달 입니다.';
                        }
                    } else errTxt = '시간선택이 잘못 되었습니다.';
                } else errTxt = '시간선택을 먼저 해주세요.';
            }
        }
        return (
            <HeaderWrap>
                <div className="cb_clear">
                    <div className="homeBtnWrap">
                        <Link href="/">
                            <a className="homeBtn">
                                <i className="fas fa-home" />
                            </a>
                        </Link>
                    </div>
                    <div className="menuWrap">
                        <div style={{ marginLeft: 0, float: 'left' }}>
                            <div
                                className="testBtn"
                                onClick={() => {
                                    // 데이터 파일 기간 : 2018/12/30 ~ 2019/01/29
                                    if (singleDate) {
                                        singleDateFn(!singleDate);
                                    }
                                    Router.push('/datachart?start=20181230&end=20190129');
                                }}
                            >
                                Test Btn (18/12/30 ~ 19/01/29)
                            </div>
                        </div>
                        <div style={{ marginLeft: '20px', float: 'left' }}>
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
                                        singleDateFn(!singleDate);
                                    }}
                                />
                                일일 검색
                                <input
                                    type="radio"
                                    name="dateRangeFlag"
                                    value={true}
                                    checked={singleDate}
                                    onChange={e => {
                                        singleDateFn(!singleDate);
                                    }}
                                />
                            </div>
                            <div className="datePickerWrap">
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
                            </div>
                            <SearchBtn
                                savable={savable}
                                onClick={() => {
                                    if (!savable) {
                                        //modalType, title, contents, Fn
                                        modalFlag('err', '', errTxt);
                                    } else {
                                        if (singleDate) {
                                            Router.push(`/datachart?start=${this.formatDate(startDate)}`);
                                        } else {
                                            Router.push(`/datachart?start=${this.formatDate(startDate)}&end=${this.formatDate(endDate)}`);
                                        }
                                        this.toggleFn();
                                    }
                                }}
                            >
                                검색하기
                            </SearchBtn>
                        </SearchDateWrap>
                    </div>
                </div>
            </HeaderWrap>
        );
    }
}

const mapStateToProps = state => {
    const { csvLoading, data, searchDate, singleDate } = state.baseStore;
    return {
        csvLoading,
        data,
        searchDate,
        singleDate
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
        },
        singleDateFn: flag => {
            dispatch(actions.SINGLEDATE(flag));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchProps
)(Header);
