import {isEmpty,isFunction} from 'lodash'
const KEY_TOKEN = 'jwtToken'
const KEY_AUTH= 'authList'
class Auth{
  constructor(){
    this.navigate = null
  }

  set authList(value){
    localStorage.setItem(KEY_AUTH,JSON.stringify(value))
  }

  get authList(){
    return JSON.parse(localStorage.getItem(KEY_AUTH) || '{}')
  }

  async request(path,options = {}){
    let newOptions = {...this.defaultOption,...options}
    if(newOptions.noContentType){
      delete newOptions.headers['Content-Type']
      console.log(newOptions)
    }
    let response = null
    try{
      response = await fetch(path,newOptions)
      if(response.status === 401){
        if(options.hashRefreshTokenBefore){
          options.hashRefreshTokenBefore = false
          throw {status: 401}
        }
        let newToken = await this.refreshToken()
        if(newToken == null){
          throw {status: 401}
        }
        options.hashRefreshTokenBefore = true
        return this.request(path,options)
      }
      return response
    }catch(error){
      if(error.status === 401){
        if(isFunction(this.navigate)){
          this.navigate('/users/sign_in')
        }else{
          location.href ="/users/sign_in"
        }
      }else if(error.status === 403){
        if(isFunction(this.navigate)){
          this.navigate('/403')
        }else{
          location.href ="/403"
        }
      }else if(error.status === 404){
        if(isFunction(this.navigate)){
          this.navigate('/404')
        }else{
          location.href ="/404"
        }
      }else if([500,503].includes(error.status)){
        if(isFunction(this.navigate)){
          this.navigate('/500')
        }else{
          location.href ="/500"
        }
      }

      return response
    }

  }

  isAuthorize(resource,action) {
    if(this.authList['all']?.['all'] === true){
      return true
    }
    if(this.authList[resource]?.['all'] === true){
      return true
    }
    // debugger
    return this.authList[resource]?.[action] === true
  }

  async refreshToken(){
    let response  = await fetch('/users/refresh_token.json',{
      method: 'POST',
      headers: this.defaultRequestHeader
    })
    let newToken = response.headers.get('Authorization')
    if(response.status !== 200){
      return null
    }
    const result = await response.json()
    this.authList = result.authorization_list
    if(!isEmpty(newToken)){
      this.saveToken(newToken)
      return newToken
    }
    return null


  }

  get defaultOption(){
    return {
      method:'GET',
      headers: this.defaultRequestHeader
    }
  }

  get defaultRequestHeader(){
    return {
      'Content-Type':'application/json',
      'Authorization': this.token
    }
  }

  async login(user){
    return this.request('/users/sign_in.json',{
      method:'POST',
      body: JSON.stringify({user: user}),
      headers: {
        'Content-Type':'application/json',
        'X-CSRF-Token': this.csrfToken
      }
    }).then((response)=>{
      if(response.status == 200){
        return response.json().then(result=> {
          this.authList = result.authorization_list
          this.saveToken(response.headers.get('Authorization'))
          return {...result,isSuccess: true}
        })
      }
      if([422,401].includes(response.status)){
        return response.json().then(result=> {return {...result,isSuccess: false}})
      }
      return response.text().then((error)=> {
        console.error(error)
        return {...error,isSuccess: false}
      })
    })
  }
  get token(){
    return localStorage.getItem(KEY_TOKEN)
  }
  get csrfToken(){
    return document.head.querySelector('meta[name="csrf-token"]')?.content
  }

  saveToken(newToken){
    localStorage.setItem(KEY_TOKEN,newToken)
  }

  get isNotSignedIn(){
    return isEmpty(this.token)
  }

  get isSignedIn(){
    return !this.isNotSignedIn
  }
  removeToken(){
    localStorage.clear()
    // localStorage.removeItem(KEY_TOKEN)
    // localStorage.removeItem(KEY_AUTH)
  }

 async logout(){
    return this.request('/users/sign_out',{
      method:'DELETE',
    }).then((response)=>{
      if(response.status === 204){
        return response.text().then(result=> {
          this.removeToken()
          return {message:'Sukses Keluar',isSuccess: true}
        })
      }
      else if(response.status === 200){
        this.removeToken()
        return response.json().then(result=> {
          return {...result,isSuccess: true}
        })
      }
      else if([422,401].includes(response.status)){
        return response.json().then(result=> {return {...result,isSuccess: false}})
      }
      return response.text().then((error)=> {
        console.error(error)
        return {...error,isSuccess: false}
      })
    })
  }
}
function getSavedToken(){
  return localStorage.getItem(KEY_TOKEN)
}
export {Auth, getSavedToken}