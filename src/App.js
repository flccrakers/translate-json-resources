import React, {Component} from "react";
import Button from 'material-ui/Button';
import Paper from "material-ui/Paper";
import Refresh from 'material-ui-icons/Refresh';
import "./App.css";
import {withStyles} from 'material-ui/styles';
import DataLine from './component/translation-line';
import Next from 'material-ui-icons/NavigateNext';

const styles = theme => ({

  button: {
    margin: "8px"
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
    color: 'white',
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
      nbOfMissingTranslation: 0,
      fromChild: false,
      rowHeight: 75,
    };
    this.theme = props.theme;
  }

  sortObject(obj) {
    return Object.keys(obj)
      .sort().reduce((a, v) => {
        a[v] = obj[v];
        if (typeof obj[v] === "object") {
          a[v] = this.sortObject(obj[v]);
        }

        return a;
      }, {});
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
        selff.setState({jsonSource: JSON.parse(reader.result), fromChild: false});
        selff.updateMissingTranslation();

      },
      false
    );

    if (file) {
      reader.readAsText(file);
    }
  }

  updateDest(dest) {
    this.setState({jsonDest: dest, fromChild: false});
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
      },
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
            <Button variant="raised" component="span" color="primary" className={classes.button}>
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
            <Button variant="raised" component="span" color="primary" className={classes.button}>
              Upload translation file
            </Button>
          </label>

          <Button
            variant="raised"
            component="span"
            color="secondary"
            className={classes.button}
            onClick={this.saveTranslationFile.bind(this)}
          >
            Save translation
          </Button>

          <Button
            variant="raised"
            component="span"
            color="primary"
            className={classes.button}
            onClick={this.clearAll.bind(this)}
            style={{backgroundColor: '#a4c639', color: 'white'}}
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
        <div style={styles.content} id={'scrollContent'}>{this.getContent()}</div>
      </div>

    );
  }

  getMissingTranslation() {
    const {classes} = this.props;
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
          <Button
            variant="raised"
            component="span"
            color="primary"
            className={classes.button}
            onClick={this.goToNextEmpty}

          >
            Next Missing
            <Next/>
          </Button>
        </div>
      );
    }
    return ret;
  }

  goToNextEmpty = () => {
    if (this.emptyIndexes !== undefined && this.emptyIndexes.length > 0) {
      console.log('next empty index: ' + this.emptyIndexes[0]);
      let index = this.emptyIndexes[0];
      let element = document.getElementById("scrollContent");
      element.scrollTop = (index-1) * (this.state.rowHeight);
    }
  };

  clearAll() {
    this.refs.loadOriginResource.value = '';
    this.refs.loadDestResource.value = '';
    this.setState({jsonDest: {}, jsonSource: {}, destFileName: "", sourceFileName: '', nbOfMissingTranslation: 0});
  }

  saveTranslationFile() {
    let destObject = this.sortObject(this.state.jsonDest);
    let sourceObject = this.sortObject(this.state.jsonSource);
    let dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(destObject));
    let dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", this.state.destFileName);
    dlAnchorElem.click();

    dataStr = "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(sourceObject));
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", this.state.sourceFileName);
    dlAnchorElem.click();
  }


  getNbOfMissingTranslation(jsonDest = null) {
    console.log('updateMissingTranslation');
    let source, dest, nbOfMissingTranslation
    source = this.state.jsonSource;
    dest = jsonDest === null ? this.state.jsonDest : jsonDest;
    nbOfMissingTranslation = 0;
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

    console.log(nbOfMissingTranslation);
    return nbOfMissingTranslation;

  }

  updateMissingTranslation() {

    let nbOfMissingTranslation = this.getNbOfMissingTranslation();
    this.setState({nbOfMissingTranslation});
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.nbOfMissingTranslation !== this.state.nbOfMissingTranslation) {
      return true;
    }
    return !nextState.fromChild;

  }

  valueChanged = (newValue, key, subKey) => {
    console.log('I will change the parent (newValue: ' + newValue + ', key:  ' + key + ', subkey ' + subKey + ')');
    let jsonDest = this.state.jsonDest;
    if (key === '') {
      jsonDest[subKey] = newValue;
    } else {
      jsonDest[key][subKey] = newValue;
    }
    this.setState({jsonDest, fromChild: true, nbOfMissingTranslation: this.getNbOfMissingTranslation(jsonDest)});
    // this.updateMissingTranslation()
  };


  getContent() {

    let source, translation, emptyIndexes = [], index = 0;
    source = this.state.jsonSource;
    translation = this.state.jsonDest;
    //console.log(dest);
    let ret = [];
    //let selff = this;
    Object.keys(source).map((keyName, keyIndex) => {
      let value = '';
      if (typeof source[keyName] === "object") {
        ret.push(
          <DataLine
            source={''}
            title={true}
            name={keyName}
            rowHeight={this.state.rowHeight}
          />
        );

        Object.keys(source[keyName]).map((subKeyName, subKeyIndex) => {
          value = '';
          if (translation.hasOwnProperty(keyName)) {
            if (translation[keyName].hasOwnProperty(subKeyName)) {
              value = translation[keyName][subKeyName];
            }
          }
          ret.push(
            <DataLine
              source={source[keyName][subKeyName]}
              name={subKeyName}
              translation={value}
              parentname={keyName}
              onValueChange={this.valueChanged}
              rowHeight={this.state.rowHeight}
            />
          );

          if (value === '') {
            // console.log(keyName + '.' + subKeyName + ' on index ' + ret.length + ' is empty');
            emptyIndexes.push(ret.length);
          }
          return true;
        });
      } else {
        value = '';
        if (translation.hasOwnProperty(keyName)) {
          value = translation[keyName];
        }

        ret.push(
          <DataLine
            source={source[keyName]}
            name={keyName}
            translation={value}
            parentname={''}
            onValueChange={this.valueChanged}
            rowHeight={this.state.rowHeight}
          />
        );
        if (value === '') {
          emptyIndexes.push(ret.length);
        }
      }
      index += 1;
      return true;
    });
    console.log(emptyIndexes);
    this.emptyIndexes = emptyIndexes;
    return ret;
  }
}

export default withStyles(styles)(App);