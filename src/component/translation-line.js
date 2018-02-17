import React, {Component} from "react";
import TextField from "material-ui/TextField";
import PropTypes from "prop-types";

const styles = {
  line: {
    display: "flex",
    alignItems: "center",
    flex: "0 0 50px",
    //verticalAlign: 'middle',
    padding: "0px",
    //height: '50px',
    // minHeight: "95px",
    backgroundColor: '#424242',
    // height:'95px'
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
  TextField: {
    marginLeft: "50px",
    width: "400px"
    //color: 'red',
  },
};

class TranslationLine extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      source: '',
      translation: '',
      parentname: '',

    }
  }

  handleTextChange = (event) => {
    console.log(event.target.value);
    let translation = '';
    this.props.onValueChange(event.target.value, this.state.parentname, this.props.name);
    this.setState({translation: event.target.value});

  };


  componentWillReceiveProps(nextProps) {
    this.setState({...nextProps});
  }


  getLine() {
    let ret = [], name, translation, source, translationNode;
    name = this.state.name;
    translation = this.state.translation;
    source = this.state.source;

    if (this.props.title === true) {
      ret.push(
        <div style={{...styles.line, minHeight: this.props.rowHeight + 'px', maxHeight: this.props.rowHeight + 'px'}} key={name}>
          <h1  style={{backgroundColor: '#424242'}}>{name}</h1>
        </div>
      );
    }
    else {

      if (translation === '') {
        translationNode = (
          <TextField
            error
            id={name + 'translation'}
            style={styles.TextField}
            label="ENTER TRANSLATION"
            value={translation}
            onChange={this.handleTextChange}
            margin="normal"
            multiline
            rowsMax={4}
          />
        );
      } else {
        translationNode = (
          <TextField
            id={name + 'translation'}
            style={styles.TextField}
            value={translation}
            onChange={this.handleTextChange}
            margin="normal"
            multiline
            rowsMax={4}
          />
        );
      }

      ret.push(
        <div style={{...styles.line, minHeight: this.props.rowHeight + 'px', maxHeight: this.props.rowHeight + 'px'}} key={name}>
          <div style={styles.txtBold}>{name}</div>
          <form noValidate autoComplete="off">
            <TextField
              id={name + 'source'}
              // label="Name"
              style={styles.TextField}
              value={source}
              // onChange={this.handleChange('name')}
              disabled={true}
              margin="normal"
              multiline
              rowsMax={4}
            />

            {translationNode}
          </form>
        </div>
      );

    }
    return ret;

  }

  render() {
    return (this.getLine());

  }
}

TranslationLine.propTypes = {
  onValueChange: PropTypes.func.isRequired,
  rowHeight: PropTypes.number.isRequired,
  title: PropTypes.bool.isRequired,
};

export default TranslationLine;