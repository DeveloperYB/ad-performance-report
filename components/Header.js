import Link from 'next/link';

const linkStyle = {
    marginRight: '1rem'
};
const Header = () => {
    return (
        <div className="headerWrap">
            <div>
                <Link href="/">
                    <a style={linkStyle}>홈</a>
                </Link>
                <Link href="/total">
                    <a style={linkStyle}>소개</a>
                </Link>
                <Link href="/ssr-test">
                    <a style={linkStyle}>SSR 테스트</a>
                </Link>
            </div>
            <style jsx>{`
                .headerWrap {
                    width: 100%;
                    background: #00a47b;
                }
            `}</style>
        </div>
    );
};

export default Header;
