
import { DateTime } from "luxon";
import {Tabulator, ResizeColumnsModule, EditModule,
        MoveColumnsModule, ResponsiveLayoutModule,
        AjaxModule, FormatModule, SortModule,
        FilterModule, PageModule} from 'tabulator-tables';
// import {TabulatorFull as Tabulator} from 'tabulator-tables';
Tabulator.registerModule([
  MoveColumnsModule,
  EditModule,
  ResizeColumnsModule,
  ResponsiveLayoutModule,
  FormatModule,
  AjaxModule,
  SortModule,
  FilterModule,
  PageModule
]);
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

  initialize() {
    try {
      this.columns = []
    let root = this;
    let path = this.element.dataset.path
    this._setColumn()
    let option = {
      dependencies:{
        DateTime: DateTime,
      },
      columns: this.columns,
      rowFormatter: function(row){
        if(row.getIndex() % 2 === 1){
            row.getElement().classList.add("table-light"); //mark rows with age greater than or equal to 18 as successful;
        }
      },
      ajaxURL: path,
      headerSortElement: function(column, dir){
        switch(dir){
            case "asc":
                return "<i class='ph ph-caret-up'>";
            case "desc":
                return "<i class='ph ph-caret-down'>";
            default:
                return "<i class='ph ph-caret-up-down'>";
        }
      },
      movableColumns: true,
      sortMode:"remote",
      filterMode:"remote",
      placeholder:"Data tidak ditemukan",
      headerSortClickElement:"icon",
      resizableColumnFit: true,
      layout: "fitColumns",
      pagination: true,
      paginationSize: 25,
      paginationInitialPage:1,
      paginationMode:"remote",
      paginationCounter:"rows",
      ajaxURLGenerator:function(path, config, params){
        let newParam = {
          page: params.page,
          length: params.size,
        }
        if(params.filter.length > 0){
          newParam.filter = root._convertToNewFilter(params.filter)
        }
        if(params.sort.length > 0){
          let sort = root._convertToNewSort(params.sort)
          newParam = Object.assign(newParam, sort)
        }
        return `${path}?params=${JSON.stringify(newParam)}`;
      },

      dataReceiveParams:{
        "last_page":"total_pages",
      },
    }
    Object.assign(option,this._deviceOption())
    this.table = new Tabulator(this.element, option)
    } catch (error) {
      alert(error.message)
    }

  }

  _setColumn(){
    Array.from(this.element.getElementsByTagName('th'))
         .forEach(element => {
      let colDataset = element.dataset
      let columnDef = {
        field: colDataset.field,
        fieldType: colDataset.fieldType,
        title: element.textContent.toString(),
        headerMenu: this._headerMenu(colDataset),
        headerWordWrap: true,
        headerFilter: true,
        resizable: 'header',
        sortKey: colDataset.sortKey,
        filterField: colDataset.filterField,
        width: 200,
      }
      if(colDataset.noSort !== undefined){
        columnDef.headerSort = false
        columnDef.headerFilter = false
      }
      let typeDef = this._fieldType(colDataset)
      Object.assign(columnDef,typeDef)
      this.columns.push(columnDef)
    },this);
  }

  isMobileDevice() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }

  _deviceOption(){
    if (this.isMobileDevice()) {
      return {
        responsiveLayout: 'collapse',
        responsiveLayoutCollapseStartOpen:false,
        rowHeader: {formatter:"responsiveCollapse", width:48, hozAlign:"center", resizable:false, frozen: true},
      }// Current device is a mobile device
    }else{
      return {
        minHeight: '150px',
        maxHeight:`${window.innerHeight -300}px`,
      }
    }
  }
  _convertToNewFilter(filters){
    let newFilter=[]
    for(const filter of filters){
      let column = this._findColumn(filter.field)
      if(column == null){continue}
      newFilter.push(Object.assign(filter,{field: column.filterField || filter.field}))
    }
    return newFilter
  }

  _convertToNewSort(sorters){
    let includes = []
    let sort = []
    for(const value of sorters){
      let column = this._findColumn(value.field)
      if(column == null ){continue}
      sort.push({field: column.sortKey || column.field, dir: value.dir})
      if(typeof column.sortKey === 'string' && column.sortKey.includes('.')){
        includes.push(column.sortKey.split('.')[0])
      }
    }
    return {sort: sort, includes: includes}
  }

  _findColumn(field){
    return this.columns.find(column => column.field === field)
  }


  _fieldType(colDataset){
    switch (colDataset.fieldType) {
      case 'link':
        return {
          formatter: "link",
          formatterParams: {
            labelField: colDataset.field,
            urlField: colDataset.recordPath,
            target:"_blank",
          },
          headerFilter: this._tomSelectEditor,
          headerFilterParams:{
            path: colDataset.link,
            labelField: colDataset.linkLabel,
            field: colDataset.filterField,
            placeholderLoading: 'Dalam proses...',
            placeholder: `pilih`,
          },
        }
      case 'enum':
        let data = JSON.parse(colDataset.enum)
        return {
          headerFilter: 'list',
          headerFilterParams:{
            multiselect: true,
            clearable: true,
            values: Object.assign(data, {"":""})
          }
        }
      case 'date':
        return {
          formatter: 'datetime',
          formatterParams: {
            inputFormat: "iso",
            outputFormat:"dd/MM/yy",
            invalidPlaceholder:"(invalid date)",
            timezone: "Asia/Bangkok",
          },
          sorter: 'date',
          sorterParams: {
            format:"iso",
          }
        }
      case 'datetime':
        return {
          formatter: 'datetime',
          formatterParams: {
            inputFormat: "iso",
            outputFormat:"dd/MM/yy HH:mm",
            invalidPlaceholder:"(invalid datetime)",
            timezone: "Asia/Bangkok",
          },
          sorter: 'datetime',
          sorterParams: {
            format:"iso",
            locale:true,
            alignEmptyValues:"top",
          }
        }
      case 'money':
        return {
          formatter:"money",
          formatterParams:{
              decimal:".",
              thousand:",",
              symbol:"Rp",
              negativeSign:true,
          },
          sorter: 'number',
          sorterParams:{
            thousandSeparator:",",
            decimalSeparator:".",
            alignEmptyValues:"top",
          }
        }
      case 'action':
        let listButtonDef = colDataset.rowButton.split(',')
        return {
          formatter: function(cell, formatterParams, onRendered){
              //cell - the cell component
              //formatterParams - parameters set for the column
              //onRendered - function to call when the formatter has been rendered
              var row = cell.getRow(cell).getData();
              let buttonsStringElems = listButtonDef.map((buttonDef)=> {
                if(buttonDef == 'edit'){
                  return `<a href="${row.edit_path}" class="btn btn-primary"><i class="ph ph-pencil"></i></a>`
                }else if(buttonDef == 'view'){
                  return `<a href="${row.view_path}" class="btn btn-secondary"><i class="ph ph-eye"></i></a>`
                }else if(buttonDef == 'delete'){
                  return `<a href="${row.destroy_path}" data-turbo-method="delete" class="btn btn-danger"><i class="ph ph-x"></i></a>`
                }
              })
              return buttonsStringElems.join('');
          },
          headerSort: false
        }
      default:
        return {
          sorter: 'string',
          sorterParams: {
            locale:true,
            alignEmptyValues:"top",
          },
          headerSortStartingDir:"asc"
        }
    }

  }

  _headerMenu(colDataset){
    return [
      {
        label:"Hide Column",
        action:function(e, column){
            column.hide();
        }
      },
    ]
  }

  _tomSelectEditor(cell, onRendered, success, cancel, editorParams){
    //cell - the cell component for the editable cell
    //onRendered - function to call when the editor has been rendered
    //success - function to call to pass thesuccessfully updated value to Tabulator
    //cancel - function to call to abort the edit and return to a normal cell
    //editorParams - params object passed into the editorParams column definition property

    //create and style editor
    var editor = document.createElement("select")
    editor.setAttribute("class", "form-select")
    editor.setAttribute("name", editorParams.field)
    editor.setAttribute("multiple", true)
    editor.setAttribute("data-allow-empty", 'true')
    editor.setAttribute("data-path", editorParams.path)
    editor.setAttribute("data-select-label", editorParams.labelField || 'label')
    editor.setAttribute("data-placeholder", editorParams.placeholder)
    editor.setAttribute("data-controller", 'select2')

    //set focus on the select box when the editor is selected (timeout allows for editor to be added to DOM)
    onRendered(function(){
        editor.focus();
    });
    let root = this
    //when the value has been set, trigger the cell to update
    function successFunc(){
      let value = editor.tomselect.getValue()
      root.table.setFilter(editorParams.field,'=',value)
      success(value);
    }
    editor.addEventListener("change", successFunc);
    return editor;
  }

}
