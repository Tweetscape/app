const authenticate = async (req, res, next) => {
    try {
        res.status(200).send()
    } catch (error) {
        console.log('error authenticating!: ', error)
    }
}

const loginSuccess = async (req, res, next) => {
    if (req.user) {
        res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.user,
            cookies: req.cookies
        })
    }
    
    // const url = "https://djdd1ix41h8xd.cloudfront.net/dashboard"
    // const url = "http://localhost:3000/dashboard"
    // try {
    //     res.status(301).redirect(url)
    // } catch (error) {
    //     console.log('error logging in!: ', error)
    // }
}

const loginFailure = async (req, res, next) => {
    res.status(401).json({
        success: false,
        message: "user failed to authenticate"
    })
    // try {
    //     res.status(200).send()
    // } catch (error) {
    //     console.log('error handling auth failure!: ', error)
    // }
}

const logout = async (req, res, next) => {
    try {
        res.status(200).send()
    } catch (error) {
        console.log('error logging out!: ', error)
    }
}

const redirect = async (req, res, next) => {
    try {
        res.status(200).send()
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