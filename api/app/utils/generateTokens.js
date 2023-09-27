const jwt = require('jsonwebtoken');
const UserToken = require('../models').UserToken;

module.exports = {
  async generateTokens(user) {
    try {
      const payload = { id: user.id, role: user.role };
      const accessToken = jwt.sign(
          payload,
          process.env.ACCESS_TOKEN_PRIVATE_KEY,
          { expiresIn: "14m" }
      );
      const refreshToken = jwt.sign(
          payload,
          process.env.REFRESH_TOKEN_PRIVATE_KEY,
          { expiresIn: "30d" }
      );

      const userToken = await UserToken.findOne({ where: { user_id: user.id }});
      if (userToken) await userToken.destroy();

      await UserToken.create({user_id: user.id, token: refreshToken })
      return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

