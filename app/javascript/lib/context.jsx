import React from 'react'
import {Auth} from './auth'


const auth = new Auth()
const AuthContext = React.createContext([auth,(newAuth)=>{auth = newAuth}])
const CompanyContext = React.createContext([ {}, (val)=>{}])
const SettingContext = React.createContext([ {}, (val)=>{}])

export {CompanyContext,SettingContext,AuthContext}