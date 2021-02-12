import React from 'react'

import styles from './style.module.css'

export default function TwitterCard ({ data }) {
    const { favorite_count, text, user, retweet_count, created_at, id_str } = data 
    let name = user?.name 
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const handleClick = () => window.open(`https://twitter.com/anyuser/status/${id_str}`, '_blank')
    const dateVal = new Date(created_at).toLocaleString() //("en-US", options)
    return (
        <div onClick={handleClick} className={styles.twitterCard} style={{ color: 'black', border: '1px solid black', padding: "20px" }}>
            {text}
            <div className={styles.metadata}>
                <div className={styles.metric}>
                    {`@${name}`}
                </div>                
                <Metric label="Favorites" value={favorite_count} />
                <Metric label="Retweets" value={retweet_count} />
                <div className={styles.metric}>
                    {`${dateVal}`}
                </div>  
            </div>
        </div>
    )
}

const Metric = ({label, value}) => {
    return (
        <div className={styles.metricComponent}>
            <div className={styles.metricHeader}>
                {`${label}:`}
            </div>
            <div className={styles.metricValue}>
                {value}
            </div>
        </div>
    )
}