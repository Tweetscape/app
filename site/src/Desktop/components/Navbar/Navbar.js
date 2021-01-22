import React from 'react'

import { Link } from 'react-router-dom'

import styles from './style.module.css'

export default function Navbar({ }) {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <Link to="/">
                    <div className={styles.name}>Tweetscape</div>
                </Link>
                <div className={styles.rightContainer}>
                    <Link to="/about">
                        <div>About</div>
                    </Link>
                    <Link to="/dashboard">
                        <div style={{ fontWeight: "bold" }}>Launch App</div>
                    </Link>
                </div>
            </div>
        </div>
    )
}