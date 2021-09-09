import React, {useState} from "react";
import PropTypes from 'prop-types';
import "./index.css";

const CustomInput = (props) => {
  const {
    type,
    value,
    label,
    locked,
    onPress,
    customisedStyle
  } = props;

  const [active, setActive] = useState(locked || false)

  const changeValue = (event) => {
    onPress(event.target.value)
  }

  return (
    <div 
      className={`fieldArea ${(locked ? active : active || value) && "active"} ${locked && !active && "locked"}`}
      style={customisedStyle}  
    >
      <textarea
        type={type}
        value={value}
        placeholder={label}
        onChange={changeValue}
        onFocus={() => !locked && setActive(true)}
        onBlur={() => !locked && setActive(false)}
      />
      <label>
        {label}
      </label>
    </div>
  );
}

const propTypes = {
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  label: PropTypes.string,
  locked: PropTypes.bool,
  onPress: PropTypes.func,
  customisedStyle: PropTypes.object
}

const defaultProps = {
  type: 'text',
  label: 'Label',
  locked: false,
  onPress: ()=>console.log('TBD'),
  // customisedStyle: {width: '50%', alignItem: 'center', justifyContent: 'center'}
}

CustomInput.propTypes = propTypes;
CustomInput.defaultProps = defaultProps
export default CustomInput;
