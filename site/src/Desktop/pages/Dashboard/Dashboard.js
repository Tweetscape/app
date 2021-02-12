import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'

import styles from './style.module.css'
import { store } from 'utils/store'
import TwitterCard from 'Desktop/components/TwitterCard/TwitterCard'
import { TwitterTimelineEmbed, TwitterTweetEmbed } from 'react-twitter-embed';
import { Tweet } from 'react-twitter-widgets'

const endpoint = "https://h27pptsq0k.execute-api.us-east-1.amazonaws.com/"
const apiEndpoint = "https://h27pptsq0k.execute-api.us-east-1.amazonaws.com/auth/login/success"


export default function Dashboard({ }) {
    const [tab, setTab] = useState(0)
    const [myLists, setMyLists] = useState([])
    const [twitterPosts, setTwitterPosts] = useState([])
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)
    const [authenticated, setAuthenticated] = useState(false)
    const [currentListIdx, setCurrentListIdx] = useState(0)
    const [sorting, setSorting] = useState("Most Popular")
    const [lazyLoad, setLazyLoad] = useState(true)
    const [maxId, setMaxId] = useState("")

    const { dispatch, state: { data, tweetsLoading }} = useContext(store)
    const featuredLists = data.featuredLists

    useEffect(() => {
        async function getIt() {
            try {
                const response = await axios("https://h27pptsq0k.execute-api.us-east-1.amazonaws.com/mylists", {
                    credentials: "include"
                })
                console.log('setting my lists: ', response.data.myLists)

                setMyLists(response.data.myLists)
            } catch (error) {
                console.log('error fetching my lists!: ', error)
            }    
        }

        getIt()
    }, [])

    useEffect(() => {
        async function fetchUser() {
          let res 
    
          try {
            res = await axios(apiEndpoint, { withCredentials: true })
            console.log('response: ', res)
          } catch (error) {
            console.log('error: ', error)
            setAuthenticated(false)
            setUser(null)
            setError("failed to authenticate user")
          }
        }
    
        fetchUser()
      }, [])   

    useEffect(() => {
        async function getListData() {
            try {
                dispatch({ type: "tweetLoadingToggle" })

                const listType = tab === 0 && myLists.length ? myLists[currentListIdx] : featuredLists[currentListIdx]
                
                if (tab === 1) {
                    const url = getListTweetsEndpoint(featuredLists[currentListIdx])
                    const res = await axios(url, { withCredentials: true })
    
                    if (res && res.data) {
                        const tweets = JSON.parse(JSON.stringify(res.data.tweets))
                        console.log('setting tweets: ', tweets)
                        setTwitterPosts(tweets)
                    }
                } else {
                    if (myLists.length) {
                        const url = getListTweetsEndpoint(myLists[currentListIdx].id_str)
                        const res = await axios(url, { withCredentials: true })

                        if (res && res.data) {
                            const tweets = JSON.parse(JSON.stringify(res.data.tweets))
                            console.log('setting tweets: ', tweets)
        
                            if (maxId) {
                                setTwitterPosts([...twitterPosts, ...tweets])    
                            } else {
                                setTwitterPosts(tweets)
                            }

                            setMaxId(tweets[tweets.length - 1].id_str)
                            setLazyLoad(true)
                        }                        
                    } else {
                        setTwitterPosts([])
                    }
                }

                dispatch({ type: "tweetLoadingToggle" })
            } catch (error) {
                console.log('error fetching list data: ', error)
                dispatch({ type: "tweetLoadingToggle" })
            } 
        }

        getListData()
      }, [currentListIdx, tab, myLists])

      useEffect(() => {
        const tweets = JSON.parse(JSON.stringify(twitterPosts)) 
        console.log('tweets: ', tweets)
        
        if (sorting === "Most Popular") {
            tweets.sort((a, b) => {
                return a.favorite_count - b.favorite_count
            })
        } else if (sorting === "Retweet Count") {
            console.log('tweets: ', tweets)
            tweets.sort((a, b) => {
                return a.retweet_count - b.retweet_count
            })                        
        } else {
            tweets.sort((a, b) => {
                return new Date(a.created_at) - new Date(b.created_at)
            })                                    
        }

        console.log('sorting: ', sorting)

        setTwitterPosts(tweets)
    }, [sorting])     
    
    useEffect(() => {
        if (lazyLoad) {
            setLazyLoad(false)
            // let timeout = setTimeout(() => {
            //     setLazyLoad(false)
            // }, 1000)
        }
    }, [lazyLoad])

    useEffect(() => {
        async function fetchMore() {
            if (maxId) {
                console.log('max id: ', maxId)

                if (tab === 1) {
                    const url = getListTweetsEndpoint(featuredLists[currentListIdx])
                    const res = await axios(url + maxId, { withCredentials: true })            
                    if (res && res.data) {
                        const tweets = JSON.parse(JSON.stringify(res.data.tweets))
                        console.log('setting tweets: ', tweets)
                        setTwitterPosts([...twitterPosts, ...tweets])
                    }                
                } else {
                    if (myLists.length) {
                        const url = getListTweetsEndpoint(myLists[currentListIdx].id_str) + '/' + maxId
                        console.log('url: ', url)
                        const res = await axios(url, { withCredentials: true })

                        if (res && res.data) {
                            const tweets = JSON.parse(JSON.stringify(res.data.tweets))
                            console.log('tweets: ', tweets)

                            const currentTweets = []
                            console.log('current tweets: ', currentTweets)


                            setTwitterPosts(tweets)    
                        }                        
                    } else {
                        setTwitterPosts([])
                    }    
                }
            }    
        }

        fetchMore()
    
    }, [maxId])
    
    const getListDataEndpoint = (id) => {
        return `https://h27pptsq0k.execute-api.us-east-1.amazonaws.com/list/${id}`
    }  
    
    const getListTweetsEndpoint = (id) => {
        return `https://h27pptsq0k.execute-api.us-east-1.amazonaws.com/tweets/${id}`
    }

    const handleSetTab = (index) => () => {
        setCurrentListIdx(0)
        setTab(index)
    } 
    
    const myListsStyle = tab === 0 ? { backgroundColor: "#e2e2e2aa", borderBottom: "2px solid black" } : null 
    const featuredListsStyle = tab === 1 ? { backgroundColor: "#e2e2e2aa", borderBottom: "2px solid black" } : null 

    const renderLists = () => {

        if (tab === 0 && myLists && myLists.length) {
            return myLists.map((item, idx) => {
                const styleObj = currentListIdx === idx ? { color: "black" } : { color: "#838383" }
                return (
                    <div className={styles.listRow} style={styleObj} onClick={() => setCurrentListIdx(idx)}>
                        {item.name}
                    </div>
                )
            })
        }

        if (tab === 0 && (!myLists || !myLists.length)) {
            return (
                <div className={styles.signInContainer}>
                    Sign in to view your lists 
                </div>
            )
        }

        const featuredListNames = [
            "Blockchain Gaming",
            "Crypto Art",
            "Cryptofunds",
            "Cryptogurus",
            "Cryptolaw",
            "Cryptomemes",
            "DAO",
            "Decentralized Finance",
            "Gen z mafia",
            "Systems Thinkers"
        ]

        return featuredLists.map((item, idx) => {
            const styleObj = currentListIdx === idx ? { color: "black" } : { color: "#838383" }
            return (
                <div className={styles.listRow} style={styleObj} onClick={() => setCurrentListIdx(idx)}>
                    {featuredListNames[idx] || item}
                </div>
            )
        })
    }

    const renderTweets = () => {
        if (tweetsLoading) {
            return null
        }

        if (twitterPosts && twitterPosts.length) {
            return twitterPosts.map((post, idx) => {
                return <Tweet tweetId={post.id_str} key={post.id_str} />
                // return <TwitterCard data={post} />
                // return <Tweet tweetId={post.id_str} key={post.id_str} />
                // return <TwitterTweetEmbed tweetId={post.id_str} key={post.id_str} />
                
            })
        }
    }

    const sortOneStyle = sorting === "Most Popular" ? { textDecoration: "underline", fontWeight: "bold" } : null 
    const sortTwoStyle = sorting === "Most Recent" ? { textDecoration: "underline", fontWeight: "bold" } : null 
    const sortThreeStyle = sorting === "Retweet Count" ? { textDecoration: "underline", fontWeight: "bold"  } : null 

    const lazyLoadStyle = lazyLoad ? { opacity: 0 } : null 

    return ( 
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.leftColumn}>
                    <div className={styles.leftHeader}>
                        <div className={styles.headerButton} style={myListsStyle} onClick={handleSetTab(0)}>
                            My Lists
                        </div>
                        <div className={styles.headerButton} style={featuredListsStyle} onClick={handleSetTab(1)}>
                            Featured Lists
                        </div>                             
                    </div>
                    <div className={styles.listColumn}>
                        {renderLists()}
                    </div>   
                </div>
                <div className={styles.mainFeed}>
                    <div className={styles.sortContainer}>
                        <div className={styles.sortLabel} style={sortOneStyle} onClick={() => setSorting("Most Popular")}>Most Popular</div>
                        <div className={styles.sortLabel} style={sortTwoStyle} onClick={() => setSorting("Most Recent")}>Most Recent</div>
                        <div className={styles.sortLabel} style={sortThreeStyle} onClick={() => setSorting("Retweet Count")}>Retweet Count</div>
                    </div>
                    <div style={lazyLoadStyle}>
                        {renderTweets()}
                    </div>
                </div>
            </div>
        </div>
    )
}