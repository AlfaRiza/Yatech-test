const validation = require('../utils/validationSchema')
const UserToken = require('../models').UserToken
const jwt = require('jsonwebtoken')

module.exports = {
  async accessToken(req, res) {
    try {
        const { error } = validation.refreshTokenBodyValidation(req.body);
        if (error)
            return res
                .status(400)
                .json({ error: true, message: error.details[0].message });

        const doc = await UserToken.findOne({ where: { token: req.body.refreshToken }});
        if (!doc) {
            return res.status(400).json({
                error: error
            })
        }
        const tokenDetails = jwt.verify(req.body.refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);

        const payload = { id: tokenDetails.id, role: tokenDetails.role };
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: "14m" }
        );
        return res.status(200).json({
            error: false,
            accessToken,
            message: "Access token created successfully",
        });
    } catch (error) {
        return res.status(400).json({
            error: error
        })
    }
    // verify.verifyRefreshToken(req.body.refreshToken)
    //     .then(({ tokenDetails }) => {
    //     })
    //     .catch((err) => );
  }
}