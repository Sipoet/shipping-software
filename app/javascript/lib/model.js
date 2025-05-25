import {merge, forOwn} from 'lodash'
const blackListKey = ['_dataBefore','_modelName']
class Model {
  constructor(modelName,data){
    this._modelName = modelName
    this._dataBefore = data
    this.id = data.id
    merge(this,data)
  }

  get isNewRecord(){
    return this.id ==  null;
  }

  get attributes(){
    let result ={};
    forOwn(this,(value,key)=> {
      if(blackListKey.includes(key)){return;}
      result[key] = value
    })
    return result
  }

  setAttributes(data) {
    merge(this,data)
  }

  saved() {
    this._dataBefore = this.attributes
  }

  get isChanged(){
    return this._dataBefore == this.attributes
  }

  rollback(){
    forOwn(this,(value,key)=> {
      if(blackListKey.includes(key)){return;}
      this[key] = this._dataBefore[key] || null
    })
  }

}

function createModel(modelName,data={}){
  if(data == null){data = {}}
  return new Model(modelName,data)
}

export {createModel, Model}