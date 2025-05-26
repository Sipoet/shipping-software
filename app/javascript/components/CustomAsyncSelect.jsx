import React from "react"
import { AsyncPaginate } from 'react-select-async-paginate'
import {CFormLabel} from '@coreui/react'
import { CFormFeedback } from '@coreui/react'
import {AuthContext} from '~/lib/context'
function CustomAsyncSelect({path,filter,limit = 10,readOnly,label,name,getOptionLabel,feedback,onChange,defaultValue,placeholder}){

  const selectRef = React.useRef(null)
  const [auth,setAuth] = React.useContext(AuthContext)
  const [inputId,setInputId] = React.useState('')
  getOptionLabel ||= (line)=>{return line.name}
  async function selectLoader(searchText,loadedOptions,{page}) {
    const params = new URLSearchParams()
    params.append("term", searchText)
    params.append("page", page)
    params.append("length", limit)
    params.append("filter", filter ||[])
    return auth.request(`${path}?${params}`).then((response)=>{
      if(response.status == 200){
        return response.json()
      }else {
        throw `error fetch select record ${path}`
      }
    }).then((jsonData)=>{
      return {
        options: jsonData.data.map((line)=>{
          return {label: getOptionLabel(line), value: line.id}
        }),
        hasMore: jsonData.total_pages > page,
        additional: {
          page: page + 1
        },

      }
    })
  }
  React.useEffect(() => {
    setInputId(selectRef.current.inputRef.id)
  }, []);


  return (
    <>
      <CFormLabel hidden={label == null} htmlFor={inputId} className="col-form-label">
            {label}
      </CFormLabel>
      <AsyncPaginate
        cacheOptions
        readOnly={readOnly}
        selectRef={selectRef}
        additional={{page:1}}
        loadOptions={selectLoader}
        name={name}
        className={feedback != null ? 'is-invalid':null}
        debounceTimeout={300}
        invalid={feedback != null}
        feedback={feedback}
        onChange={onChange}
        defaultValue={defaultValue}
        placeholder={placeholder} />
      <CFormFeedback invalid>{feedback}</CFormFeedback>
    </>
  )
}

export {CustomAsyncSelect}