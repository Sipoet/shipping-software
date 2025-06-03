import React from 'react';
import {createRoot } from 'react-dom/client'
import {TabulatorFull} from "tabulator-tables"; //import Tabulator library
import "tabulator-tables/dist/css/tabulator_bootstrap5.min.css"; //import Tabulator stylesheet
import {DateTime} from "luxon";
import { CaretDown, CaretUp, CaretUpDown, Eye, Pencil, X } from '@phosphor-icons/react';
import { CButton } from '@coreui/react';
import {find} from 'lodash'
import { useNavigate } from "react-router";
import { AuthContext } from '~/lib/context';



function isMobileDevice() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

function _deviceOption(){
  if (isMobileDevice()) {
    return {
      responsiveLayout: 'collapse',
      responsiveLayoutCollapseStartOpen:false,
      rowHeader: {formatter:"responsiveCollapse", width:48, hozAlign:"center", resizable:false, frozen: true},
    }// Current device is a mobile device
  }else{
    return {
      minHeight: '150px',
      // rowHeader: {hozAlign:"center", resizable: true, frozen: true},
      maxHeight:`${window.innerHeight -300}px`,
    }
  }
}

function _dateFormatter(cell,formatterParams,onRendered){
  let rawValue = cell.getValue()
  let value = DateTime.fromISO(rawValue)

  onRendered=()=>{return value.toFormat(formatterParams.outputFormat)}
  return value.toFormat(formatterParams.outputFormat)
}

function _enumFormatter(cell, formatterParams, onRendered){
  const value = cell.getValue()
  const label = find(formatterParams.enum,(e)=> e.value === value)?.label
  onRendered(()=>{
    createRoot(cell.getElement()).render(<>{label}</>)
  })
}




function _tomSelectEditor(cell, onRendered, success, cancel, editorParams){
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

  //when the value has been set, trigger the cell to update
  function successFunc(){
    let value = editor.tomselect.getValue()
    table.setFilter(editorParams.field,'=',value)
    success(value);
  }
  editor.addEventListener("change", successFunc);
  return editor;
}

function AsyncReactTabulator({columns,defaultFilter=[], ajaxURL,onRef}) {
  let el = React.createRef()
  let navigate = useNavigate()
  const [auth,setAuth] = React.useContext(AuthContext)

  function _decorateColumn(column){
    if(column.fieldType !=='action'){
      column.headerMenu = _headerMenu()
    }
    column.headerWordWrap = true
    column.headerFilter = column.headerFilter !== undefined  ? column.headerFilter : true
    column.resizable = 'header'
    if(column.noSort === true){
      column.headerSort = false
      column.headerFilter = false
    }
    let typeDef = _fieldType(column)
    Object.assign(column,typeDef)
    return column;
  }

  function _fieldType(column){
    switch (column.fieldType) {
      case 'link':
        return {
          formatter:'link',
          formatterParams: {
            labelField: column.field,
            urlField: column.recordPath,
            target:"_blank",
          },
          headerFilter: _tomSelectEditor,
          headerFilterParams:{
            path: column.link,
            labelField: column.linkLabel,
            field: column.filterField,
            placeholderLoading: 'Dalam proses...',
            placeholder: `pilih`,
          },
        }
      case 'enum':
        let data = column.enum
        return {
          formatter: column.formatter || _enumFormatter,
          headerFilter: 'list',
          headerFilterParams:{
            multiselect: true,
            clearable: true,
            values: Object.assign(data, {"":""})
          },
          formatterParams:{
            enum: data
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
        let listButtonDef = column.rowButtons
        return {
          formatter: column.formatter ? column.formatter : (cell, formatterParams, onRendered)=>{
              //cell - the cell component
              //formatterParams - parameters set for the column
              //onRendered - function to call when the formatter has been rendered
              const row = cell.getData();
              onRendered(()=>{
                createRoot(cell.getElement()).render(
                  <>{listButtonDef.map((buttonDef)=> {
                if(buttonDef == 'edit'){
                  return (<CButton key={`${row.id}-edit`} type='button' onClick={()=> navigate(`${row.view_path}/edit`) } color='primary'><Pencil /></CButton>)
                }else if(buttonDef == 'view'){
                  return (<CButton key={`${row.id}-view`} type='button' onClick={()=> navigate(row.view_path) } color='secondary'><Eye /></CButton>)
                }else if(buttonDef == 'delete'){
                  return (<CButton key={`${row.id}-delete`} type='button' onClick={()=> auth.request(pathname,{method: 'DELETE'}) }  color='danger'><X size={17} /></CButton>)
                }
              })}</>
                )
              })
              // return buttonsStringElems.join('');
          },
          headerSort: false,
          headerFilter: false,
          frozen: true,
        }
      default:
        return {
          sorter: 'string',
          formatter: column.formatter,
          sorterParams: {
            locale:true,
            alignEmptyValues:"top",
          },
          headerSortStartingDir:"asc"
        }
    }

  }

  function _headerMenu(){
    return [
      {
        label:"Hide Column",
        action:function(e, columnComponent){
            columnComponent.hide();
        }
      },
      // {
      //   label:"Show Columns",
      //   action:function(e, columnComponent){
      //       columnComponent.hide();
      //   }
      // },
      {
        label:"Freeze Column",
        action:function(e, columnComponent){
          let colDefs = columnComponent.getDefinition()
          colDefs.frozen = true
          columnComponent.updateDefinition(colDefs)
        }
      },
      {
        label:"Unfreeze Column",
        action:function(e, columnComponent){
          let colDefs = columnComponent.getDefinition()
          colDefs.frozen = false
          columnComponent.updateDefinition(colDefs)
        }
      },
      {
        label:"reset Filter",
        action:function(e, columnComponent){
          columnComponent.getTable().clearFilter()
        }
      },
    ]
  }
  function _convertToNewFilter(filters){
    let newFilter=[]
    for(const filter of filters){
      let column = _findColumn(filter.field)
      if(column == null){continue}
      newFilter.push(Object.assign(filter,{field: column.filterField || filter.field}))
    }
    return newFilter
  }

  function _convertToNewSort(sorters){
    let includes = []
    let sort = []
    for(const value of sorters){
      let column = _findColumn(value.field)
      if(column == null ){continue}
      sort.push({field: column.sortKey || column.field, dir: value.dir})
      if(typeof column.sortKey === 'string' && column.sortKey.includes('.')){
        includes.push(column.sortKey.split('.')[0])
      }
    }
    return {sort: sort, includes: includes}
  }

  function _findColumn(field){
    return columns.find(column => column.field === field)
  }
  let root= {};
  let sortElems = {};
  const defaultOptions = {
    ajaxURL: ajaxURL,
    dependencies:{
      DateTime: DateTime
    },
    columns: columns.map((column)=> _decorateColumn(column)),
    rowFormatter: function(row){
      if(row.getIndex() % 2 === 1){
        row.getElement().classList.add("table-light"); //mark rows with age greater than or equal to 18 as successful;
      }
    },
    headerSortElement: function(column, dir){
      const fieldName = column.getField()
      let rootie = root[fieldName]
      if(!rootie){
        sortElems[fieldName] = document.createElement('span')
        rootie= createRoot(sortElems[fieldName],{identifierPrefix: fieldName})
        root[fieldName] = rootie
      }
      rootie.render(
        <>
          <span hidden={dir!='asc'}><CaretUp  /></span>
          <span hidden={dir!='desc'}><CaretDown /></span>
          <span hidden={dir!='none'}><CaretUpDown /></span>
        </>
      )
      return sortElems[fieldName]
    },
    reactiveData: true,
    movableColumns: true,
    sortMode:"remote",
    filterMode:"remote",
    placeholder:"Data tidak ditemukan",
    headerSortClickElement:"icon",
    resizableColumnFit: true,
    layout: "fitColumns",
    rowHeight: 62,
    pagination: true,
    paginationSize: 20,
    paginationInitialPage:1,
    paginationMode:"remote",
    paginationCounter:"rows",
    ajaxRequestFunc: fetchData,
    ajaxConfig:{
      method:"GET", //set request type to Position
      headers: auth.defaultRequestHeader
    },
    dataReceiveParams:{
      "last_page":"total_pages",
    }
  }

  function fetchData(path, config, params){
    let newParam = {
      page: params.page,
      length: params.size,
    }
    if(params.filter.length > 0){
      newParam.filter = _convertToNewFilter(params.filter)
      newParam.filter = [...defaultFilter,...newParam.filter]
    }else{
      newParam.filter = defaultFilter
    }

    if(params.sort.length > 0){
      let sort = _convertToNewSort(params.sort)
      newParam = Object.assign(newParam, sort)
    }
    return new Promise(function(resolve, reject){
        auth.request(`${path}?params=${JSON.stringify(newParam)}`,{
          method: config.method,
          header: auth.defaultRequestHeader,
          body: config.method ==='POST' ?  JSON.stringify(params) : null,
        }).then((response)=>{
          if(response.status === 200){
            response.json().then((result)=>{
              resolve(result)
            })
          }else{
            reject()
          }
        })
    })
  }
  async function refreshTokenAndRefreh(tabulator){
    let newToken = await auth.refreshToken()
    if(newToken == null){
      auth.navigate('/users/sign_in')
    }else{
      tabulator.setData()
    }
  }

  React.useEffect(() => {
    let options = defaultOptions
    options = Object.assign(options,_deviceOption())
    let tabulator = new TabulatorFull(el, options)
    // tabulator.on("dataLoadError", function(error){
    //   console.error('tabulator event error',error)
    //   if(error.status ==401){
    //     refreshTokenAndRefreh(tabulator)
    //     auth.navigate('/users/sign_in')
    //   }
    // });
    tabulator.on('tableDestroyed',()=> {
      Object.values(root).forEach((rootie)=>{rootie.unmount()})
    })
    if(onRef != null){
      console.log('onf ref masuk')
      onRef(tabulator)
    }
  }, []);

  //add table holder element to DOM
  return (
    <div ref={elem => (el = elem)} />
  )
}
export {AsyncReactTabulator as AsyncReactTabulator}