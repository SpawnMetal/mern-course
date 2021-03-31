// Здесь будет определяться весь набор ссылок
import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {AuthPage} from './pages/AuthPage'
import {LinksPage} from './pages/LinksPage'
import {CreatePage} from './pages/CreatePage'
import {DetailPage} from './pages/DetailPage'

export const useRoutes = isAuthenticated => {
  // Для тех, кто уже в системе
  if (isAuthenticated) {
    return (
      // Switch должен быть внутри BrowserRouter после return
      <Switch>
        <Route path="/links" exact>
          {/*exact нужен, чтобы он откликался исключительно на данную ссылку*/}
          <LinksPage />
        </Route>
        <Route path="/create" exact>
          <CreatePage />
        </Route>
        <Route path="/detail/:id">
          {/*Будет по id динамически определять, какую ссылку мы открыли*/}
          <DetailPage />
        </Route>
        <Redirect to="/create" />
        {/*Если не попали не на какую страницу, то редиректим в create*/}
      </Switch>
    )
  }

  // Для тех, кто ещё не в системе
  return (
    <Switch>
      <Route path="/" exact>
        <AuthPage />
      </Route>
      <Redirect to="/" />
    </Switch>
  )
}
