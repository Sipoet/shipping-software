import React from "react"
import { AsyncPaginate } from 'react-select-async-paginate'
import {CFormLabel} from '@coreui/react'
import { CFormFeedback } from '@coreui/react'
import {AuthContext} from '~/lib/context'
import {isFunction} from 'lodash'

function defaultOptionLabel(line){
  return line.name
}
function defaultOptionValue(line){
  return line.id
}
function CustomAsyncSelect({path,filter=[],localTextFilter,onChange,optionLabel,getOptionValue,feedback,limit = 10,getOptionLabel,label,...props}){

  const selectRef = React.useRef(null)
  const [auth,setAuth] = React.useContext(AuthContext)
  const [inputId,setInputId] = React.useState('')

  getOptionLabel ||= defaultOptionLabel
  getOptionValue ||= defaultOptionValue
  async function selectLoader(searchText,loadedOptions,page) {
    const params = JSON.stringify({
      term: searchText,
      page: page,
      length: limit,
      filter: filter
    })
    const response = await auth.request(`${path}?params=${params}`)
    if(response.status == 200){
      const jsonData = await response.json()
      const hasMore = jsonData.total_pages !== null ? jsonData.total_pages > page : false
      return {
        options: getOptions(jsonData.data,searchText),
        hasMore: hasMore,
        additional: page + 1,
      }
    }else {
      throw `error fetch select record ${path}`
    }
  }

  React.useEffect(() => {
    setInputId(selectRef.current.inputRef.id)
  }, []);

  function getOptions(data,searchText){
    if(localTextFilter){
      const regex = new RegExp(searchText,'i')
      data = data.filter((line)=>{
        return regex.test(getOptionLabel(line))
      })
    }
    return data.map((line)=>{
      return {label: getOptionLabel(line),data: line, value: getOptionValue(line)}
    })
  }
  function onSelectChange(selectValue,metadata){
    if(isFunction(onChange)){
      metadata.optionLabel = optionLabel
      onChange(selectValue,metadata)
    }
  }

  return (
    <>
      <CFormLabel hidden={label == null} htmlFor={inputId} className="col-form-label">
            {label}
      </CFormLabel>
      <AsyncPaginate
        selectRef={selectRef}
        additional={1}
        loadOptions={selectLoader}
        onChange={onSelectChange}
        className={feedback != null ? 'is-invalid custom-react-select':'custom-react-select'}
        debounceTimeout={300}
        {...props} />
      <CFormFeedback invalid>{feedback}</CFormFeedback>
    </>
  )
}

export {CustomAsyncSelect}