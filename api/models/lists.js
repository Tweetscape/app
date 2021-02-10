const axios = require('axios')

const getListUrl = "https://api.twitter.com/1.1/lists/statuses.json"
const getListDataUrl = "https://api.twitter.com/1.1/lists/show.json"
const getMyListsUrl = "https://api.twitter.com/1.1/lists/list.json"

const bearerToken = "Bearer AAAAAAAAAAAAAAAAAAAAABApLwEAAAAA4VuQKyVlv2n2wi3eyXikFL5EJgk%3DeVRE278bNEVux38KAOzk4JmaVGVK3SsvDRfpnwdfliBbsaQMOB"

const headers = { Authorization: bearerToken }

//?list_id=884466365532209153&count=1

const getFeaturedLists = async () => {
    try {
        return [
            {
                name: "CryptoGurus"
            }
        ]
    } catch (error) {
        console.log('error getting featured lists: ', error)
    }
}

const getMyLists = async (userId) => {
    try {
        console.log('getting my lists with userId: ' ,userId)

        const response = await axios.get(getMyListsUrl, {
            user_id: userId
        })

        if (response.data) {
            return response.data
        }

        throw 'Invalid response'
    } catch (error) {
        console.log('error fetching lists: ', error)
    }
}

const getTweetsForList = async (list_id, count) => {
    try {
        const response = await axios.get(getListUrl, {
            params: {
                list_id,
                count
            }, headers
        })
        
        if (response.data) {
            return response.data
        }

        throw 'Invalid response'
    } catch (error) {
        console.log('error fetching list data: ', error)
        return error
    }
}

const getListData = async (list_id, count) => {
    try {
        const response = await axios.get(getListDataUrl, {
            params: {
                list_id,
                count
            }, headers
        })
        
        if (response.data) {
            return response.data
        }

        throw 'Invalid response'
    } catch (error) {
        console.log('error fetching list data: ', error)
        return error
    }
}

module.exports = {
    getListData,
    getMyLists,
    getTweetsForList,
    getFeaturedLists
}