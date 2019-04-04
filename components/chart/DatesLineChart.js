import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Router from 'next/router';
import styled from 'styled-components';

const CustomToolTip = styled.div`
    background: #fff;
    border: 1px solid #00a47b;
    opacity: 0.7;
    line-height: 1.2;
    font-size: 13px;
    padding: 10px;
    .intro {
        font-weight: bold;
        margin-bottom: 10px;
    }
`;
const addComma = num => {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(regexp, ',');
};
const COLORS = [
    '#e6194B',
    '#3cb44b',
    '#ffe119',
    '#4363d8',
    '#f58231',
    '#911eb4',
    '#42d4f4',
    '#f032e6',
    '#bfef45',
    '#fabebe',
    '#469990',
    '#e6beff',
    '#9A6324',
    '#fffac8',
    '#800000',
    '#aaffc3',
    '#808000',
    '#ffd8b1',
    '#000075',
    '#a9a9a9'
];
const UserBadge = styled.span`
    display: inline-block;
    margin: 5px;
    font-size: 0.8em;
    padding: 4px 9px;
    border-radius: 10px;
    border: 3px solid
        ${({ idx }) => {
            if (COLORS[idx]) {
                return COLORS[idx];
            } else return `#000`;
        }};
    background: ${({ act, idx }) => {
        if (!act) return `#fff`;
        if (COLORS[idx]) {
            return COLORS[idx];
        } else return `#000`;
    }};
    color: ${({ act, idx }) => {
        if (act) return `#fff`;
        if (COLORS[idx]) {
            return COLORS[idx];
        } else return `#000`;
    }};
    &:first-child {
        margin-left: 0;
    }
    cursor: pointer;
`;
const transKr = eng => {
    let txt = eng.split('_');
    const fn = et => {
        if (et === 'parent') return '부모님';
        else if (et === 'student') return '학생';
        else if (et === 'teacher') return '선생님';
        else if (et === 'view') return '조회';
        else if (et === 'click') return '클릭';
        else if (et === 'watch') return '교류';
        else return et;
    };
    txt = txt.map(t => fn(t));
    return txt.join(', ');
};
const DatesLineChart = props => {
    const totalActKey = Object.keys(props.data[0]).filter(k => k !== 'date' && k);

    const [actKey, setActKey] = useState(
        Object.keys(props.data[0])
            .filter(k => k !== 'date' && k)
            .map(v => {
                return {
                    name: v,
                    flag: true
                };
            })
    );

    const setActKeyFn = idx => {
        let newAct = [...actKey];
        newAct[idx] = {
            ...newAct[idx],
            flag: !newAct[idx].flag
        };
        setActKey(newAct);
    };
    return (
        <>
            <div className="tit">날짜별 행동 수치 그래프</div>
            <div>하단 버튼으로 원하는 행동 수치를 골라보세요.</div>
            <div style={{ margin: '5px 0 20px' }}>
                {totalActKey.map((k, i) => {
                    return (
                        <UserBadge
                            key={i}
                            idx={i}
                            onClick={() => {
                                setActKeyFn(i);
                            }}
                            act={actKey[i].flag}
                        >
                            {transKr(k)}
                        </UserBadge>
                    );
                })}
            </div>
            <div>
                <ResponsiveContainer width={'100%'} height={350}>
                    <LineChart data={props.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active) {
                                    return (
                                        <CustomToolTip>
                                            <div className="intro">{label}</div>
                                            {payload.map((v, i) => {
                                                return (
                                                    <div key={i} className="label" style={{ color: v.color }}>{`${transKr(v.name)} : ${addComma(
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
                        <Legend
                            formatter={(value, entry) => {
                                const { color } = entry;
                                return <span style={{ color }}>{transKr(value)}</span>;
                            }}
                        />
                        {actKey.map((key, idx) => {
                            if (key.flag) return <Line key={idx} type="monotone" dataKey={key.name} stroke={COLORS[idx]} activeDot={{ r: 8 }} />;
                        })}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};

export default DatesLineChart;
