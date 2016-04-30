
var React = require('react-native');

var {
  StyleSheet,
  AppRegistry,
  Text,
  View,
  TextInput,
  AsyncStorage,
  TouchableHighlight,
  ScrollView,
  Picker,
  Image,
} = React;

//calling all the required files
var StringConstants = require("./src/config");
//I have created Transaction class to store the array of values that i will be using.
var Transaction1 = require("./src/transaction");
var styles = require("./src/styles");
var ListPopover = require("./src/list_popover");
var TransactionItem = require("./src/CustomComponents/transaction_item");
var MonthExpenseListView = require("./src/CustomComponents/month_expense_list_view");
var TypesOfTransaction = StringConstants.typesOfTransaction;
var TypeOfTransactionIcon = require("./src/CustomComponents/transaction_type_icon");
var CommonMethods = require("./src/common_methods");
var money = React.createClass({


  transaction:"",
  initTransactionsCalledOnce:false,
  shouldUpdateStateBool:true,

  componentDidMount() {
    //this where i need to load the data from disk.
    AsyncStorage.getItem(StringConstants.TRANSACTION_ARRAY)
    .then((tranasctions) => {this.initTransactions(tranasctions)})
    .catch((error) =>{console.log("error2 " + error);
      this.initTransactions(null)});
    },
    shouldComponentUpdate: function(nextProps, nextState) {
      return this.shouldUpdateStateBool;
    },

    //here i am passing the value that is being retrieved from the local storage if no value is retrieved undefined will be passed and new object will be created
    initTransactions:function(value)
    {
      if (!this.initTransactionsCalledOnce) {
        this.initTransactionsCalledOnce = true;
        this.transaction = new Transaction1(value);
        this.setState({transaction:this.transaction});
      }
    },

    getInitialState:function() {
      return {
        //this is the value for the field 1
        expenseName:"",
        //this is value for the field 2
        value:"",
        note:"",
        transactionType: StringConstants.SELECT_TRANSACTION_TYPE,
        isPopOverListVisible:true,
      };
    },

    render:function() {

      return <View style = {styles.container}>
        {this.renderSaveView()}
        {this.renderExtraButtons()}
        {this.renderListView()}
      </View>
    },


    renderSaveView:function() {
      return <View style = {[styles.saveView, this.border("yellow")]}>
        <View style = {[styles.textInputView, this.border("brown")]}>
          <TextInput style={[styles.textInput, this.border("black")]} placeholder="Expense Name" autoCapitalize = 'words' onChangeText={(text)=>{this.shouldUpdateStateBool = false; this.setState({expenseName:text.trim()})}} ref = {(component) => {this._expenseNameTextInput = component}} maxLength={15}/>
          <TextInput style = {[styles.textInput, this.border("black")]} placeholder="Value" onChangeText={(text)=>{this.shouldUpdateStateBool = false; this.setState({value:text.trim()})}} keyboardType="decimal-pad" ref = {(component) => {this._valueTextInput = component}}/>
        </View>
        <TextInput style = {[styles.textInput, this.border("black")]} placeholder= "Note" onChangeText ={(text)=>{this.shouldUpdateStateBool = false; this.setState({note:text.trim()})}} ref = {(component) => this._noteInputText = component} maxLength={30} />
        {this.renderSaveButtons()}
      </View>;
    },
    renderSaveButtons:function() {
      return <View style = {[styles.textInputView, this.border("blue")]} >
        {this.renderTouchableHighlight(StringConstants.typesOfTransaction.foodType)}
        {this.renderTouchableHighlight(StringConstants.typesOfTransaction.travelType)}
        {this.renderTouchableHighlight(StringConstants.typesOfTransaction.shoppingType)}
        {this.renderTouchableHighlight(StringConstants.typesOfTransaction.homeType)}
        {this.renderTouchableHighlight(StringConstants.typesOfTransaction.otherType)}
      </View>;
    },
    renderTouchableHighlight:function(typeOfTransaction) {
      return <TouchableHighlight style = {[styles.saveButton,]} onPress={()=>this.handleSavePress(typeOfTransaction)}>
        <TypeOfTransactionIcon typeOfTransaction = {typeOfTransaction} style = {{height:55, width:55, borderRadius:15}}/>
      </TouchableHighlight>
    },
    renderListView:function() {

      this.DeleteUtility.setThat(this);
      var currDate = new Date();
      return <MonthExpenseListView style = {styles.listViewStyle} transaction = {this.transaction} month = {currDate.getMonth()} year = {currDate.getFullYear()} deleteButtonPressed ={this.DeleteUtility}/>

    },
    renderExtraButtons:function() {
      return <View style = {[styles.extraButtonViewStyle, this.border("green")]}>
        <TouchableHighlight style = {[styles.extraButtonStyle, this.border("blue")]}>
          <View style={styles.extraButtonViewView}>
          <Image
            resizeMode="cover"
            style={[{height:30, width:30,}]}
            source={StringConstants.settingImage}
            />
          <Text style={styles.extraButtonTextStyle}>
            {StringConstants.SETTINGBUTTON}
          </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style = {[styles.extraButtonStyle, this.border("orange")]}>
          <View style={styles.extraButtonViewView}>
          <Image
            resizeMode="cover"
            style={[{height:30,width: 30,}]}
            source={StringConstants.calenderImage}
            />
          <Text style={styles.extraButtonTextStyle}>
            {StringConstants.YEARVIEW}
          </Text>
          </View>
        </TouchableHighlight>
      </View>
    },
    clearText:function()
    {
      if (this._expenseNameTextInput && this._valueTextInput) {
        this._expenseNameTextInput.setNativeProps({text:""});
        this._valueTextInput.setNativeProps({text:""});
        this._noteInputText.setNativeProps({text:""});
        this.shouldUpdateStateBool = false;
        this.setState({
          note:"",
          expenseName:"",
          value:"",
        });
      } else {
        console.log("Error while clearing text");
      }
    },
    DeleteUtility:{
      that:"",
      setThat(money1) {
        this.that = money1;
      },
      deleteThisTransaction:function(transactionItem) {
          console.log("printing from the good function " + transactionItem.name + " transacitonLenght " + this.that.transaction.getTransactionsLength());
          this.that.transaction.deleteTransaction(transactionItem);
          this.that.setState({transaction:this.that.transaction});
            AsyncStorage.setItem(StringConstants.TRANSACTION_ARRAY, JSON.stringify(this.that.transaction.getTransactionArray()));
        },

    },


    handleSavePress:function(typeOfTransaction) {

      this.shouldUpdateStateBool = true;
//here i am trying to show the dialog if something goes wrong
      var shouldShowDialog = false;
      var dialogString = "Please enter ";
      if (this.state.expenseName === "") {
        shouldShowDialog = true;
        dialogString += "Expense Name";
      } else if (this.state.value === "") {
        shouldShowDialog = true;
        dialogString += " Expense Amount";
      } else if (isNaN(this.state.value)) {
        dialogString += " Valid number in Expense Amount";
        shouldShowDialog = true;
      }
      if (shouldShowDialog) {
        CommonMethods.showSingleButtonAlert({title:"Aur bhai kya kar rahe ho", message:dialogString, buttonText:"Maan li baat", buttonFunction:function(){}})
        //if any of the field is empty you can show a message or dialog or something
      } else {
        //if everything is alright save it.
        this.transaction.putNewTransaction(this.state.expenseName, this.state.value, typeOfTransaction.name, this.state.note);
        this.setState({transaction:this.transaction});
        // AsyncStorage.setItem()

        AsyncStorage.setItem(StringConstants.TRANSACTION_ARRAY, JSON.stringify(this.transaction.getTransactionArray()));
        this.clearText();
      }
    },


    border:function(color)
    {
      return {
        borderColor: color,
        borderWidth: 1
      };
    },

    //list popover methods
    showListPopOver:function(){
      this.setState({isPopOverListVisible:true})
    },
    hideListPopOver:function() {
      this.setState({isPopOverListVisible:false});
    },
    transactionTypeSelectedInListPopOver:function(transactionTypeSelected) {
      this.setState({transactionType:transactionTypeSelected});
    },
  });
  AppRegistry.registerComponent('money', () => money);
