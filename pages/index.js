import React, { Component } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import styled from 'styled-components';

const Container = styled.div`
    padding: 0 5%;
    text-align: center;
    > div {
        margin-bottom: 10px;
    }
    .tit {
        font-size: 30px;
        font-weight: bold;
        padding: 20px 0;
    }
    .date {
        font-weight: bold;
    }
    .info {
        display: inline-block;
        text-align: left;
    }
    .chartTit {
        margin-top: 25px;
        font-weight: bold;
    }
    .chartInfo {
        display: inline-block;
        text-align: left;
        > div {
            font-size: 0.85em;
            margin-bottom: 5px;
        }
    }
`;

class Index extends Component {
    render() {
        return (
            <Layout>
                <Container>
                    <div className="tit">광고 성과 보고서</div>
                    <div className="date">데이터 기간은 2018/12/30 ~ 2019/01/29 까지 입니다.</div>
                    <div className="info">
                        우측 상단 테스트 버튼 또는 데이터 기간(2018/12/30 ~ 2019/01/29)
                        <br />
                        기간검색 또는 일일 검색으로 검색하시면 됩니다.
                    </div>
                    <div className="chartTit">검색을 통해 볼 수 있는 정보 및 기능</div>
                    <div className="chartInfo">
                        <div>1. 광고 성과의 통계에 대한 합계 및 평균값 요약 정보</div>
                        <div>2. 모든 일자에 대한 합계 및 평균값 광고 성과 통계</div>
                        <div>3. 광고 성과 통계를 역할별로 필터링</div>
                        <div>4. 광고 성과 통계를 기간으로 필터링</div>
                        <div>5. 광고 성과 통계는 표와 차트 형태 등 효과적으로 시각화</div>
                    </div>
                </Container>
            </Layout>
        );
    }
}

export default Index;
