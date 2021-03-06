import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TextFieldGroup from '../common/TextFieldGroup';

import { loginUser } from '../../actions/authActions';

class Login extends Component {
	constructor() {
		super();

		this.state = {
			email: '',
			password: '',
			errors: {}
		}
	}

	componentDidMount() {
		const { auth, history } = this.props;

		if (auth.isAuthenticated) {
			history.push('/dashboard');
		}
	}

	componentWillReceiveProps(nextProps) {
		const { history } = this.props;

		if (nextProps.auth.isAuthenticated) {
			history.push('/dashboard');
		}

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

	onSubmit = event => {
		event.preventDefault();

		const user = {
			...this.state
		}

		this.props.loginUser(user);
	};

	render() {
		const { email, password, errors } = this.state;

		return (
			<div className="login">
			    <div className="container">
			      	<div className="row">
			        	<div className="col-md-8 m-auto">
			          		<h1 className="display-4 text-center">Log In</h1>
			          		<p className="lead text-center">Sign in to your DevConnector account</p>
			          		<form onSubmit={this.onSubmit}>
			          			<TextFieldGroup
									placeholder="Email Address"
									name="email"
									type="email"
									value={email}
									onChange={this.onChange}
									error={errors.email}
			          			/>
			          			<TextFieldGroup
									placeholder="Password"
									name="password"
									type="password"
									value={password}
									onChange={this.onChange}
									error={errors.password}
			          			/>
			            		<input type="submit" className="btn btn-info btn-block mt-4" />
			          		</form>
			        	</div>
			      	</div>
			    </div>
			</div>
		);
	}
}

Login.propTypes = {
	loginUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(Login);