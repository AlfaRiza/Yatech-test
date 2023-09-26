const verifySignUpController = require('../api').verifySignUp;
const verifySignController = require('../api').verifySign;
const statusController = require('../api').status;
const verifyJwtTokenController = require('../api').verifyJwtToken;
const User = require('../models').User
const bcrypt = require('bcryptjs');
const generateTokens = require('../utils/generateTokens')


module.exports = function (app) {

	//User Auth
	app.post('/api/auth/signup',
		[verifySignUpController.checkDuplicateUserNameOrEmail,
			verifySignUpController.checkRolesExisted
		],
		verifySignController.signup);

	app.post('/api/auth/signin', verifySignController.signin);

	//Status
	app.get('/api/status',
		statusController.list);
	app.get('/api/statususer',
		[verifyJwtTokenController.verifyToken],
		statusController.listStatusUser);
	app.get('/api/status/:id',
		[verifyJwtTokenController.verifyToken,
		],
		statusController.getById);
	app.post('/api/status',
		[verifyJwtTokenController.verifyToken,
		],
		statusController.add);
	app.put('/api/status/:id',
		[verifyJwtTokenController.verifyToken,
		],
		statusController.update);
	app.delete('/api/status/:id',
		[verifyJwtTokenController.verifyToken,
		],
		statusController.delete);

	app.post('/api/login', async (req, res) => {
    try {
        // const { error } = logInBodyValidation(req.body);
        // if (error)
        //     return res
        //         .status(400)
        //         .json({ error: true, message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res
                .status(401)
                .json({ error: true, message: "Invalid email or password" });

        const verifiedPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!verifiedPassword)
            return res
                .status(401)
                .json({ error: true, message: "Invalid email or password" });

        const { accessToken, refreshToken } = await generateTokens.generateTokens(user);

        res.status(200).json({
            error: false,
            accessToken,
            refreshToken,
            message: "Logged in sucessfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
})
}
