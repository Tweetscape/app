import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'

import styles from './style.module.css'
import { store } from 'utils/store'
import TwitterCard from 'Desktop/components/TwitterCard/TwitterCard'
import { TwitterTimelineEmbed, TwitterTweetEmbed } from 'react-twitter-embed';

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
    const [sorting, setSorting] = useState("Standard")

    const { dispatch, state: { data, tweetsLoading }} = useContext(store)
    const featuredLists = data.featuredLists

    useEffect(() => {
        async function getIt() {
            try {
                const response = await axios("https://h27pptsq0k.execute-api.us-east-1.amazonaws.com/mylists", {
                    credentials: "include"
                })
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
        
                            setTwitterPosts(tweets)
                        }                        
                    } else {
                        setTwitterPosts([])
                    }
                }

                dispatch({ type: "tweetLoadingToggle" })
            } catch (error) {
                console.log('error fetching list data: ', error)
            } 
        }

        getListData()
      }, [currentListIdx, tab])

      useEffect(() => {
        const tweets = JSON.parse(JSON.stringify(twitterPosts)) 
        console.log('tweets: ', tweets)
        
        if (sorting === "Most Popular") {
            tweets.sort((a, b) => {
                return a.favorite_count - b.favorite_count
            })
        } else {
            tweets.sort((a, b) => {
                return new Date(a.created_at) - new Date(b.created_at)
            })                        
        }

        console.log('sorting: ', sorting)

        setTwitterPosts(tweets)
    }, [sorting])      
    
    const getListDataEndpoint = (id) => {
        return `https://h27pptsq0k.execute-api.us-east-1.amazonaws.com/list/${id}`
    }  
    
    const getListTweetsEndpoint = (id) => {
        return `https://h27pptsq0k.execute-api.us-east-1.amazonaws.com/tweets/${id}`
    }

    const handleSetTab = (index) => () => setTab(index)
    
    const myListsStyle = tab === 0 ? { backgroundColor: "#e2e2e2aa", borderBottom: "2px solid black" } : null 
    const featuredListsStyle = tab === 1 ? { backgroundColor: "#e2e2e2aa", borderBottom: "2px solid black" } : null 

    const renderLists = () => {

        if (tab === 0 && myLists.length) {
            return myLists.map((item, idx) => {
                const styleObj = currentListIdx === idx ? { color: "black" } : { color: "#838383" }
                return (
                    <div className={styles.listRow} style={styleObj} onClick={() => setCurrentListIdx(idx)}>
                        {item.name}
                    </div>
                )
            })
        }

        if (tab === 0 && !myLists.length) {
            return (
                <div className={styles.signInContainer}>
                    Sign in to view your lists 
                </div>
            )
        }

        return featuredLists.map((item, idx) => {
            const styleObj = currentListIdx === idx ? { color: "black" } : { color: "#838383" }
            return (
                <div className={styles.listRow} style={styleObj} onClick={() => setCurrentListIdx(idx)}>
                    {item}
                </div>
            )
        })
    }

    const renderTweets = () => {
        if (tweetsLoading) {
            return <div style={{ color: 'black' }}>Tweets are loading</div>
        }

        // return <TwitterTimelineEmbed sourceType="list" id={featuredLists[currentListIdx]} key={featuredLists[currentListIdx]} />

        if (twitterPosts && twitterPosts.length) {
            console.log('twitter posts: ', twitterPosts)
            return twitterPosts.map(post => {
                return <TwitterCard data={post} />
                // return <TwitterTweetEmbed tweetId={post.id_str} key={post.id_str} />
            })
        }

        // return null 
    }

    return ( 
        <div className={styles.container}>
            <div>Dashboard</div>
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
                        <div className={styles.sortLabel} onClick={() => setSorting("Most Popular")}>Most Popular</div>
                        <div className={styles.sortLabel} onClick={() => setSorting("Most Recent")}>Most Recent</div>
                        <div className={styles.sortLabel} onClick={() => setSorting("Standard")}>Standard</div>
                    </div>
                    {renderTweets()}
                </div>
            </div>
        </div>
    )
}