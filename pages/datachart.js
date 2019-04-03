import React, { Component } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { actions } from '../components/redux';
import moment from 'moment';

const ErrWrap = styled.div`
    .ico {
        font-size: 4rem;
        margin-bottom: 20px;
        ${({ ssr }) => (ssr ? `color: #7f7fdc;` : `color: #ea7272;`)}
    }
    font-size: 1.5rem;
    text-align: center;
    padding: 50px 0;
    line-height: 1.5;
`;

class DataSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstRender: true
        };
        this.searchFn = this.searchFn.bind(this);
        this.addComma = this.addComma.bind(this);
        this.transKr = this.transKr.bind(this);
    }
    searchFn(start, end) {
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
        let csvDataArr = [];
        // 데이터 파일 기간 : 2018/12/30 ~ 2019/01/29 === 공백 [] 와 동일
        if (start || end) {
            if (!end) {
                csvDataArr = [formatDate(start)];
            } else if (start) {
                csvDataArr = getDates(start, end);
            }
        } else {
            if (startDate && endDate) {
                csvDataArr = getDates(startDate, endDate);
            }
            if (startDate && !endDate) {
                csvDataArr = [formatDate(startDate)];
            }
        }
        csvRequest({
            url: '/api/',
            path: 'data',
            params: {
                data: csvDataArr
            }
        });
    }
    static async getInitialProps({ query }) {
        const { start, end } = query;
        return { start, end };
    }
    componentDidMount() {
        const { start, end, changeDate, singleDateFn } = this.props;
        const dateStrFormat = date => {
            if (typeof date === 'number') date = String(date);
            if (date.indexOf('/') === -1) {
                return `${date.slice(4, 6)}/${date.slice(6, 8)}/${date.slice(0, 4)}`;
            } else {
                return `${date.slice(6, 10)}${date.slice(0, 2)}${date.slice(3, 5)}`;
            }
        };
        this.setState({
            firstRender: false
        });
        if (start || end) {
            if (start) changeDate(new Date(dateStrFormat(start)), 'start');
            if (end) changeDate(new Date(dateStrFormat(end)), 'end');
            if (!end) {
                singleDateFn(true);
                this.searchFn(new Date(dateStrFormat(start)));
            } else {
                this.searchFn(new Date(dateStrFormat(start)), new Date(dateStrFormat(end)));
            }
        }
    }
    // componentDidUpdate(prevProps) {
    //     if (JSON.stringify(prevProps.searchDate) !== JSON.stringify(this.props.searchDate)) {
    //         console.log(this);
    //         // this.searchFn();
    //     }
    // }
    addComma(num) {
        var regexp = /\B(?=(\d{3})+(?!\d))/g;
        return num.toString().replace(regexp, ',');
    }
    transKr(eng) {
        if (eng === 'parent') return '부모님';
        else if (eng === 'student') return '학생';
        else if (eng === 'teacher') return '선생님';
        else if (eng === 'view') return '조회 (View)';
        else if (eng === 'click') return '클릭 (Click)';
        else if (eng === 'watch') return '교류 (Watch)';
        else return eng;
    }
    render() {
        console.log(this);
        const { firstRender } = this.state;
        const {
            csvLoading,
            data: { data, searchRange = [], totalData },
            searchDate
        } = this.props;
        let startTimeTxt, endTimeTxt;
        if (searchRange.length) {
            console.log(csvLoading, data, totalData, searchDate);
            startTimeTxt = String(searchRange[0]);
            startTimeTxt = `${startTimeTxt.slice(2, 4)}년 ${startTimeTxt.slice(4, 6)}월 ${startTimeTxt.slice(6, 8)}일`;
            if (searchRange.length > 1) {
                endTimeTxt = String(searchRange[searchRange.length - 1]);
                endTimeTxt = `${endTimeTxt.slice(2, 4)}년 ${endTimeTxt.slice(4, 6)}월 ${endTimeTxt.slice(6, 8)}일`;
            }
        }
        return (
            <Layout>
                {firstRender || csvLoading ? (
                    <ErrWrap ssr={true}>
                        <div className="ico">
                            <i className="fas fa-database" />
                        </div>
                        데이터를 불러오는 중 입니다.
                    </ErrWrap>
                ) : (
                    <>
                        {startTimeTxt ? (
                            <ChartContainer>
                                <div className="blWrap">
                                    <div className="bl6">
                                        <div className="tit">광고 분석 기간</div>
                                        <Dmb mb={15}>
                                            {startTimeTxt}{' '}
                                            {endTimeTxt ? (
                                                <>
                                                    ~ {endTimeTxt} ({searchRange.length}일 간의 데이터)
                                                </>
                                            ) : (
                                                '하루'
                                            )}
                                        </Dmb>
                                        <div className="tit">활동한 사용자</div>
                                        <div>
                                            {Object.keys(totalData).map((v, i) => {
                                                return (
                                                    <UserBadge key={i} user={v}>
                                                        {this.transKr(v)}
                                                    </UserBadge>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="bl6">
                                        <div className="tit">사용자 별 액션 합계</div>
                                        <div>
                                            {Object.keys(totalData).map((v, i) => {
                                                return (
                                                    <div className="cb_clear eachUserActWrap" key={i}>
                                                        <div className="badgeWrap">
                                                            <UserBadge key={i} user={v}>
                                                                {this.transKr(v)}
                                                            </UserBadge>
                                                        </div>
                                                        <div className="dataWrap">
                                                            {Object.keys(totalData[v]).map((ev, ei) => {
                                                                return (
                                                                    <div key={ei}>
                                                                        <span>{this.transKr(ev)}</span> : <b>{this.addComma(totalData[v][ev])} 건</b>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="blWrap">
                                    <div className="bl6">
                                        <ul>
                                            <li style={{ marginBottom: '5px' }}>
                                                사용자로서 광고 성과의 통계에 대한 합계 및 평균값 요약 정보를 보고 싶다.
                                            </li>
                                            <li style={{ marginBottom: '5px' }}>
                                                사용자로서 모든 일자에 대한 합계 및 평균값 광고 성과 통계를 확인하고 싶다.
                                            </li>
                                            <li style={{ marginBottom: '5px' }}>
                                                사용자로서 광고 성과 통계를 역할별(부모님, 학생, 선생님)로 필터링을 하고 싶다.
                                            </li>
                                            <li style={{ marginBottom: '5px' }}>사용자로서 광고 성과 통계를 기간으로 필터링 하고 싶다.</li>
                                            <li style={{ marginBottom: '5px' }}>
                                                사용자로서 광고 성과 통계는 표와 차트 형태 등 효과적으로 시각화하여 보고 싶다.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </ChartContainer>
                        ) : (
                            <ErrWrap>
                                <div className="ico">
                                    <i className="fas fa-exclamation-triangle" />
                                </div>
                                잘못된 경로로 해당 페이지 접속 또는
                                <br />
                                잘못된 기간 검색으로 데이터를 찾을 수 없습니다.
                            </ErrWrap>
                        )}
                    </>
                )}
            </Layout>
        );
    }
}
const UserBadge = styled.span`
    display: inline-block;
    margin: 0 5px;
    font-size: 0.8em;
    padding: 5px 10px;
    color: #333;
    border-radius: 10px;
    background: ${({ user }) => {
        if (user === 'parent') {
            return `#31454a`;
        } else if (user === 'student') {
            return `#f7cb08`;
        } else if (user === 'teacher') {
            return `#ff605a`;
        } else return `#000`;
    }};
    color: #fff;
    &:first-child {
        margin-left: 0;
    }
`;
const Dmb = styled.div`
    margin-bottom: ${({ mb }) => (mb ? `${mb}px;` : `0;`)};
`;
const ChartContainer = styled.div`
    .blWrap {
        display: flex;
        @media (max-width: 768px) {
            flex-direction: column;
        }
    }
    font-size: 14px;
    .bl12,
    .bl6 {
        background-color: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        box-shadow: 0 2px 0 -1px rgba(0, 0, 0, 0.1);
        padding: 20px;
        box-sizing: border-box;
        margin: 1.5%;
        &.bl12 {
            width: 100%;
            margin: 1% 0;
        }
        &.bl6 {
            width: 47%;
            @media (max-width: 768px) {
                width: 95%;
                margin: 1% 2.5%;
            }
        }
        .tit {
            font-size: 1.1em;
            font-weight: bold;
            margin-bottom: 10px;
        }
    }
    .eachUserActWrap {
        margin: 10px 0;
        &:last-child {
            margin-bottom: 0;
        }
        .badgeWrap,
        .dataWrap {
            float: left;
            &.badgeWrap {
                width: 15%;
                @media (max-width: 768px) {
                    width: 25%;
                }
            }
            &.dataWrap {
                width: 85%;
                @media (max-width: 768px) {
                    width: 75%;
                }
                > div {
                    margin-bottom: 5px;
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
        }
    }
`;
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
        },
        singleDateFn: flag => {
            dispatch(actions.SINGLEDATE(flag));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchProps
)(DataSearch);
