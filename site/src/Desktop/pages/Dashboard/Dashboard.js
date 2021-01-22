import React from 'react'


import styles from './style.module.css'


export default function Dashboard({ }) {
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
                    <div className={styles.twitterCard}>
                    </div>
                    <div className={styles.twitterCard}>
                    </div>
                    <div className={styles.twitterCard}>
                    </div>
                    <div className={styles.twitterCard}>
                    </div>                                                            
                </div>
            </div>
        </div>
    )
}