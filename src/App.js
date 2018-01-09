import React, {Component} from "react";
import Button from 'material-ui/Button';
import TextField from "material-ui/TextField";
// import Divider from "material-ui/Divider";
import Paper from "material-ui/Paper";
import {fullWhite} from "material-ui/colors";
import Refresh from 'material-ui-icons/Refresh';
import "./App.css";
import {withStyles} from 'material-ui/styles';


const styles = theme => ({

  button: {
    margin: "8px"
  },


  TextField: {
    marginLeft: "50px",
    width: "400px"
    //color: 'red',
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
  },
  topMenu: {
    display: "flex",
    flex: "1 1 auto",
    minHeight: "50px",
    flexFlow: "row, wrap",
    alignItems: "center",
    // margin: "8px 8px 15px 8px"
  },
  container: {
    height: "100%",
    overflow: "hidden",
    display: "flex",
    flex: '1 1 auto',
    flexFlow: "column nowrap"
  },
  txtFullWhite: {
    color: fullWhite,
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonSource: {},
      jsonDest: {},
      destFileName: "",
      sourceFileName: "",
      nbOfMissingTranslation: 0
    };
    this.theme = props.theme;
  }

  readJSON(file) {
    let request = new XMLHttpRequest();
    request.open("GET", file, false);
    request.send();
    if (request.status === 200) return request.responseText;
  }

  handleOpenOriginResource(event) {
    let file = event.target.files[0];
    this.setState({sourceFileName: file.name});
    //console.log(file);
    let selff = this;
    let reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        // console.log('DONE');
        // console.log(reader.result);
        selff.setState({jsonSource: JSON.parse(reader.result)});
        selff.updateMissingTranslation();

      },
      false
    );

    if (file) {
      reader.readAsText(file);
    }
  }

  updateDest(dest) {
    this.setState({jsonDest: dest});
    this.updateMissingTranslation();
  }

  handleOpenDestRessource(event) {
    //this.setState({jsonDest:{}})

    let file = event.target.files[0];
    //console.log(file.name);
    this.setState({destFileName: file.name});
    let selff = this;
    let reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        selff.updateDest(JSON.parse(reader.result));

      },
      false
    );

    if (file) {
      reader.readAsText(file);

    }
  }

  render() {
    const {classes} = this.props;
    let styles = {
      content: {
        overflowY: "auto"
      },

      button: {
        margin: "8px"
      },
      clearLabel: {
        fontWeight: "bold"
      },

      invisible: {
        display: "none",
        /*opacity: "0",*/
        width: "0px",
        height: "0px"
      },

      output: {
        color: "#a4c639"
      },
      clearTxt: {
        color: 'white',
        margin: '0px 0px 0px 0px',
      }
    };
    return (

      <div className={classes.container}>
        <Paper className={classes.topMenu}>
          <input
            ref="loadOriginResource"
            accept="json/*"
            className={classes.invisible}
            id="button-upload-template"
            multiple
            type="file"
            onChange={this.handleOpenOriginResource.bind(this)}
          />
          <label htmlFor="button-upload-template">
            <Button raised component="span" color="primary" className={classes.button}>
              Upload source resource
            </Button>
          </label>

          <input
            ref="loadDestResource"
            accept="json/*"
            className={classes.invisible}
            id="button-upload-translation"
            multiple
            type="file"
            onChange={this.handleOpenDestRessource.bind(this)}
          />
          <label htmlFor="button-upload-translation">
            <Button raised component="span" color="primary" className={classes.button}>
              Upload translation file
            </Button>
          </label>

          <Button
            raised
            component="span"
            color="accent"
            className={classes.button}
            onClick={this.saveTranslationFile.bind(this)}
          >
            Save translation
          </Button>

          <Button
            raised
            component="span"
            color="primary"
            className={classes.button}
            onClick={this.clearAll.bind(this)}
            style={{backgroundColor: '#a4c639', color: fullWhite}}
          >
            <Refresh/>
            Clear
          </Button>


          <div>
            <h3 style={styles.clearTxt}>
              Selected template:{" "}
              <span style={styles.output}>{this.state.sourceFileName}</span>
            </h3>
            <h3 style={styles.clearTxt}>
              Selected output:{" "}
              <span style={styles.output}>{this.state.destFileName}</span>
            </h3>
          </div>

          {this.getMissingTranslation()}


          <a id="downloadAnchorElem" style={styles.invisible}/>
        </Paper>
        <div style={styles.content}>{this.getContent()}</div>
      </div>

    );
  }

  getMissingTranslation() {
    let styles = {
      missing: {
        color: 'white',
        marginLeft: "15px",
        backgroundColor: '#c2185b',
      },
      container: {
        flex: '1 1 auto',
        display: 'flex',
        backgroundColor: '#c2185b',
        marginLeft: '15px'
      },

    };
    let ret = [];
    if (this.state.nbOfMissingTranslation > 0) {
      ret.push(
        <div key='missing-translation' style={styles.container}>
          <h3 style={styles.missing}>
            Missing translation: {this.state.nbOfMissingTranslation}
          </h3>
        </div>
      );
    }
    return ret;
  }

  clearAll() {
    this.refs.loadOriginResource.value = '';
    this.refs.loadDestResource.value = '';
    this.setState({jsonDest: {}, jsonSource: {}, destFileName: "", sourceFileName: '', nbOfMissingTranslation: 0});
  }

  saveTranslationFile() {
    let dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(this.state.jsonDest));
    let dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", this.state.destFileName);
    dlAnchorElem.click();
  }

  handleTextChange(event, newValue) {
    console.log("in change");
    let id = event.target.id;
    let items = id.split(".");
    console.log(items);

    let dest = this.state.jsonDest;
    console.log(dest);
    if (items.length > 1) {
      dest[items[0]][items[1]] = newValue;
    } else {
      dest[id] = newValue;
    }

    this.setState({jsonDest: dest});
    this.updateMissingTranslation();
    //console.log(event.target.currentTarget.get("key"))
  }

  updateMissingTranslation() {
    //console.log('updateMissingTranslation');
    let source = this.state.jsonSource;
    let dest = this.state.jsonDest;
    let nbOfMissingTranslation = 0;
    Object.keys(source).map(function (keyName, keyIndex) {
      if (typeof source[keyName] === "object") {
        Object.keys(source[keyName]).map(function (subkeyName, subkeyIndex) {
          if (!dest.hasOwnProperty(keyName)) {
            nbOfMissingTranslation++;
          }
          else if (!dest[keyName].hasOwnProperty(subkeyName)) {
            nbOfMissingTranslation++;
          }
          else if (dest[keyName] === '') {
            nbOfMissingTranslation++;
          }
        });
      } else {
        if (!dest.hasOwnProperty(keyName)) {
          nbOfMissingTranslation++;
        }
        else if (dest[keyName] === '') {
          nbOfMissingTranslation++;
        }
      }
    });

    this.setState({nbOfMissingTranslation});
  }

  getContent() {
    const styles = {
      line: {
        display: "flex",
        alignItems: "center",
        flex: "0 0 50px",
        //verticalAlign: 'middle',
        padding: "8px 8px 8px 8px",
        //height: '50px',
        minHeight: "0px",
        backgroundColor: '#424242',
      },
      txtBold: {
        color: "white",
        fontWeight: "bold",
        cursor: "default",
        width: "300px"
      },
      TextFieldValue: {
        color: "green",
        cursor: "pointer",
        fontWeight: "bold"
      },
    };
    const {classes} = this.props;
    //console.log("loading ressources");
    let source = this.state.jsonSource;
    let translation = this.state.jsonDest;
    //console.log(dest);
    let ret = [];
    let selff = this;
    Object.keys(source).map(function (keyName, keyIndex) {
      //console.log(dest);
      if (typeof source[keyName] === "object") {
        ret.push(<h1 key={keyName + "-TITLE"} style={{backgroundColor: '#424242'}}>{keyName}</h1>);
        Object.keys(source[keyName]).map(function (subkeyName, subkeyIndex) {
          let value;
          if (translation.hasOwnProperty(keyName)) {
            value = translation[keyName][subkeyName];
          } else {
            value = "";
          }
          //console.log("will push value: "+value);
          ret.push(
            <div style={styles.line} key={keyName + "." + subkeyName}>
              <div style={styles.txtBold}>{subkeyName}</div>
              <TextField
                id={keyName + "." + subkeyName}
                // label="Name"
                style={styles.TextField}
                value={source[keyName][subkeyName]}
                // onChange={this.handleChange('name')}
                disabled={true}
                margin="normal"
              />

              <TextField
                id={keyName + "." + subkeyName}
                style={styles.TextField}
                value={value}
                inputStyle={styles.TextFieldValue}
                onChange={selff.handleTextChange.bind(selff)}
                margin="normal"
                row={1}
                row={4}
              />
              {/*<TextField*/}
              {/*id={keyName + "." + subkeyName}*/}
              {/*hintText=""*/}
              {/*value={source[keyName][subkeyName]}*/}
              {/*style={styles.TextField}*/}
              {/*inputStyle={styles.TextFieldValueOrigin}*/}
              {/*textareaStyle={styles.TextFieldValueOrigin}*/}
              {/*underlineShow={true}*/}
              {/*disabled={true}*/}
              {/*multiLine={true}*/}
              {/*rows={1}*/}
              {/*rowsMax={4}*/}
              {/*/>*/}
              {/*<TextField*/}
              {/*id={keyName + "." + subkeyName}*/}
              {/*hintText="Fill the blank"*/}
              {/*value={value}*/}
              {/*style={styles.TextField}*/}
              {/*inputStyle={styles.TextFieldValue}*/}
              {/*textareaStyle={styles.TextFieldValue}*/}
              {/*hintStyle={styles.hintStyle}*/}
              {/*underlineShow={true}*/}
              {/*onChange={selff.handleTextChange.bind(selff)}*/}
              {/*multiLine={true}*/}
              {/*rows={1}*/}
              {/*rowsMax={4}*/}
              {/*/>*/}
            </div>
          );
          return true;
        });
      } else {
        let value;
        if (translation.hasOwnProperty(keyName)) {
          value = translation[keyName];
        } else {
          value = "";
        }
        ret.push(
          <div style={styles.line} key={keyName}>
            <div style={styles.txtBold}>{keyName}</div>
            {/*<TextField*/}
            {/*id={keyName}*/}
            {/*hintText=""*/}
            {/*value={source[keyName]}*/}
            {/*style={styles.TextField}*/}
            {/*inputStyle={styles.TextFieldValueOrigin}*/}
            {/*textareaStyle={styles.TextFieldValueOrigin}*/}
            {/*underlineShow={true}*/}
            {/*disabled={true}*/}
            {/*multiLine={true}*/}
            {/*rows={1}*/}
            {/*rowsMax={4}*/}
            {/*/>*/}

            {/*<TextField*/}
            {/*id={keyName}*/}
            {/*hintText="Fill the blank"*/}
            {/*value={value}*/}
            {/*style={styles.TextField}*/}
            {/*inputStyle={styles.TextFieldValue}*/}
            {/*textareaStyle={styles.TextFieldValue}*/}
            {/*hintStyle={styles.hintStyle}*/}
            {/*underlineShow={true}*/}
            {/*onChange={selff.handleTextChange.bind(selff)}*/}
            {/*multiLine={true}*/}
            {/*rows={1}*/}
            {/*rowsMax={4}*/}
            {/*/>*/}
          </div>
        );
      }
      return true;
    });
    //let ret = this.iterate(source,'');

    return ret;
  }
}

export default withStyles(styles)(App);
