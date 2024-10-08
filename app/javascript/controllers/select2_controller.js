
import TomSelect from 'tom-select/dist/esm/tom-select.complete'
import { Controller } from "@hotwired/stimulus"
export default class extends Controller {

  initialize() {
    let elem = this.element
    let data = elem.dataset
    if(data.path == null){
      this._initSelectLocal();
    }else{
      this._initSelectRemote();
    }

  }

  _initSelectLocal(){
    let elem = this.element
    let data = elem.dataset
    console.log('allow empty',data.allowEmpty == 'true')
    this.select = new TomSelect(elem,{
      allowEmptyOption: data.allowEmpty == 'true',
    })
  }

  _initSelectRemote(){
    let elem = this.element
    let data = elem.dataset
    console.log('allow empty',data.allowEmpty == 'true')
    this.select = new TomSelect(elem,{
      allowEmptyOption: data.allowEmpty == 'true',
      valueField: 'id',
      labelField: data.selectLabel,
      searchField: data.selectLabel,
      load: function(query, callback) {
        console.log('masuk load')
        var url = `${data.path}.json?search[value]=${encodeURIComponent(query)}&search[regex]=true`;
        fetch(url)
          .then(response => response.json())
          .then(json => {
            callback(json.data);
          }).catch(()=>{
            console.error(`gagal request ${data.path}`)
            callback([]);
          });
      },
    })
  }
}