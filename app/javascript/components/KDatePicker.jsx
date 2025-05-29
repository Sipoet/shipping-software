
import { CFormLabel, CFormFeedback } from "@coreui/react";
import DatePicker,{setDefaultLocale,registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { id } from 'date-fns/locale/id';
registerLocale('id', id)
setDefaultLocale('id', id)
function KDatePicker({label,feedback,value,onChange,popperPlacement,placeholder,...props}){

  return (
      <>
        <CFormLabel hidden={label == null} className="col-form-label" htmlFor={props.id}>{label}</CFormLabel>
        <DatePicker
          showIcon
          highlightDates={[new Date()]}
          dateFormat={props.showTimeInput ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy"}
          closeOnScroll={true}
          className={feedback != null ? 'is-invalid form-control':'form-control'}
          // toggleCalendarOnIconClick
          isClearable={!props.required}
          placeholderText={placeholder || props.showTimeInput ? 'dd/mm/yyyy HH:MM' : 'dd/mm/yyyy'}
          popperPlacement={popperPlacement || "bottom-start"}
          {...props}
          onChange={(date)=> onChange(date,props.name)}
          selected={value} />
        <CFormFeedback invalid>{feedback}</CFormFeedback>
      </>

  )
}
export {KDatePicker}