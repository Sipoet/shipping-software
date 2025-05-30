import React from 'react'
import {Auth} from './auth'


const auth = new Auth()
const AuthContext = React.createContext([auth,(newAuth)=>{newAuth}])

const SettingContext = React.createContext([ {}, (val)=>{}])
const CompanyContext = React.createContext([ {}, (val)=>{}])
function CompanyProvider(props){
  const [company,setCompany] = React.useState({contact_numbers:[]})
  React.useEffect(()=>{
    auth.request('/system_settings/company.json').then((response)=>{
      if(response.status === 200){
        response.json().then((result)=> setCompany(result))
      }else{
        response.text().then((result)=> console.error(result))
      }
    })
  },[])

  return (
    <CompanyContext.Provider value={[company,setCompany]}>
      {props.children}
    </CompanyContext.Provider>
  )
}
export {CompanyProvider,CompanyContext,SettingContext,AuthContext}