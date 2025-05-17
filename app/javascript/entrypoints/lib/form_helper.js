import {snakeCase} from 'lodash'
import { createModel } from './model'
import pluralize from 'pluralize'

async function findRecord(modelName, id,options={}){
  if(id == null){return null}
  _initProgress(options)
  let pathNamespace = pathFromModelName(modelName)
  return fetch(`${pathNamespace}/${id}.json`,{method:'GET',headers:{'Content-Type':'application/json'}})
  .then((response)=>{
    showProgressBar(response.clone(),options)
    if(response.status ==200 || response.status == 304){
      return response.json()
    }
    else {
      throw `error find record ${response.body}`
    }
  }).then((jsonData)=> {
    return createModel(modelName, jsonData)})
}

function pathFromModelName(modelName){
  return pluralize.plural(snakeCase(modelName))
}

async function saveRecord(model,options = {}){
  _initProgress(options)
  if(model.isNewRecord){
    return _createRecord(model,options)
  }else{
    return _updateRecord(model,options)
  }
}

function requestBody(model){
  let keyBody = snakeCase(model._modelName)
  return JSON.stringify({[keyBody]: model.attributes})
}

async function _initProgress(options){
  if(!options.showProgress){return;}
  options.setProgressColor('info')
  options.setProgressBar(7)
}

async function showProgressBar(response, options){
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
      }
      setTimeout(()=>{options.setProgressBar(0)},1000)
    }else{
      options.setProgressBar(lengthy)
    }

  })
}

async function _createRecord(model, options={}){
  let pathNamespace = pathFromModelName(model._modelName)
  return fetch(`${pathNamespace}.json`,
    {
      method:'POST',
      body: requestBody(model),
      headers:{'Content-Type':'application/json'}
    }).then((response)=>{
      showProgressBar(response.clone(), options)
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
        throw `error create record. ${error}`
      })
    })
}

function _updateRecord(model, options = {}){
  let pathNamespace = pathFromModelName(model._modelName)
  return fetch(`${pathNamespace}/${model.id}.json`,
    {
      method:'PUT',
      body: requestBody(model),
      headers:{'Content-Type':'application/json'}
    }).then((response)=>{
      showProgressBar(response.clone(), options)
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
    })
}

function deleteRecord(model){
  let pathNamespace = pathFromModelName(model._modelName)
  return fetch(`${pathNamespace}/${model.id}.json`,
    {
      method:'DELETE'
    }).then((response)=>{
      if(response.status == 203) {
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



export {findRecord, saveRecord, deleteRecord}