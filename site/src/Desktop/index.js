import React from 'react'
import { Switch, Route } from 'react-router-dom'

import styles from './style.module.css'

import Navbar from 'Desktop/components/Navbar/Navbar'
import Dashboard from 'Desktop/pages/Dashboard/Dashboard'
import Splash from 'Desktop/pages/Splash/Splash'

export default function Desktop({ }) {
    return (
        <div className={styles.container}>
            <Navbar />
            <Switch>
                <Route exact to="/">
                    <Splash />
                </Route>
                <Route to="/dashboard">
                    <Dashboard />
                </Route>
            </Switch>
        </div>
    )
}