const User = require('../models').User
const UserToken = require('../models').UserToken;
const bcrypt = require('bcryptjs');
const generateTokens = require('../utils/generateTokens')
const validation = require('../utils/validationSchema')

module.exports = {
  async login(req, res) {
    try {
      const {error} = validation.logInBodyValidation(req.body);
      if (error)
        return res
          .status(400)
          .json({error: true, message: error.details[0].message});

      const user = await User.findOne({ where: {email: req.body.email} });
      if (!user)
        return res
          .status(401)
          .json({error: true, message: "Invalid email or password"});

      const verifiedPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!verifiedPassword)
        return res
          .status(401)
          .json({error: true, message: "Invalid email or password"});

      const {accessToken, refreshToken} = await generateTokens.generateTokens(user);

      res.status(200).json({
        error: false,
        accessToken,
        refreshToken,
        message: "Logged in sucessfully",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({error: true, message: "Internal Server Error"});
    }
  },
  async signup(req, res) {
    try {
      const { error } = validation.signUpBodyValidation(req.body);
      if (error)
          return res
              .status(400)
              .json({ error: true, message: error.details[0].message });

      const user = await User.findOne({ where: { email: req.body.email }});
      console.log('===', user);
      if (user)
          return res
              .status(400)
              .json({ error: true, message: "User with given email already exist" });

      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.password, salt);

      await User.create({ ...req.body, password: hashPassword });
      res
        .status(201)
        .json({ error: false, message: "Account created sucessfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
  async logout(req, res) {
    try {
      const { error } = validation.refreshTokenBodyValidation(req.body);
      if (error)
          return res
              .status(400)
              .json({ error: true, message: error.details[0].message });

      const userToken = await UserToken.findOne({ where: { token: req.body.refreshToken }});
      if (!userToken)
          return res
            .status(200)
            .json({ error: false, message: "Logged Out Sucessfully" });

      await userToken.destroy();
      res.status(200).json({ error: false, message: "Logged Out Sucessfully" });
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: true, message: "Internal Server Error" });
  }
  }
}