const authenticate = async (req, res, next) => {
    try {
        res.status(200).send()
    } catch (error) {
        console.log('error authenticating!: ', error)
    }
}

const loginSuccess = async (req, res, next) => {
    // const url = "https://djdd1ix41h8xd.cloudfront.net/dashboard"
    const url = "http://localhost:3000/dashboard"
    try {
        res.status(301).redirect(url)
    } catch (error) {
        console.log('error logging in!: ', error)
    }
}

const loginFailure = async (req, res, next) => {
    try {
        res.status(200).send()
    } catch (error) {
        console.log('error handling auth failure!: ', error)
    }
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