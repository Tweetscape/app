import React from 'react'
import { Switch, Route } from 'react-router-dom'

import styles from './style.module.css'

import Navbar from 'Desktop/components/Navbar/Navbar'
import Dashboard from 'Desktop/pages/Dashboard/Dashboard'
import Splash from 'Desktop/pages/Splash/Splash'
import About from 'Desktop/pages/About/About'

export default function Desktop({ }) {
    return (
        <div className={styles.container}>
            <Navbar />
            <Switch>
                <Route path="/dashboard">
                    <Dashboard />
                </Route>
                <Route path="/about">
                    <About />
                </Route>
                <Route exact path="/">
                    <Splash />
                </Route>
            </Switch>
        </div>
    )
}