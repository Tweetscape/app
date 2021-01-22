import React from 'react'

import { Link } from 'react-router-dom'

import styles from './style.module.css'

export default function Navbar({ }) {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.name}>Tweetscape</div>
                <div className={styles.rightContainer}>
                    <div>About</div>
                    <Link to="/">
                        <div>Launch App</div>
                    </Link>
                </div>
            </div>
        </div>
    )
}