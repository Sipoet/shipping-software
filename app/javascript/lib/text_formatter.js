import { words } from 'lodash'
import { DateTime } from 'luxon'
function phoneFormat(text){
  return words(text,/\d+4/g).join(' ')
}

function moneyFormat(money,currency){

}

function dateFormat(dateIso){
  return DateTime.fromISO(dateIso).toFormat('dd LLL yyyy')
}

function datetimeFormat(dateIso,format = 'dd LLL yyyy HH:mm'){
  return DateTime.fromISO(dateIso).toFormat(format)
}

export {phoneFormat, dateFormat,datetimeFormat, moneyFormat}