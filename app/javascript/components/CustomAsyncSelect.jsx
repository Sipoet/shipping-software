import React from "react"
import { AsyncPaginate } from 'react-select-async-paginate'
import {CFormLabel} from '@coreui/react'
import { CFormFeedback } from '@coreui/react'
import {AuthContext} from '~/lib/context'
import {isFunction} from 'lodash'

function defaultOptionLabel(line){
  return line.name
}
function CustomAsyncSelect({path,filter,onChange,optionLabel,feedback,limit = 10,getOptionLabel,label,...props}){

  const selectRef = React.useRef(null)
  const [auth,setAuth] = React.useContext(AuthContext)
  const [inputId,setInputId] = React.useState('')

  getOptionLabel ||= defaultOptionLabel
  async function selectLoader(searchText,loadedOptions,page) {
    const params = new URLSearchParams()
    params.append("term", searchText)
    params.append("page", page)
    params.append("length", limit)
    params.append("filter", filter ||[])

    const response = await auth.request(`${path}?${params}`)
    if(response.status == 200){
      const jsonData = await response.json()
      return {
        options: jsonData.data.map((line)=>{
          return {label: getOptionLabel(line), value: line.id}
        }),
        hasMore: jsonData.total_pages > page,
        additional: page + 1,
      }
    }else {
      throw `error fetch select record ${path}`
    }
  }

  React.useEffect(() => {
    setInputId(selectRef.current.inputRef.id)
  }, []);

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
        className={feedback != null ? 'is-invalid':null}
        debounceTimeout={300}
        {...props} />
      <CFormFeedback invalid>{feedback}</CFormFeedback>
    </>
  )
}

export {CustomAsyncSelect}