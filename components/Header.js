import { useState, useEffect } from 'react';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';

const HeaderWrap = styled.div`
    background: #00a47b;
    padding: 2%;
    font-size: 1.5rem;
    .homeBtn {
        color: #fff;
    }
`;
const Header = props => {
    console.log(props);
    return (
        <HeaderWrap>
            <Link href="/">
                <a className="homeBtn">
                    <i className="fas fa-home" />
                </a>
            </Link>
            <Link href="/ssr-test">
                <a>SSR 테스트</a>
            </Link>
            <style jsx>{`
                .headerWrap {
                }
            `}</style>
        </HeaderWrap>
    );
};

export default Header;
