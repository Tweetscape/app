import React, { useEffect, useState } from 'react'

import styles from './style.module.css'
import TwitterCard from 'Desktop/components/TwitterCard/TwitterCard'


export default function Dashboard({ }) {
    const [myLists, setMyLists] = useState([])
    const [twitterPosts, setTwitterPosts] = useState([1, 2, 3])

    useEffect(() => {
        async function getIt() {
            try {
                const response = await fetch("https://h27pptsq0k.execute-api.us-east-1.amazonaws.com/mylists")
                const json = await response.json()
    
                console.log('response for myLists: ', json)
                setMyLists(json)
            } catch (error) {
                console.log('error fetching my lists!: ', error)
            }    
        }

        // getIt()
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