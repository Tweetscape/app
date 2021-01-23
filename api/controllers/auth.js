// auth/twitter => authenticate with passport

// auth/login/success => returns login success response  with user info

// auth/login/failed => failed message 

// auth/logout => logout & redirect 

// auth/twitter/redirect => redirect to home page if login succeeded


const authenticate = async (req, res, next) => {
    try {
        res.status(200).send()
    } catch (error) {
        console.log('error authenticating!: ', error)
    }
}

const loginSuccess = async (req, res, next) => {
    try {
        console.log('a very successful login indeed: ', req)
        // redirect the user to the dashboard screen 
        // res.status(200).send()
        res.status(301).redirect('https://d3oz1l1pvg13xf.cloudfront.net/dashboard')
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