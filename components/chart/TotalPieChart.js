import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styled from 'styled-components';

const COLORS = {
    parent: ['#6b5b95', '#956b5b', '#5b956b'],
    student: ['#d64161', '#61d641', '#4161d6'],
    teacher: ['#ff7b25', '#25ff7b', '#7b25ff'],
    view: ['#01b9ff', '#ff01b9', '#b9ff01'],
    click: ['#06c79c', '#c601ff', '#ffc601'],
    watch: ['#cb9783', '#83cb97', '#9783cb']
};
const UserBadge = styled.span`
    display: inline-block;
    margin: 0 5px;
    font-size: 0.8em;
    padding: 4px 9px;
    color: #333;
    border-radius: 10px;
    border: 3px solid ${({ act }) => (act ? `#00a47b` : `transparent`)};
    background: ${({ user }) => {
        if (COLORS[user]) {
            return COLORS[user][0];
        } else return `#000`;
    }};
    color: #fff;
    &:first-child {
        margin-left: 0;
    }
    cursor: pointer;
`;
const transKr = eng => {
    if (eng === 'parent') return '부모님';
    else if (eng === 'student') return '학생';
    else if (eng === 'teacher') return '선생님';
    else if (eng === 'view') return '조회 (View)';
    else if (eng === 'click') return '클릭 (Click)';
    else if (eng === 'watch') return '교류 (Watch)';
    else return eng;
};

const TotalPieChart = props => {
    const { data, base } = props;
    let actData = {};
    Object.keys(data).map(user => {
        Object.keys(data[user]).map(event => {
            if (actData[event]) {
                if (actData[event][user]) actData[event][user] = actData[event][user] + data[user][event];
                else actData[event][user] = data[user][event];
            } else {
                actData[event] = {};
                actData[event][user] = data[user][event];
            }
        });
    });
    const [pieAct, SetPieAct] = useState(Object.keys(base === 'user' ? data : actData)[0]);
    let showData;
    if (base === 'user') {
        showData = Object.keys(data[pieAct]).map(v => ({ name: v, value: data[pieAct][v] }));
    } else {
        showData = Object.keys(actData[pieAct]).map(v => ({ name: v, value: actData[pieAct][v] }));
    }
    if (base === 'user') console.log('showData', showData);
    return (
        <>
            <div className="tit">{base === 'user' ? '활동한 사용자별' : '분석된 액션별'} 보기 (하단 버튼 클릭)</div>
            <div>
                {Object.keys(base === 'user' ? data : actData).map((v, i) => {
                    return (
                        <UserBadge
                            key={i}
                            user={v}
                            onClick={() => {
                                if (pieAct !== v) SetPieAct(v);
                            }}
                            act={pieAct === v}
                        >
                            {transKr(v)}
                        </UserBadge>
                    );
                })}
            </div>
            <div>
                <ResponsiveContainer width={'100%'} height={300}>
                    <PieChart>
                        <Pie
                            isAnimationActive={false}
                            labelLine={false}
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index, name, percent }) => {
                                const x = 0;
                                let y = 28 * (1 + index);
                                if (index) {
                                    y += 15 * index;
                                }
                                const addComma = num => {
                                    var regexp = /\B(?=(\d{3})+(?!\d))/g;
                                    return num.toString().replace(regexp, ',');
                                };
                                return (
                                    <>
                                        <rect x={x} y={y - 6} width="13" height="13" fill={COLORS[pieAct][index]} />
                                        <text x={x + 15} y={y} fill="#000" dominantBaseline="central">
                                            {transKr(name)}
                                        </text>
                                        <text x={x + 50} y={y + 20} fill="#000" dominantBaseline="central">
                                            {addComma(value)}
                                        </text>
                                        <text x={x} y={y + 20} fill="#000" dominantBaseline="central">
                                            ({`${(percent * 100).toFixed(0)}%`})
                                        </text>
                                    </>
                                );
                            }}
                            dataKey="value"
                            data={showData}
                            cx={'65%'}
                            cy={'63%'}
                            outerRadius={100}
                        >
                            {showData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[pieAct][index]} />
                            ))}
                        </Pie>
                        {/* <Tooltip /> */}
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};

export default TotalPieChart;
