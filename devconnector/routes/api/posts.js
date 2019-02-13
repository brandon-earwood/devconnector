const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

const validatePostInput = require('../../validation/post');

const router = express.Router();

// @router  GET api/posts/test
// @desc	Tests posts route
// @access	Public
router.get('/test', (req, res) => res.json({msg: 'Posts works'}));

// @router  GET api/posts
// @desc	Get posts
// @access	Public
router.get('/', (req, res) => {
	Post.find()
		.sort({ date: -1 })
		.then(posts => res.json(posts))
		.catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});

// @router  GET api/posts/:id
// @desc	Get post by id
// @access	Public
router.get('/:id', (req, res) => {
	Post.findById(req.params.id)
		.then(post => res.json(post))
		.catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }));
});

// @router  POST api/posts
// @desc	Create post
// @access	Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validatePostInput(req.body);
	
	// Check validation
	if (!isValid) {
		// Return any errors with 400 status
		return res.status(400).json(errors);
	}

	const newPost = {
		text: req.body.text,
		name: req.body.name,
		avatar: req.body.avatar,
		user: req.user.id
	};

	new Post(newPost).save().then(post => res.json(post));
});

// @router  DELETE api/posts/:id
// @desc	Delete post by id
// @access	Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id })
		.then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					// Check for post owner
					if (post.user.toString() !== req.user.id) {
						return res.status(401).json({ notauthorized: 'User not authorized' });
					}

					post.remove().then(() => res.json({ success: true }));
				})
				.catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }));
		})
		.catch(err => res.status(404).json(err));
});

// @router  POST api/posts/like/:id
// @desc	Like post by id
// @access	Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id })
		.then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
						return res.status(400).json({ alreadyliked: 'User already liked this post' });
					}

					// Add user id to likes array
					post.likes.unshift({ user: req.user.id });
					post.save().then(post => res.json(post));
				})
				.catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }));
		})
		.catch(err => res.status(404).json(err));
});

// @router  POST api/posts/unlike/:id
// @desc	Unlike post by id
// @access	Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id })
		.then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
						return res.status(400).json({ notliked: 'You have not yet liked this post' });
					}

					// Get remove index
					const removeIndex = post.likes
						.map(item => item.user.toString())
						.indexOf(req.user.id);
					post.likes.splice(removeIndex, 1);

					post.save().then(post => res.json(post));
				})
				.catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }));
		})
		.catch(err => res.status(404).json(err));
});

// @router  POST api/posts/comment/:id
// @desc	Comment on post by id
// @access	Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validatePostInput(req.body);
	
	// Check validation
	if (!isValid) {
		// Return any errors with 400 status
		return res.status(400).json(errors);
	}

	Post.findById(req.params.id)
		.then(post => {
			const newComment = {
				text: req.body.text,
				name: req.body.name,
				avatar: req.body.avatar,
				user: req.user.id
			};

			// Add to comments array
			post.comments.unshift(newComment);
			post.save().then(post => res.json(post));
		})
		.catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }));
});

// @router  DELETE api/posts/comment/:id/:comment_id
// @desc	Remove comment from post
// @access	Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Post.findById(req.params.id)
		.then(post => {
			// Check if comment exists
			if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
				return res.status(404).json({ nocommentfound: 'No comment found' });
			}

			// Get remove index
			const removeIndex = post.comments
				.map(item => item._id.toString())
				.indexOf(req.params.comment_id);
			post.comments.splice(removeIndex, 1);

			post.save().then(post => res.json(post));
		})
		.catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }));
});

module.exports = router;