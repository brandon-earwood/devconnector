import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwtDecode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import './App.css';

import store from './store';
import { setCurrentUser, logoutUser } from './actions/authActions';

import PrivateRoute from './components/common/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/create-profile/CreateProfile';
import EditProfile from './components/edit-profile/EditProfile';
import AddExperience from './components/add-credentials/AddExperience';
import AddEducation from './components/add-credentials/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import NotFound from './components/not-found/NotFound';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';

// Check for token
if (localStorage.getItem('token')) {
    const token = localStorage.getItem('token');

    // Set auth token header auth
    setAuthToken(token);
    // Decode token and get user info and expiration
    const decoded = jwtDecode(token);

    store.dispatch(setCurrentUser(decoded));

    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        // @TODO - clear current profile
        // Redirect to login
        window.location.href = '/login';
    }
}

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="App">
                        <Navbar />
                        <Switch>
                            <Route exact path='/' component={Landing} />
                            <Route exact path='/register' component={Register} />
                            <Route exact path='/login' component={Login} />
                            <PrivateRoute exact path='/dashboard' component={Dashboard} />
                            <PrivateRoute exact path='/create-profile' component={CreateProfile} />
                            <PrivateRoute exact path='/edit-profile' component={EditProfile} />
                            <PrivateRoute exact path='/add-experience' component={AddExperience} />
                            <PrivateRoute exact path='/add-education' component={AddEducation} />
                            <Route exact path='/profiles' component={Profiles} />
                            <PrivateRoute exact path='/profile/:handle' component={Profile} />
                            <Route path='/not-found' component={NotFound} />
                            <PrivateRoute exact path='/feed' component={Posts} />
                            <PrivateRoute exact path='/post/:id' component={Post} />
                        </Switch>
                        <Footer />
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
