
const { lists } = require('../models') 

const getFeaturedLists = async (req, res, next) => {
    try {
        const lists = lists.getFeaturedLists()
        res.json({ lists })
    } catch (error) {
        console.log('error getting featured lists: ', error)
    }
}

const getMyLists = async (req, res, next) => {
    try {
        
        const userId = req.session.passport.user
        console.log('the user id is: ', userId)

        console.log('request - user: ', req.user)
        if (!req.user) {
            res.json({})
        }

        console.log('user: ', req.session)
        console.log('passport: ', req.session.passport)

        if (!req.session || !req.session.passport) {
            res.json({})
        }
        
        console.log('user id from user: ', userId)
        const myLists = await lists.getMyLists(userId)
        res.json({ myLists })
    } catch (error) {
        console.log('error getting myLists: ', error)        
    }
}

// const getListData = async (req, res, next) => {
//     const list_id = req.params.list_id
//     let count = req.params.count

//     if (!list_id) {
//         res.status(500).json({ error: "Invalid parameters"})
//     }

//     if (!count) {
//         count = 10
//     }

//     console.log('list_id: ', list_id)
//     console.log('count: ', count)
    
//     try {
//         const listData = await lists.getListData(list_id, count)
//         console.log('listData: ', listData)
//         res.json({ listData })
//     } catch (error) {
//         console.log('error getting list data: ', error)
//         res.status(500).json({ error: "Internal server error"})
//     }
// }

const getListData = async (req, res, next) => {
    const list_id = req.params.list_id
    // let count = req.params.count

    if (!list_id) {
        res.status(500).json({ error: "Invalid parameters"})
    }

    let count = 150

    console.log('list_id: ', list_id)
    console.log('count: ', count)
    
    try {
        const listData = await lists.getListData(list_id, count)
        console.log('listData: ', listData)
        res.json({ listData })
    } catch (error) {
        console.log('error getting list data: ', error)
        res.status(500).json({ error: "Internal server error"})
    }
}

const getTweetsForList = async (req, res, next) => {
    const list_id = req.params.list_id 

    if (!list_id) {
        res.status(500).json({ error: "Invalid parameters"})
    }

    try {
        console.log('fetching tweets for list: ', list_id)
        const response = await lists.getTweetsForList(list_id)
        console.log('tweets result: ', response)
        res.json({ tweets: response })
    } catch (error) {
        console.log('erro fetching tweets for list: ', error)
    }
}


module.exports = {
    getFeaturedLists,
    getMyLists,
    getListData,
    getTweetsForList
}