var React = require("react-native");
var closeImage = require("../../images/ic_close.png");
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var CommonMethods = require("../common_methods");
var Moment = require("moment");
var TypeOfTransactionIcon = require("./transaction_type_icon");
var StringConstants = require("../config");
//in this component pass the transaction and transaction item will be rendered(row for list of transactions)
module.exports = React.createClass({
  render: function()
  {

    console.log("reached here transactionItem " + Object.keys(this.props));


    return <View style = {styles.container}>
      <View style={styles.leftView}>

        <TypeOfTransactionIcon typeOfTransaction = {StringConstants.getTypeFromName(this.props.transactionItem.type)} style = {{height:55, width:55}}/>

        <View style={styles.textOnLeft}>

          <Text style={styles.nameText}>
            {this.props.transactionItem.name}
          </Text>

          <Text style={styles.noteText}>
            {this.props.transactionItem.note}
          </Text>

          <Text style={styles.dateText}>
            {Moment((this.props.transactionItem.date)).fromNow()}
          </Text>
          </View>
        </View>
        <View style={styles.rightView}>

          <Text style={styles.amountText} numberOfLines = {1}>
            {CommonMethods.getCurrencySymbol()} {this.props.transactionItem.value}
          </Text>
          <TouchableHighlight onPress={() => this.props.deleteButtonPressed.deleteThisTransaction(this.props.transactionItem)}>
          <Image
            style={styles.deleteButton}
            source={closeImage}
            />
          </TouchableHighlight>
        </View>
      </View>

  },

});

var styles = StyleSheet.create({
  container:{
    flex:1,
    borderWidth:1,
    flexDirection:"row",
    alignItems:"stretch",
    height:55,
    flexWrap:"nowrap"
  },
  leftView: {
    flexDirection:"row",
    flex:7,
    borderWidth:1,
    alignItems:"flex-start",
  },
  rightView: {
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    flex:3,
    borderWidth:1,
    backgroundColor:"white",
    flexWrap:"nowrap",
  },
  textOnLeft: {
    marginLeft:10,
    flexWrap:"nowrap"
  },

  nameText: {
    fontSize:20,
    fontWeight:"bold",
  },
  amountText: {
    fontSize:15,
    color:"red",
    marginRight:5,
    borderWidth:1,
    flex:30,
    fontWeight:"400",
  },
  noteText:{
    fontSize:12,
  },
  dateText: {
    fontSize:12,
  },
  deleteButton: {
    marginRight:3,
    height:10,
    width:10,
    padding:10,
    borderRadius:5,
    backgroundColor:"red",
    tintColor:"white",
    flex:1,
  },

});
