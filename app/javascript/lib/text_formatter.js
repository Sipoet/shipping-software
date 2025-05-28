import { words, toString } from 'lodash'
import { DateTime } from 'luxon'
import { indonesianNumInWords } from 'i18n-num-in-words'
import IMask from 'imask'
const  DEFAULT_DATE_FORMAT = 'dd LLL yyyy'

function phoneFormat(text){
  return words(text,/\d+4/g).join(' ')
}

function moneyFormat(money,currency='Rp.'){
  money ||= '0'
  const moneyImask = IMask.createPipe({
    mask: Number,
    scale: 2,
    thousandsSeparator: ',',
    padFractionalZeros: false,
    normalizeZeros: true,
    radix: '.',
    mapToRadix: ['.'],
    autofix: true,
  })
  return `${currency} ${moneyImask(money.toString())}`
}

function numberFormat(number){
  number ||= '0'
  const moneyImask = IMask.createPipe({
    mask: Number,
    scale: 5,
    thousandsSeparator: ',',
    padFractionalZeros: false,
    normalizeZeros: true,
    radix: '.',
    mapToRadix: ['.'],
    autofix: true,
  })
  return `${currency} ${moneyImask(number.toString())}`
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

export {phoneFormat,numberFormat, dateFormat,datetimeFormat,numberToWord, moneyFormat, DEFAULT_DATE_FORMAT}