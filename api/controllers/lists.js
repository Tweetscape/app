
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
        const myLists = lists.getMyLists()
        res.json({ myLists })
    } catch (error) {
        console.log('error getting myLists: ', error)        
    }
}

const getListData = async (req, res, next) => {

    const list_id = req.params.list_id
    let count = req.params.count

    if (!list_id) {
        res.status(500).json({ error: "Invalid parameters"})
    }

    if (!count) {
        count = 10
    }

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


module.exports = {
    getFeaturedLists,
    getMyLists,
    getListData
}