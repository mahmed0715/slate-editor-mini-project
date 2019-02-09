import React from 'react'
import styled from 'react-emotion'
import {
  HashRouter,
  Link as RouterLink,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom'

import RichText from './rich-text'

/**
 * our oroject.
 *
 * @type {Array}
 */

const PROJECTS = [
  ['Rich Text Editor', RichText, '/rich-text']
]

/**
 * Some styled components.
 *
 * @type {Component}
 */

const Nav = styled('div')`
  padding: 10px 15px;
  color: #aaa;
  background: #000;
`

const Title = styled('span')`
  margin-right: 0.5em;
`

const LinkList = styled('div')`
  float: right;
`

const Link = styled('a')`
  margin-left: 1em;
  color: #aaa;
  text-decoration: none;

  &:hover {
    color: #fff;
    text-decoration: underline;
  }
`

const TabList = styled('div')`
  padding: 15px 15px;
  background-color: #222;
  text-align: center;
  margin-bottom: 30px;

  & > * + * {
    margin-left: 0.5em;
  }
`

const MaskedRouterLink = ({ active, ...props }) => <RouterLink {...props} />

const Tab = styled(MaskedRouterLink)`
  display: inline-block;
  margin-bottom: 0.2em;
  padding: 0.2em 0.5em;
  border-radius: 0.2em;
  text-decoration: none;
  color: ${p => (p.active ? 'white' : '#777')};
  background: ${p => (p.active ? '#333' : 'transparent')};

  &:hover {
    background: #333;
  }
`

const Wrapper = styled('div')`
  max-width: 42em;
  margin: 0 auto 20px;
  padding: 20px;
`

const Example = styled(Wrapper)`
  background: #fff;
`

const Warning = styled(Wrapper)`
  background: #fffae0;

  & > pre {
    background: #fbf1bd;
    white-space: pre;
    overflow-x: scroll;
    margin-bottom: 0;
  }
`

/**
 * App.
 *
 * @type {Component}
 */

export default class App extends React.Component {
  /**
   * Initial state.
   *
   * @type {Object}
   */

  state = {
    error: null,
    info: null,
  }

  /**
   * Catch the `error` and `info`.
   *
   * @param {Error} error
   * @param {Object} info
   */

  componentDidCatch(error, info) {
    this.setState({ error, info })
  }

  /**
   * Render the example app.
   *
   * @return {Element}
   */

  render() {
    return (
      <HashRouter>
        <div>
          <TabList>
            {PROJECTS.map(([name, Component, path]) => (
              <Route key={path} exact path={path}>
                {({ match }) => (
                  <Tab to={path} active={match && match.isExact}>
                    {name}
                  </Tab>
                )}
              </Route>
            ))}
          </TabList>
          {this.state.error ? (
            <Warning>
              <p>
                An error was thrown by one of the example's React components!
              </p>
              <pre>
                <code>
                  {this.state.error.stack}
                  {'\n'}
                  {this.state.info.componentStack}
                </code>
              </pre>
            </Warning>
          ) : (
            <Example>
              <Switch>
                {PROJECTS.map(([name, Component, path]) => (
                  <Route key={path} path={path} component={Component} />
                ))}
                <Redirect from="/" to="/rich-text" />
              </Switch>
            </Example>
          )}
        </div>
      </HashRouter>
    )
  }
}
