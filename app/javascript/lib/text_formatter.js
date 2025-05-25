import { words, toString } from 'lodash'
import { DateTime } from 'luxon'
import { indonesianNumInWords } from 'i18n-num-in-words';
const  DEFAULT_DATE_FORMAT = 'dd LLL yyyy'
function phoneFormat(text){
  return words(text,/\d+4/g).join(' ')
}

function moneyFormat(money,currency){

}

function dateFormat(dateIso){
  return DateTime.fromISO(dateIso).toFormat(DEFAULT_DATE_FORMAT)
}

function datetimeFormat(dateIso,format = 'dd LLL yyyy HH:mm'){
  return DateTime.fromISO(dateIso).toFormat(format)
}

function numberToWord(number){
  return indonesianNumInWords(toString(number))
}

export {phoneFormat, dateFormat,datetimeFormat,numberToWord, moneyFormat, DEFAULT_DATE_FORMAT}