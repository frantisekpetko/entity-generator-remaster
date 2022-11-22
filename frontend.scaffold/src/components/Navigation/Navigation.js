import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import './NavigationStyles.scss';
import LazyImage from "../LazyImage";
import headerImg from "../../assets/header.png";
import Flex from "../Flex";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
export default function Navigation() {
    const navigate = useNavigate();
    return (_jsx(_Fragment, { children: _jsx("div", { className: "Navigation", children: _jsxs(Flex, { direction: 'row', justifyContent: 'space-between', alignItems: 'center', children: [_jsx("a", { className: "active", href: "#", onClick: () => navigate('/'), children: _jsx(LazyImage, { image: { alt: 'some picture', src: headerImg, width: 420, height: 60 } }) }), _jsx(Flex, { direction: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', alignContent: 'flex-end', styles: { padding: '0 2em' }, children: _jsxs(_Fragment, { children: [_jsx(Link, { to: '/entity', children: "Entity generator" }), _jsx(Link, { to: '/explorer', children: "Entity explorer" })] }) })] }) }) }));
}
