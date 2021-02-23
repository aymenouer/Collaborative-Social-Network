import React from 'react'
import {Switch , Route} from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
function body() {
    return (
       <section>
           <Switch>
               <Route path="/login" component={Login} exact  />
               <Route path="/register" component={Register} exact  />
           </Switch>
       </section>
    )
}

export default body
