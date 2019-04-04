import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import styled from 'styled-components';

const COLORS = {
    parent: ['#6b5b95', '#956b5b', '#5b956b'],
    student: ['#d64161', '#61d641', '#4161d6'],
    teacher: ['#ff7b25', '#25ff7b', '#7b25ff'],
    view: ['#01b9ff', '#ff01b9', '#b9ff01'],
    click: ['#06c79c', '#c601ff', '#ffc601'],
    watch: ['#cb9783', '#83cb97', '#9783cb']
};
const CustomToolTip = styled.div`
    background: #fff;
    border: 1px solid #00a47b;
    opacity: 0.7;
    line-height: 1.2;
    font-size: 13px;
    padding: 10px;
    .intro {
        font-weight: bold;
        margin-bottom: 8px;
    }
`;
const addComma = num => {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(regexp, ',');
};
const transKr = eng => {
    if (eng === 'parent') return '부모님';
    else if (eng === 'student') return '학생';
    else if (eng === 'teacher') return '선생님';
    else if (eng === 'view') return '조회 (View)';
    else if (eng === 'click') return '클릭 (Click)';
    else if (eng === 'watch') return '교류 (Watch)';
    else return eng;
};

const TotalBarChart = props => {
    const { range } = props;
    const eventArr = [];
    let data = Object.keys(props.data)
        .map(name => {
            const newObj = {
                name
            };
            Object.keys(props.data[name]).map(event => {
                newObj[event] = props.data[name][event];
                if (eventArr.indexOf(event) === -1) eventArr.push(event);
            });
            return newObj;
        })
        .map(v => {
            eventArr.map(evt => {
                if (!v[evt]) v[evt] = 0;
                else v[evt] = Math.floor(v[evt] / range);
            });
            return v;
        });
    return (
        <>
            <div className="tit">각 사용자 행동별 평균차트</div>
            <div>
                <ResponsiveContainer width={'100%'} height={200}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tickFormatter={val => transKr(val)} />
                        <YAxis />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active) {
                                    return (
                                        <CustomToolTip>
                                            <div className="intro">{transKr(label)}</div>
                                            {payload.map((v, i) => {
                                                return (
                                                    <div key={i} className="label" style={{ color: v.fill }}>{`${transKr(v.name)} : ${addComma(
                                                        v.value
                                                    )}`}</div>
                                                );
                                            })}
                                        </CustomToolTip>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend formatter={val => transKr(val)} />
                        {eventArr.map((evt, i) => {
                            return <Bar key={i} dataKey={evt} fill={COLORS[evt][0]} />;
                        })}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};
export default TotalBarChart;
