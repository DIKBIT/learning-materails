const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const axios = require("axios");

const User = require('../../models/User');

// @route   POST api/users
// @d esc    Register route
// @access  Public
const inputErrors = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Pleae enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
];

router.post('/', inputErrors, async (req, res) => {
  if (!req.body.token) {
    return res.status(400).json({ error: "Token is missing" });
}
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password } = req.body;
  
  
  try {
    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=6LdoGksaAAAAACvYXqGJeo6SOu5tlkzW3S3YgtqU&response=${req.body.token}`;
    const response = await axios.post(googleVerifyUrl);
    const { success } = response.data;
// recaptcha check 
if(success){
      // See if user exists

  let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }
    // Get Users gravatar
    const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
    user = new User({
      name,
      email,
      avatar,
      password,
    });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
     "yT$5P1zx7#Kw9s@!cH@dN3&mRbF",
      { expiresIn: 3600000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
}else{
  return res.status(400).json({ error: "Invalid Captcha. Try again." });
}
    
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
