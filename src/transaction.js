
var StringConstants = require("./config");
function Transaction(transactionArray) {


  if (transactionArray) {

    this.transactionArray = JSON.parse(transactionArray);

  } else {

    this.transactionArray = [];
  }


}

Transaction.prototype.getDateForIndex = function(index) {
  return this.transactionArray[index].date;
}
Transaction.prototype.getNameForIndex = function(index) {
  return this.transactionArray[index].name;
}
Transaction.prototype.deleteTransaction = function(transaction) {
  var length = this.getTransactionsLength();
  for (i = 0; i < length; i++) {
    if (transaction.name === this.getNameForIndex(i) && transaction.date == this.getDateForIndex(i)) {
      this.transactionArray.splice(i, 1);
      break;
    }
  }
}


Transaction.prototype.getValueForIndex = function(index) {
  return Number(this.transactionArray[index].value, 10);
}
Transaction.prototype.getTypeForIndex = function(index) {
  return this.transactionArray[index].type;
}
Transaction.prototype.getNoteForIndex = function(index) {
  return this.transactionArray[index].note;
}
Transaction.prototype.getMonthExpenseList = function(month, year) {
  var resultArray = [];
  var len = this.getTransactionsLength();

  for (var i = 0; i < len; i++) {
    var currDate = new Date(this.getDateForIndex(i));

    if (currDate.getFullYear() == year && currDate.getMonth() == month) {
      var tempVar = this.getTransactionArray()[i];
      resultArray.push(tempVar);
    }
  }
  return resultArray;
}

Transaction.prototype.getTotalForMonth = function(month, year) {
  var result = 0;
  var len = this.getTransactionsLength();

  for (var i = 0; i < len; i++) {
    var currDate = new Date(this.getDateForIndex(i));
    if (currDate.getFullYear() == year && currDate.getMonth() == month) {
      try {

        result += this.getValueForIndex(i);
      } catch(e) {
        console.log("index " + i +"error while parsing int " + e);

      }

    }
  }
  return result;
}
Transaction.prototype.getTransactionTypeTotal = function(month, year)
{
  var typesOfTransactionLength = StringConstants.nameTypeOfTransaction.length;
  var transactionsOfMonth = this.getMonthExpenseList(month, year);
  var transactionArrayLength = transactionsOfMonth.length;
  var resultArray = [];
  var i, j;
  for (i = 0; i < typesOfTransactionLength; i++) {
    var transactionTypeName = StringConstants.nameTypeOfTransaction[i];
    for (j = 0; j < transactionArrayLength; j++) {
      var transaction = transactionsOfMonth[j];
      if (transaction.type === transactionTypeName) {
          if (!resultArray[transactionTypeName]) {
            resultArray[transactionTypeName] = Number(transaction.value, 10);
          } else {
            resultArray[transactionTypeName] += Number(transaction.value, 10);
          }
      }
    }
  }
  return resultArray;
}

Transaction.prototype.putNewTransaction = function(name, value, type, note) {
  this.transactionArray.push({name:name, value:value,type:type, note:note, date:new Date()});
}
Transaction.prototype.getTransactionsLength = function()
{
  return this.transactionArray.length;
}
Transaction.prototype.getTransactionArray = function()
{
  return this.transactionArray;
}
module.exports = Transaction;
