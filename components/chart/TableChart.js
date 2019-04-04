import React from 'react';
import styled from 'styled-components';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

const TableChart = props => {
    return (
        <>
            <div className="tit">{props.tit}</div>
            <div>
                <ReactTable {...props} />
            </div>
        </>
    );
};

export default TableChart;
