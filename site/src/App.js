import React, { useEffect, useState, useContext } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation
} from 'react-router-dom'

import MediaQuery from 'react-responsive'

import Desktop from 'Desktop/index'
import Mobile from 'Mobile/index'
import { store } from 'utils/store'

const apiEndpoint = "https://h27pptsq0k.execute-api.us-east-1.amazonaws.com/auth/login/success"

export default function App ({ }) {
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)

  const { dispatch, state } = useContext(store)
  
  useEffect(() => {
    async function fetchUser() {
      let res 

      try {
        res = fetch(apiEndpoint, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
          }
        })

        if (res.status === 200) {
          const jsonResponse = res.json()
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
  }, [window.location.pathname])
  
  return (
    <Router>
      <Switch>
        <Route path='/'>
          <MediaQuery minWidth={720}>
            <Desktop />
          </MediaQuery>
          <MediaQuery maxWidth={719}>
            <Mobile />
          </MediaQuery>
        </Route>          
        <Route path='*'>
          <div>404 Page not Found</div>
        </Route>          
      </Switch>
    </Router>
  )
}