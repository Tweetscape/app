import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation
} from 'react-router-dom'

import MediaQuery from 'react-responsive'

import Desktop from 'Desktop/index'
import Mobile from 'Mobile/index'

export default function App ({ }) {
  useEffect(() => {
    console.log('testing this out!: ', window.location.pathname)
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