import React from 'react'

import styles from './style.module.css'

export default function TwitterCard ({ data }) {
    const { favourites_count, text, user } = data 
    let name = user?.name 
    
    return (
        <div className={styles.twitterCard} style={{ color: 'black', border: '1px solid black', padding: "20px" }}>
            {text} - {name}
        </div>
    )
}