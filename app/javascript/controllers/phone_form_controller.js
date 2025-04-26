import { Controller } from "@hotwired/stimulus"
export default class extends Controller {

  initialize(){
    this.elemVal = this.element.querySelector("input[type='hidden']")
    this.elemUi = this.element.querySelector("input[type='text']")
    let inputText = this.elemVal.value
    this.elemUi.value = this._formatPhone(inputText)
    this.elemVal.value = this._convertPhoneValue(inputText)
  }

  convertPhone(event){
    let inputText = event.target.value.replace(/\D/g,'')
    this.elemUi.value = this._formatPhone(inputText)
    this.elemVal.value = this._convertPhoneValue(inputText)
  }

  _formatPhone(value){
    return value.replace(/^(0|\+?62)/,'')
  }

  _convertPhoneValue(value){
    value = value.replace(/^0/,'+62')
    if(value[0] !== '+'){
      value = '+62'+value
    }
    return value
  }
}