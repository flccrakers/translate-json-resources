import React, { Component } from "react";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import Divider from "material-ui/Divider";
import {fullWhite} from 'material-ui/styles/colors';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import "./App.css";

const styles = {
  line: {
    display: "flex",
    alignItems: "center",
    flex: "0 0 50px",
    //verticalAlign: 'middle',
    padding: "8px 8px 8px 8px",
    //height: '50px',
    minHeight: "0px"
  },
  button: {
    margin: "8px"
  },

  txtBold: {
    fontColor: "black",
    fontWeight: "bold",
    cursor: "default",
    width: "300px"
  },
  TextField: {
    marginLeft: "50px",
    width: "400px"
    //color: 'red',
  },
  TextFieldValue: {
    color: "green",
    cursor: "pointer",
    fontWeight: "bold"
  },
  TextFieldValueOrigin: {
    color: "black",
    cursor: "not-allowed"
  },
  hintStyle: {
    color: "red"
  },
  invisible: {
    display: "none"
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonSource: {},
      jsonDest: {},
      destFileName: ""
    };
    
  }
  readJSON(file) {
    var request = new XMLHttpRequest();
    request.open("GET", file, false);
    request.send();
    if (request.status === 200) return request.responseText;
  }

  handleOpenOriginRessource(event) {
    var file = event.target.files[0];
    //console.log(file);
    var selff = this;
    var reader = new FileReader();
    reader.addEventListener(
      "load",
      function() {
        //console.log(reader.result);
        selff.setState({ jsonSource: JSON.parse(reader.result) });
      },
      false
    );

    if (file) {
      reader.readAsText(file);
    }
  }
  updateDest(dest) {
    this.setState({ jsonDest: dest });
  }
  handleOpenDestRessource(event) {
    //this.setState({jsonDest:{}})

    var file = event.target.files[0];
    console.log(file.name);
    this.setState({ destFileName: file.name });
    var selff = this;
    var reader = new FileReader();
    reader.addEventListener(
      "load",
      function() {
        selff.updateDest(JSON.parse(reader.result));
      },
      false
    );

    if (file) {
      reader.readAsText(file);
    }
  }
  
  render() {
    let styles = {
      content: {
        overflowY: "auto"
      },
      container: {
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexFlow: "column nowrap"
      },
      button: {
        margin: "8px",

      },
      clearLabel:{
        fontWeight:'bold',
      },
      
      invisible: {
        display: "none",
        /*opacity: "0",*/
        width: "0px",
        height: "0px"
      },
      topMenu: {
        display: "flex",
        flex: '1 1 auto',
        minHeight:'50px',
        flexFlow: "row, wrap",
        alignItems: 'center',
      },
      output:{
        color: 'green',
      }
    };
    return (
      <MuiThemeProvider>
        <div style={styles.container}>
          <div style={styles.topMenu}>
            <RaisedButton
              label="Load source ressource"
              primary={true}
              style={styles.button}
              containerElement="label"
              //onTouchTap={this.openRessourceDialog.bind(this)}
            >
              <input
                ref="loadOriginRessource"
                type="file"
                style={styles.invisible}
                multiple
                onChange={this.handleOpenOriginRessource.bind(this)}
              />
            </RaisedButton>

            <RaisedButton
              label="Load new traduction lang"
              primary={true}
              style={styles.button}
              containerElement="label"
            >
              <input
                ref="loadDestRessource"
                type="file"
                style={styles.invisible}
                multiple
                onChange={this.handleOpenDestRessource.bind(this)}
              />
            </RaisedButton>

            <RaisedButton
              label="Save the new ressource"
              secondary={true}
              style={styles.button}
              onClick={this.saveDestFile.bind(this)}
            />
            <RaisedButton
              label="Clear"
              backgroundColor="#a4c639"
              labelColor={fullWhite}
              labelPosition="before"
              style={styles.button}
               icon={<Refresh color={fullWhite} />}
              onClick={this.clearAll.bind(this)}
            />
            <h3>Selected output: <span style={styles.output}>{this.state.destFileName}</span></h3>
            <a id="downloadAnchorElem" style={styles.invisible} />
          </div>
          <div style={styles.content}>{this.getContent()}</div>
        </div>
      </MuiThemeProvider>
    );
  }
  
  clearAll(){
    this.setState({jsonDest:{}, jsonSource:{}, destFileName:'' })
  }
  saveDestFile() {
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(this.state.jsonDest));
    var dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", this.state.destFileName);
    dlAnchorElem.click();
  }
handleTextChange(event, newValue){
  //console.log("in change")
  var id = event.target.id;
  var items = id.split('.');
  console.log(items)
  
  var dest = this.state.jsonDest;
  if(items.length >1){
    dest[items[0]][items[1]] = newValue;
  }else{
    dest[id] = newValue;

  }

  getContent() {
    console.log("loading ressources");
    var source = this.state.jsonSource;
    var dest = this.state.jsonDest;
    console.log(dest);
    var ret = [];
    var selff = this;
    Object.keys(source).map(function(keyName, keyIndex) {
      //console.log(dest);
      if (typeof source[keyName] === "object") {
        ret.push(<h1 key={keyName + "-TITLE"}>{keyName}</h1>);
        Object.keys(source[keyName]).map(function(subkeyName, subkeyIndex) {
          var value;
          if (dest.hasOwnProperty(keyName)) {
            value = dest[keyName][subkeyName];
          } else {
            value = "";
          }
          //console.log("will push value: "+value);
          ret.push(
            <div style={styles.line} key={keyName + "." + subkeyName}>
              <div style={styles.txtBold}>{subkeyName}</div>
              <TextField
                id={keyName + "." + subkeyName}
                hintText=""
                value={source[keyName][subkeyName]}
                style={styles.TextField}
                inputStyle={styles.TextFieldValueOrigin}
                underlineShow={true}
                disabled = {true}
                multiLine={true}
              />
              <TextField
                id={keyName + "." + subkeyName}
                hintText="Fill the blank"
                value={value}
                style={styles.TextField}
                inputStyle={styles.TextFieldValue}
                hintStyle={styles.hintStyle}
                underlineShow={true}
                multiLine={true}
                onChange={selff.handleTextChange.bind(selff)}
              />
            </div>
          );
          return true;
        });
      } else {
        var value;
          if (dest.hasOwnProperty(keyName)){
            value = dest[keyName];
          }else{
            value = "";
          }
      ret.push(
        <div style={styles.line} key={keyName}>
          <div style={styles.txtBold}>{keyName}</div>
          <TextField
            id={keyName}
            hintText=""
            value={source[keyName]}
            style={styles.TextField}
            inputStyle={styles.TextFieldValueOrigin}
            underlineShow={true}
            multiLine={true}
            disabled = {true}
          />

          <TextField 
            id={keyName}
            hintText="Fill the blank"
            value={value}
            style={styles.TextField}
            inputStyle={styles.TextFieldValue}
            hintStyle={styles.hintStyle}
            underlineShow={true}
            multiLine={true}
            onChange={selff.handleTextChange.bind(selff)}
            
          />

            <TextField
              id={keyName}
              hintText="Fill the blank"
              value={value}
              style={styles.TextField}
              inputStyle={styles.TextFieldValue}
              hintStyle={styles.hintStyle}
              underlineShow={true}
              onChange={selff.handleTextChange.bind(selff)}
            />
          </div>
        );
      }
      return true;
    });
    //var ret = this.iterate(source,'');

    return ret;
  }
}

export default App;
