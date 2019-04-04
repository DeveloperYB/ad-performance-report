import React, { Component } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { actions } from '../components/redux';
import TotalPieChart from '../components/chart/TotalPieChart';
import TotalBarChart from '../components/chart/TotalBarChart';
import TableChart from '../components/chart/TableChart';
import DatesLineChart from '../components/chart/DatesLineChart';

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
const PinterestWrap = styled.div`
    width: 100%;
    overflow: hidden;
    column-count: 2;
    column-gap: 0;
    column-fill: auto;
    > .item {
        column-break-inside: avoid;
        padding: 1%;
    }
    @media (max-width: 768px) {
        column-count: 1;
    }
`;
const Divider = styled.div`
    height: 1px;
    background: #ddd;
    width: 98%;
    margin: ${({ div = 0 }) => `${div}px`} auto;
`;
const RowDiv = styled.div`
    display: block;
    overflow: hidden;
    box-sizing: border-box;
`;
const ColDiv = styled.div`
    overflow: hidden;
    float: left;
    width: ${({ col }) => Number(100 / col - 2)}%;
    margin: 1%;
    @media (max-width: 768px) {
        width: 100%;
    }
`;
const UserBadge = styled.span`
    display: inline-block;
    margin: 0 5px;
    font-size: 0.8em;
    padding: 5px 10px;
    border-radius: 10px;
    background: ${({ user }) => {
        if (user === 'parent') {
            return `#6b5b95`;
        } else if (user === 'student') {
            return `#d64161`;
        } else if (user === 'teacher') {
            return `#ff7b25`;
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
const Paper = styled.div`
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    box-shadow: 0 2px 0 -1px rgba(0, 0, 0, 0.1);
    padding: 20px;
    box-sizing: border-box;
`;
const ChartContainer = styled.div`
    font-size: 14px;
    .tit {
        font-size: 1.1em;
        font-weight: bold;
        margin-bottom: 10px;
    }
    .eachUserActWrap {
        margin: 20px 0;
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
        const { firstRender } = this.state;
        const {
            csvLoading,
            data: { data, searchRange = [], totalData },
            searchDate
        } = this.props;
        let startTimeTxt,
            endTimeTxt,
            eventArr = [], //Table Var
            userArr = [], //Table Var
            TableTotalData, //Table Var
            TableTotalCol,
            DatesData;
        if (searchRange.length) {
            startTimeTxt = String(searchRange[0]);
            startTimeTxt = `${startTimeTxt.slice(2, 4)}년 ${startTimeTxt.slice(4, 6)}월 ${startTimeTxt.slice(6, 8)}일`;
            if (searchRange.length > 1) {
                endTimeTxt = String(searchRange[searchRange.length - 1]);
                endTimeTxt = `${endTimeTxt.slice(2, 4)}년 ${endTimeTxt.slice(4, 6)}월 ${endTimeTxt.slice(6, 8)}일`;
            }

            //차트 광고 분석 합계,평균 표
            TableTotalData = Object.keys(totalData)
                .map(name => {
                    const newObj = {
                        name
                    };
                    userArr.push(name);
                    Object.keys(totalData[name]).map(event => {
                        newObj[event] = totalData[name][event];
                        if (eventArr.indexOf(event) === -1) eventArr.push(event);
                    });
                    return newObj;
                })
                .map(v => {
                    eventArr.map(evt => {
                        if (!v[evt]) {
                            v[evt] = 0;
                            v['average_' + evt] = 0;
                        } else {
                            v['average_' + evt] = Math.floor(v[evt] / searchRange.length);
                            v[evt] = v[evt];
                        }
                    });
                    return v;
                });
            TableTotalCol = [
                {
                    Header: '사용자',
                    accessor: 'name',
                    Cell: props => <div style={{ textAlign: 'center' }}>{this.transKr(props.value)}</div>
                }
            ];
            eventArr.map(v => {
                let Header;
                if (v === 'view') {
                    Header = '조회';
                } else if (v === 'click') {
                    Header = '클릭';
                } else if (v === 'watch') {
                    Header = '교류';
                }
                TableTotalCol.push({
                    Header,
                    accessor: v,
                    Cell: props => <div style={{ textAlign: 'center' }}>{props.value}</div>
                });
                if (searchRange.length > 1) {
                    Header = '평균 ' + Header;
                    TableTotalCol.push({
                        Header,
                        accessor: `average_${v}`,
                        Cell: props => <div style={{ textAlign: 'center' }}>{props.value}</div>
                    });
                }
            });

            DatesData = Object.keys(data).map(date => {
                let obj = {
                    date: `${date.slice(0, 4)}/${date.slice(4, 6)}/${date.slice(6, 8)}`
                };
                data[date].map(val => {
                    if (obj[`${val.user}_${val.event}`]) obj[`${val.user}_${val.event}`] = obj[`${val.user}_${val.event}`] + Number(val.count);
                    else obj[`${val.user}_${val.event}`] = Number(val.count);
                });
                userArr.map(user => {
                    eventArr.map(event => {
                        if (!obj[`${user}_${event}`]) obj[`${user}_${event}`] = 0;
                    });
                });
                return obj;
            });
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
                                <PinterestWrap>
                                    <div className="item">
                                        <Paper>
                                            <div className="tit">광고 분석 기간</div>
                                            <div>
                                                {startTimeTxt}{' '}
                                                {endTimeTxt ? (
                                                    <>
                                                        ~ {endTimeTxt} ({searchRange.length}일 간의 데이터)
                                                    </>
                                                ) : (
                                                    '하루'
                                                )}
                                            </div>
                                        </Paper>
                                    </div>
                                    <div className="item">
                                        <Paper>
                                            <div className="tit" style={{ marginBottom: 0 }}>
                                                사용자별 행동 평균 및 합계 요약정보
                                            </div>
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
                                                                            <b mb={10}>{this.transKr(ev)}</b>
                                                                            <br />
                                                                            {searchRange.length > 1 && (
                                                                                <>
                                                                                    평균{' '}
                                                                                    {this.addComma(Math.floor(totalData[v][ev] / searchRange.length))}{' '}
                                                                                    건 /{' '}
                                                                                </>
                                                                            )}
                                                                            총 {this.addComma(totalData[v][ev])} 건
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </Paper>
                                    </div>
                                    <div className="item">
                                        <Paper>
                                            <TotalBarChart data={totalData} range={searchRange.length} />
                                        </Paper>
                                    </div>
                                    <div className="item">
                                        <Paper>
                                            <TotalPieChart data={totalData} base="user" />
                                        </Paper>
                                    </div>
                                    <div className="item">
                                        <Paper>
                                            <TotalPieChart data={totalData} base="event" />
                                        </Paper>
                                    </div>
                                </PinterestWrap>
                                <RowDiv>
                                    <ColDiv col={1}>
                                        <Paper>
                                            <TableChart
                                                tit={'광고 분석 합계,평균 표'}
                                                data={TableTotalData}
                                                columns={TableTotalCol}
                                                defaultPageSize={TableTotalData.length}
                                                showPagination={false}
                                                className="-striped -highlight"
                                            />
                                        </Paper>
                                    </ColDiv>
                                    <ColDiv col={1}>
                                        <Paper>
                                            <DatesLineChart data={DatesData} />
                                        </Paper>
                                    </ColDiv>
                                    <ColDiv col={1}>
                                        <Paper>
                                            <TableChart
                                                tit={'날짜별 광고 분석표'}
                                                data={DatesData}
                                                columns={Object.keys(DatesData[0]).map(key => {
                                                    const tk = eng => {
                                                        let txt = eng.split('_');
                                                        txt = txt.map(t => {
                                                            let re = this.transKr(t);
                                                            if (re.indexOf(' (') !== -1) re = re.split(' (')[0];
                                                            return re;
                                                        });
                                                        return txt.join(', ');
                                                    };
                                                    return {
                                                        Header: key === 'date' ? '날짜' : tk(key),
                                                        accessor: key,
                                                        Cell: props => <div style={{ textAlign: 'center' }}>{props.value}</div>
                                                    };
                                                })}
                                                defaultPageSize={DatesData.length >= 10 ? 10 : DatesData.length}
                                                // showPaginationBottom={false}
                                                className="-striped -highlight"
                                            />
                                        </Paper>
                                    </ColDiv>
                                </RowDiv>
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
