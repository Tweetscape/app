import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './style.module.css'
import TwitterCard from 'Desktop/components/TwitterCard/TwitterCard'

const apiEndpoint = "https://h27pptsq0k.execute-api.us-east-1.amazonaws.com/auth/login/success"

export default function Dashboard({ }) {
    const [myLists, setMyLists] = useState([])
    const [twitterPosts, setTwitterPosts] = useState([1, 2, 3])
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)
    const [authenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        async function getIt() {
            try {
                const response = await axios("https://h27pptsq0k.execute-api.us-east-1.amazonaws.com/mylists", {
                    credentials: "include"
                })
                const json = await response.json()
    
                console.log('response for myLists: ', json)
                setMyLists(json)
            } catch (error) {
                console.log('error fetching my lists!: ', error)
            }    
        }

        // getIt()
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

    return ( 
        <div className={styles.container}>
            <div>Dashboard</div>
            <div className={styles.main}>
                <div className={styles.leftColumn}>
                    <div className={styles.leftHeader}>
                        <div className={styles.headerButton}>
                            My Lists
                        </div>
                        <div className={styles.headerButton}>
                            Featured Lists
                        </div>                        
                    </div>
                </div>
                <div className={styles.mainFeed}>
                    { twitterPosts.map(post => <TwitterCard data={post} />) }                                                      
                </div>
            </div>
        </div>
    )
}