const CLIENT_HOME_PAGE_URL = "http://localhost:3000/dashboard";

const authenticate = async (req, res, next) => {
    try {
        res.status(200).send()
    } catch (error) {
        console.log('error authenticating!: ', error)
    }
}

const loginSuccess = async (req, res, next) => {
    console.log('login success request obj: ', req)
    if (req.user) {
        console.log('user: ', req.user)
        res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.user,
            cookies: req.cookies
        })
    }
}

const loginFailure = async (req, res, next) => {
    res.status(401).json({
        success: false,
        message: "user failed to authenticate"
    })
}

const logout = async (req, res, next) => {
    try {
        req.logout()
        res.status(200).send()
    } catch (error) {
        console.log('error logging out!: ', error)
    }
}

const redirect = async (req, res, next) => {
    console.log('redirect handler in auth.js called')
    try {
        passport.authenticate("twitter", {
            successRedirect: CLIENT_HOME_PAGE_URL,
            failureRedirect: "/auth/login/failed"
        })
    } catch (error) {
        console.log('error redirecting!: ', error)
    }
}

module.exports = {
    authenticate,
    loginSuccess,
    loginFailure,
    logout,
    redirect 
}