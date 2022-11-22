import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import './SwitchStyles.scss';
export default function Switch(props) {
    useEffect(() => {
        console.log(props.checked);
    }, [props.checked]);
    return _jsx(_Fragment, { children: _jsx("div", { className: "container", children: _jsxs("label", { className: "switch", htmlFor: "checkbox", children: [_jsx("input", { type: "checkbox", id: "checkbox", checked: props.checked, onChange: props.onChange }), _jsx("div", { className: "slider round" })] }) }) });
}
