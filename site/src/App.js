import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'

import MediaQuery from 'react-responsive'

import Desktop from 'Desktop/index'
import Mobile from 'Mobile/index'

export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path='/'>
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
}