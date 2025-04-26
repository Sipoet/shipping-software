import { Controller } from "@hotwired/stimulus"
export default class extends Controller {

  request(){
    let formElem = createFormElement()
    formElem.submit()

  }
  createFormElement(){
    let link = this.element.href
    let httpMethod = this.element.dataset.httpMethod
    let formElem = this.element.createElement('form')
    formElem.setAttribute('method',httpMethod)
    formElem.setAttribute('action',link)
    formElem.setAttribute('class','hide')
    return formElem
  }
}