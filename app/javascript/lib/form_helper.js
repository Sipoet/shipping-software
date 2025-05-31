import {snakeCase, cloneDeep} from 'lodash'
import { createModel } from './model'
import pluralize from 'pluralize'

class FormHelper {

  constructor(auth){
    this.auth = auth
  }

  async findRecord(modelName, id,options={}){
    if(id == null){return null}
    this._initProgress(options)
    let pathNamespace = this.pathFromModelName(modelName)
    return this.auth.request(`/${pathNamespace}/${id}.json`)
    .then((response)=>{
      this.showProgressBar(response.clone(),options)
      if(response.status ==200 || response.status == 304){
        return response.json()
      }else if(response.status == 404){
        return null
      }
      else {
        throw {status: response.status,message: `error find record ${response.text()}`}
      }
    }).then((jsonData)=> {
      return createModel(modelName, jsonData)})
  }

  pathFromModelName(modelName){
    return pluralize.plural(snakeCase(modelName))
  }

  async saveRecord(model,options = {}){
    this._initProgress(options)
    if(model.isNewRecord){
      return this._createRecord(model,options)
    }else{
      return this._updateRecord(model,options)
    }
  }

  requestBody(model){
    let keyBody = snakeCase(model._modelName)
    return JSON.stringify({[keyBody]: model.attributes})
  }

  async _initProgress(options){
    if(!options.showProgress){return;}
    options.setProgressColor('info')
    options.setProgressBar(1)
    let intervalId = setInterval(()=>{
      if(options.progressBar === 0){
        clearInterval(intervalId)
      }
      if(options.progressBar > 95 || options.progressColor !='info'){
        options.setProgressBar(0)
        return;
      }
      options.setProgressBar(++options.progressBar)
    },500)
  }

  async  showProgressBar(response, options){
    if(!options.showProgress){return;}
    let contentLength = parseInt(response.headers.get('content-length') || '1') ;
    let reader = response.body.getReader();
    return reader.read().then(({ done, value }) => {
      let lengthy = value.byteLength / contentLength * 100
      if(done || lengthy >= 100){
        options.setProgressBar(100)
        if([200,201,203].includes(response.status)){
          options.setProgressColor('success')
        }else{
          options.setProgressColor('danger')
          options.progressColor = 'danger'
        }
        setTimeout(()=>{options.setProgressBar(0)},1000)
      }else{
        options.setProgressBar(lengthy)
      }

    })
  }

  async _createRecord(model, options={}){
    let pathNamespace = this.pathFromModelName(model._modelName)
    return this.auth.request(`/${pathNamespace}.json`,
      {
        method:'POST',
        body: this.requestBody(model),
      }).then((response)=>{
        this.showProgressBar(response.clone(), options)
        if(response.status == 201) {
          return response.json().then((result)=> {
            model.setAttributes(result.data)
            return {
              isSuccess: true,
              record: model,
              message:result.message
            }
          })
        }else if(response.status == 422){
          return response.json().then((result)=> {
            return {
              isSuccess: false,
              error: result.error,
              message: result.message
            }
          })
        }
        response.text().then((error)=> {
          throw {status: response.status,message:`error create record. ${error}`}
        })
      })
  }

  _updateRecord(model, options = {}){
    let pathNamespace = this.pathFromModelName(model._modelName)
    return this.auth.request(`/${pathNamespace}/${model.id}.json`,
      {
        method:'PUT',
        body: this.requestBody(model)
      }).then((response)=>{
        this.showProgressBar(response.clone(), options)
        if(response.status == 200) {
          return response.json().then((result)=> {
            model.setAttributes(result.data)
            return {
              isSuccess: true,
              record: model,
              message: result.message
            }
          })
        }else if(response.status == 422){
          return response.json().then((result)=> {
            return {
              isSuccess: false,
              error: result.error,
              message: result.message
            }
          })
        }
        response.text().then((error)=> {
          throw `error update record. ${error}`
        })
      }).finally(()=>{
         if(options.showProgress){
          setTimeout(()=>{
            options.setProgressBar(0)
            options.setProgressColor('info')
          },1000)

        }
      })
  }

  deleteRecord(model){
    this._initProgress(options)
    let pathNamespace = this.pathFromModelName(model._modelName)
    return this.auth.request(`/${pathNamespace}/${model.id}.json`,
      {
        method:'DELETE',
      }).then((response)=>{
        this.showProgressBar(response.clone(), options)
        if([200,204].includes(response.status)) {
          return true
        }else if(response.status == 422){
          return response.json().then((result)=> {
            return {
              isSuccess: false,
              error: result.error,
              message: result.message
            }
          })
        }
        response.text().then((error)=> {
          throw `error delete record. ${error}`
        })
      })
  }
}

function changeCloneRecord(record,changeParams=[]) {
  let newRecord = cloneDeep(record)
  for(let index = 0;index <= changeParams.length;index+=2 ){
    newRecord[changeParams[index]] = changeParams[index + 1]
  }
  return newRecord
}

export { FormHelper, changeCloneRecord}