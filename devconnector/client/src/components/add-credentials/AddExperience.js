import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { connect } from 'react-redux';

import { addExperience } from '../../actions/profileActions';

class AddExperience extends Component {
	constructor(props) {
		super(props);

		this.state = {
			company: '',
			title: '',
			location: '',
			from: '',
			to: '',
			current: false,
			description: '',
			errors: {},
			disabled: false
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({
				errors: nextProps.errors
			});
		}
	}

	onChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	onCheck = event => {
		this.setState({
			current: !this.state.current,
			disabled: !this.state.disabled
		});
	};

	onSubmit = event => {
		event.preventDefault();

		const expData = {
			...this.state
		};
		const { history } = this.props;

		this.props.addExperience(expData, history);
	};

	render() {
		const {
			company,
			title,
			location,
			// from --> Cannot destructure keyword
			to,
			current,
			description,
			errors,
			disabled,
		} = this.state;

		return (
			<div className="add-experience">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<Link to="/dashboard" className="btn btn-light">
								Go Back
							</Link>
							<h1 className="display-4 text-center">Add Experience</h1>
							<p className="lead text-center">Add any job or position that you have currently or had in the past</p>
							<small className="d-block pb-3">* = required field</small>
							<form onSubmit={this.onSubmit}>
								<TextFieldGroup
									placeholder="* Company"
									name="company"
									value={company}
									onChange={this.onChange}
									error={errors.company}
								/>
								<TextFieldGroup
									placeholder="* Job Title"
									name="title"
									value={title}
									onChange={this.onChange}
									error={errors.title}
								/>
								<TextFieldGroup
									placeholder="Location"
									name="location"
									value={location}
									onChange={this.onChange}
									error={errors.location}
								/>
								<h6>From Date</h6>
								<TextFieldGroup
									name="from"
									type="date"
									value={this.state.from}
									onChange={this.onChange}
									error={errors.from}
								/>
								<h6>To Date</h6>
								<TextFieldGroup
									name="to"
									type="date"
									value={to}
									onChange={this.onChange}
									error={errors.to}
									disabled={disabled ? 'disabled' : ''}
								/>
								<div className="form-check mb-4">
									<input type="checkbox"
										className="form-check-input"
										name="current"
										value={current}
										checked={current}
										onChange={this.onCheck}
										id="current"
									/>
									<label htmlFor="current" className="form-check-label">Current Job</label>
								</div>
								<TextAreaFieldGroup
									placeholder="Job Description"
									name="description"
									value={description}
									onChange={this.onChange}
									error={errors.description}
									info="Tell us about the position"
								/>
								<input type="submit" value="Submit" className="btn btn-info btn-block mt-4"/>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

AddExperience.propTypes = {
	addExperience: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	profile: state.profile,
	errors: state.errors
});

export default connect(mapStateToProps, { addExperience })(withRouter(AddExperience));