import React, { useEffect, useState } from 'react'

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
        // fetch("http://localhost:4000/auth/login/success", {
        //   method: "GET",
        //   credentials: "include",
        //   headers: {
        //     Accept: "application/json",
        //     "Content-Type": "application/json",
        //     "Access-Control-Allow-Credentials": true
        //   }
        // })
        //   .then(response => {
        //     if (response.status === 200) return response.json();
        //     throw new Error("failed to authenticate user");
        //   })
        //   .then(responseJson => {
        //     this.setState({
        //       authenticated: true,
        //       user: responseJson.user
        //     });
        //   })
        //   .catch(error => {
        //     this.setState({
        //       authenticated: false,
        //       error: "Failed to authenticate user"
        //     });
        //   });

        async function getIt() {
            try {
                const response = await fetch("https://h27pptsq0k.execute-api.us-east-1.amazonaws.com/mylists", {
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
            res = await fetch(apiEndpoint, {
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                  }                
            })
            console.log('response: ', res)
            const json = await res.json()
            console.log('json: ', json)
    
            if (res.status === 200) {
              const jsonResponse = await res.json()
              console.log('jsonResponse: ', jsonResponse)
            } else {
              throw new Error("failed to authenticate user")
            }
          } catch (error) {
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