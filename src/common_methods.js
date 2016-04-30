dateFormat = require("dateformat");
var Alert = require("react-native").Alert;

var CommonMethods = {

  getDateFormat:function(date)
  {
    return dateFormat(date, "ddd, mmm dS, h:MM TT");
  },
  getCurrencySymbol:function()
  {
    return "₹";
  },

  getMonth:function(month)
  {

    var Months = {0:"Jan",
      1:"Feb",
      2:"Mar",
      3:"Apr",
      4:"May",
      5:"Jun",
      6:"Jul",
      7:"Aug",
      8:"Sep",
      9:"Oct",
      10:"Nov",
      11:"Dec",
      12:""};
      return Months[month]
    },
    getBorder:function(width, color) {
      return {
        borderWidth:width,
        borderColor:color,
      };
    },
    showSingleButtonAlert:function(alertObject) {
      Alert.alert(
        alertObject.title,
        alertObject.message,
        [
          {text: alertObject.buttonText, onPress: () => alertObject.buttonFunction()},
        ]
      )
    },

  }

  module.exports = CommonMethods;
