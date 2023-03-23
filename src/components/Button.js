
function Button(props) {

    return <button className={props.className} id={props.id} onClick={props.onClick}>{props.text}</button>
}

Button.defaultProps = {
    id: null,
    className: 'std-button',
    onClick: null,
    text: 'Default Button',
}

export default Button