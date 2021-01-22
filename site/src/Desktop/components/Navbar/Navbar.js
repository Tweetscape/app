import React from 'react'

import { Link, Switch, Route } from 'react-router-dom'

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
                    <Switch>
                        <Route path="/dashboard">
                            <div style={{ fontWeight: "bold" }}>Sign In</div>
                        </Route>
                        <Route path="*">
                            <Link to="/dashboard">
                                <div style={{ fontWeight: "bold" }}>Launch App</div>
                            </Link>
                        </Route>
                    </Switch>
                </div>
            </div>
        </div>
    )
}