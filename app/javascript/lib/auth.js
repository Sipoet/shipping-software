import {isEmpty,isFunction} from 'lodash'
class Auth{
  constructor(){
    this.navigate = null
  }

  async request(path,options){
    const newOptions = {...this.defaultOption,...options}
    try{
      return fetch(path,newOptions).catch((error)=>{
        console.log('request catch error',error)
        if(error.status == 401 && isFunction(this.navigate)){
          this.navigate('/users/sign_in')
        }
      })
    }catch(error){
      console.log('try catch error',error)
    if(error.status == 401 && isFunction(this.navigate)){
        this.navigate('/users/sign_in')
      }
    }

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
      'Authorization': this.token,
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
    return localStorage.getItem('jwtToken')
  }
  get csrfToken(){
    return document.head.querySelector('meta[name="csrf-token"]')?.content
  }

  saveToken(newToken){
    localStorage.setItem('jwtToken',newToken)
  }

  get isNotSignedIn(){
    return isEmpty(this.token)
  }

  get isSignedIn(){
    return !this.isNotSignedIn
  }

 async logout(){
    return this.request('/users/sign_out.json',{
      method:'DELETE',
    }).then((response)=>{
      if(response.status === 204){
        return response.text().then(result=> {
          this.saveToken(null)
          return {message:'Sukses Keluar',isSuccess: true}
        })
      }
      else if(response.status === 200){
        return response.json().then(result=> {
          this.saveToken(null)
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
  return localStorage.getItem('jwtToken')
}
export {Auth, getSavedToken}