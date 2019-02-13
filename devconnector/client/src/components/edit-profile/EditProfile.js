import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import InputGroup from '../common/InputGroup';
import { Link, withRouter } from 'react-router-dom';

import { createProfile, getCurrentProfile } from '../../actions/profileActions';

import isEmpty from '../../validation/is-empty';

class EditProfile extends Component {
	constructor(props) {
		super(props);

		this.state = {
			displaySocialInputs: false,
			handle: '',
			company: '',
			website: '',
			location: '',
			status: '',
			skills: '',
			githubusername: '',
			bio: '',
			twitter: '',
			facebook: '',
			linkedin: '',
			youtube: '',
			instagram: '',
			errors: {}
		};
	}

	componentDidMount() {
		this.props.getCurrentProfile();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({
				errors: nextProps.errors
			});
		}

		if (nextProps.profile.profile) {
			const profile = nextProps.profile.profile;

			const skillsCSV = profile.skills.join(',');

			// If profile field is missing, make it an empty string/object
			profile.company = !isEmpty(profile.company) ? profile.company : '';
			profile.website = !isEmpty(profile.website) ? profile.website : '';
			profile.location = !isEmpty(profile.location) ? profile.location : '';
			profile.status = !isEmpty(profile.status) ? profile.status : '';
			profile.githubusername = !isEmpty(profile.githubusername) ? profile.githubusername : '';
			profile.bio = !isEmpty(profile.bio) ? profile.bio : '';
			profile.social = !isEmpty(profile.social) ? profile.social : {};
			profile.twitter = !isEmpty(profile.social.twitter) ? profile.social.twitter : '';
			profile.facebook = !isEmpty(profile.social.facebook) ? profile.social.facebook : '';
			profile.linkedin = !isEmpty(profile.social.linkedin) ? profile.social.linkedin : '';
			profile.youtube = !isEmpty(profile.social.youtube) ? profile.social.youtube : '';
			profile.instagram = !isEmpty(profile.social.instagram) ? profile.social.instagram : '';

			this.setState({
				handle: profile.handle,
				company: profile.company,
				website: profile.website,
				location: profile.location,
				status: profile.status,
				skills: skillsCSV,
				githubusername: profile.githubusername,
				bio: profile.bio,
				twitter: profile.twitter,
				facebook: profile.facebook,
				linkedin: profile.linkedin,
				youtube: profile.youtube,
				instagram: profile.instagram
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

		const profileData = {
			...this.state
		};
		const { history } = this.props;

		this.props.createProfile(profileData, history);
	};

	render() {
		const {
			displaySocialInputs,
			handle,
			company,
			website,
			location,
			status,
			skills,
			githubusername,
			bio,
			twitter,
			facebook,
			linkedin,
			youtube,
			instagram,
			errors
		} = this.state;

		// Select options for status
		const options = [
			{
				label: '* Select professional status',
				value: 0
			},
			{
				label: 'Developer',
				value: 'Developer'
			},
			{
				label: 'Junior Developer',
				value: 'Junior Developer'
			},
			{
				label: 'Senior Developer',
				value: 'Senior Developer'
			},
			{
				label: 'Manager',
				value: 'Manager'
			},
			{
				label: 'Student or Learning',
				value: 'Student or Learning'
			},
			{
				label: 'Instructor or Teacher',
				value: 'Instructor or Teacher'
			},
			{
				label: 'Intern',
				value: 'Intern'
			},
			{
				label: 'Other',
				value: 'Other'
			}
		];

		let socialInputs;

		if (displaySocialInputs) {
			socialInputs = (
				<div>
					<InputGroup
						placeholder="Twitter Profile URL"
						name="twitter"
						icon="fab fa-twitter"
						value={twitter}
						onChange={this.onChange}
						errors={errors.twitter}
					/>
					<InputGroup
						placeholder="Facebook Profile URL"
						name="facebook"
						icon="fab fa-facebook"
						value={facebook}
						onChange={this.onChange}
						errors={errors.facebook}
					/>
					<InputGroup
						placeholder="LinkedIn Profile URL"
						name="linkedin"
						icon="fab fa-linkedin"
						value={linkedin}
						onChange={this.onChange}
						errors={errors.linkedin}
					/>
					<InputGroup
						placeholder="YouTube Profile URL"
						name="youtube"
						icon="fab fa-youtube"
						value={youtube}
						onChange={this.onChange}
						errors={errors.youtube}
					/>
					<InputGroup
						placeholder="Instagram Profile URL"
						name="instagram"
						icon="fab fa-instagram"
						value={instagram}
						onChange={this.onChange}
						errors={errors.instagram}
					/>
				</div>
			)
		}

		return (
			<div className="edit-profile">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<Link to="/dashboard" className="btn btn-light">
								Go Back
							</Link>
							<h1 className="display-4 text-center">Edit Your Profile</h1>
							<small className="d-block pb-3">* = required field</small>
							<form onSubmit={this.onSubmit}>
								<TextFieldGroup
									placeholder="* Profile Handle"
									name="handle"
									value={handle}
									onChange={this.onChange}
									error={errors.handle}
									info="A unique handle for your profile URL. Your full name, company name, nickname"
								/>
								<SelectListGroup
									placeholder={"Status"}
									name="status"
									value={status}
									onChange={this.onChange}
									error={errors.status}
									options={options}
									info="Give us an idea of where you are at in your career"
								/>
								<TextFieldGroup
									placeholder="Company"
									name="company"
									value={company}
									onChange={this.onChange}
									error={errors.company}
									info="Could be your own company or one you work for"
								/>
								<TextFieldGroup
									placeholder="Website"
									name="website"
									value={website}
									onChange={this.onChange}
									error={errors.website}
									info="Could be your own website or a company one"
								/>
								<TextFieldGroup
									placeholder="Location"
									name="location"
									value={location}
									onChange={this.onChange}
									error={errors.location}
									info="City or city &amp; state suggested (eg. Boston, MA)"
								/>
								<TextFieldGroup
									placeholder="* Skills"
									name="skills"
									value={skills}
									onChange={this.onChange}
									error={errors.skills}
									info="Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)"
								/>
								<TextFieldGroup
									placeholder="Github Username"
									name="githubusername"
									value={githubusername}
									onChange={this.onChange}
									error={errors.githubusername}
									info="If you want your latest repos and a Github link, include your username"
								/>
								<TextAreaFieldGroup
									placeholder="Short Bio"
									name="bio"
									value={bio}
									onChange={this.onChange}
									error={errors.bio}
									info="Tell us a little about yourself"
								/>
								<div className="mb-3">
									<button type="button" className="btn btn-light" onClick={() =>
										this.setState(prevState => ({ displaySocialInputs: !prevState.displaySocialInputs }))
									}>
										Display Social Inputs
									</button>&nbsp;
									<span className="text-muted">Optional</span>
								</div>
								{socialInputs}
								<input type="submit" value="Submit" className="btn btn-info btn-block mt-4"/>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

EditProfile.propTypes = {
	createProfile: PropTypes.func.isRequired,
	getCurrentProfile: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	profile: state.profile,
	errors: state.errors
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(withRouter(EditProfile));