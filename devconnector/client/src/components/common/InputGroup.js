import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const InputGroup = ({ name, placeholder, value, type, error, icon, onChange }) => {
	return (
		<div className="input-group mb-3">
			<div className="input-group-prepend">
				<div className="input-group-text">
					<i className={icon}></i>
				</div>
			</div>
			<input className={classnames("form-control form-control-lg", { 'is-invalid': error })}
			    placeholder={placeholder}
			    name={name}
			    value={value}
			    type={type}
			    onChange={onChange}
			/>
			{error && (<div className="invalid-feedback">{error}</div>)}
		</div>		
	);
};

InputGroup.propTypes = {
	name: PropTypes.string.isRequired,
	placeholder: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	error: PropTypes.string,
	icon: PropTypes.string,
	onChange: PropTypes.func.isRequired,
};

InputGroup.defaultProps = {
	type: 'text'
};

export default InputGroup;