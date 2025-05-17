
import TomSelect from 'tom-select'
import { Controller } from "@hotwired/stimulus"
export default class extends Controller {

  initialize() {
    let elem = this.element
    let data = elem.dataset
    let root = this
    let dropdownParent = this._createMenuWrapperElem()
    let options = {
      allowEmptyOption: data.allowEmpty == 'true',
      plugins: {
        remove_button:{
          title:'Remove this item',
        }
      },
      dropdownParent: dropdownParent,
      onDropdownOpen: function(){
        root._fixDropdownMenuStyle(dropdownParent)
      },
    }
    if(data.path == null){
      Object.assign(options, this._initSelectLocal());
    }else{
      Object.assign(options, this._initSelectRemote());
    }
    this.select = new TomSelect(elem,options)
  }

  _createMenuWrapperElem(){
    let dropdownParent = document.createElement('div')
    dropdownParent.setAttribute('class','ts-wrapper-custom')
    document.body.appendChild(dropdownParent)
    return dropdownParent
  }
  _fixDropdownMenuStyle(elem){
    let elemCoord = this.element.getBoundingClientRect()
    let inputWrapperElem = this.element.nextSibling
    let coordY = elemCoord.y + inputWrapperElem.clientHeight
    elem.style.top = `${coordY}px`
    elem.style.left = `${elemCoord.x - 5}px`
    elem.style.width = `${inputWrapperElem.clientWidth + 10}px`
  }

  _initSelectLocal(){
    return {}
  }

  _initSelectRemote(){
    let data = this.element.dataset
    return {
      valueField: data.selectValue || 'id',
      labelField: data.selectLabel,
      searchField: data.selectLabel,
      loadThrottle: 500,
      load: function(query, callback) {
        var url = `${data.path}?term=${encodeURIComponent(query)}`;
        fetch(url)
          .then(response => response.json())
          .then(json => {
            callback(json.data);
          }).catch(()=>{
            console.error(`gagal request ${data.path}`)
            callback([]);
          });
      },
    }
  }
}