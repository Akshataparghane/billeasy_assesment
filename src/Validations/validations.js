const {mongoose} = require("mongoose");

const isValid = function (value){
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length ===0) return false
    return true
}

const isValidRequestBody = function (requrestBody){
    return Object.keys(requrestBody).length >0
}

const checkName = function (value){
    let regex = /^[a-z\s]+$/i
    return regex.test(value)
}

const phoneNub = function (value){
    let regex = /^[6789][0-9]{9}$/
    return regex.test(value)
}

const emailMatch = function(value){
    let regex = /[a-zA-Z0-9_\-\.]+[@][a-z]+[\.][a-z]{2,3}/
    return regex.test(value)
}

const matchPass = function(value){
    let regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
    return regex.test(value)
}

const isValidPincode = function (value){
    let regex = /^[1-9]{1}[0-9]{5}$/;
    return regex.test(value)
}

const isValidObjectId = function(ObjectId){
    return mongoose.Types.ObjectId.isValid(ObjectId);
}

const isvalidRating = function(value){
    let regex = /^[0-5](.[5]?)?$/;
    return regex.test(value);
}

const checkISBN = function (value) {
  let regex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
  return regex.test(value);
};
const checkreleasedAt = function (value) {
  let regex = /^(19|20)\d\d([- /.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])$/;
  return regex.test(value);
};

module.exports = {isValid, isValidRequestBody,checkName,phoneNub,emailMatch,matchPass, isValidObjectId,isValidPincode, isvalidRating, checkISBN, checkreleasedAt}