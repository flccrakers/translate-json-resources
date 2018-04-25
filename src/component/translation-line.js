import React, {Component} from "react";
import TextField from "material-ui/TextField";

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
      parentname:'',

    }
  }

  handleTextChange = (event)=> {
    // console.log(event.target.value);
    // let translation = '';
    this.props.onValueChange(event.target.value, this.state.parentname ,this.props.name);
    this.setState({translation:event.target.value});

  };


  componentWillReceiveProps(nextProps) {
    this.setState({...nextProps});
  }


  getLine() {
    let ret = [];
    //let data = this.props.data;
    // let parentName = this.state.parentName;
    let name = this.state.name;
    let translation = this.state.translation;
    let source = this.state.source;
    // let value;
    // if (translation && translation.hasOwnProperty(keyName)) {
    //   value = translation[keyName];
    // } else {
    //   value = "";
    // }
    //console.log("will push value: "+value);
    ret.push(
      <div style={styles.line} key={name}>
        <div style={styles.txtBold}>{name}</div>
        <form noValidate autoComplete="off">
          <TextField
            id={name+'source'}
            // label="Name"
            style={styles.TextField}
            value={source}
            // onChange={this.handleChange('name')}
            disabled={true}
            margin="normal"
          />

          <TextField
            id={name+'translation'}
            style={styles.TextField}
            value={translation}
            onChange={this.handleTextChange}
            margin="normal"
            multiline
            rowsMax="8"
          />
        </form>
      </div>
    );


    return ret;

  }

  render() {
    return (this.getLine());

  }
}

export default TranslationLine;