import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: 170
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    button: {
        flex: 'none',
        minWidth: 60
    },
    label: {
        fontSize: 20
    }
}

export default class DialPanel extends Component {
    static propTypes = {
        onDial: React.PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    handleDialNumber(character) {
        return () => {
            if (this.props.onDial) {
                this.props.onDial(character);
            }
        }
    }

    render() {
        return (
            <div style={styles.container}>
                <div style={styles.row}>
                    <RaisedButton
                        label="1"
                        primary={true}
                        style={styles.button}
                        labelStyle={styles.label}
                        onTouchTap={this.handleDialNumber("1")} />
                    <RaisedButton
                        label="2"
                        primary={true}
                        style={styles.button}
                        labelStyle={styles.label}
                        onTouchTap={this.handleDialNumber("2")} />
                    <RaisedButton
                        label="3"
                        primary={true}
                        style={styles.button}
                        labelStyle={styles.label}
                        onTouchTap={this.handleDialNumber("3")} />
                    <RaisedButton
                        label="A"
                        primary={true}
                        style={styles.button}
                        labelStyle={styles.label}
                        onTouchTap={this.handleDialNumber("A")} />
                </div>
                <div style={styles.row}>
                    <RaisedButton
                        label="4"
                        primary={true}
                        style={styles.button}
                        labelStyle={styles.label}
                        onTouchTap={this.handleDialNumber("4")} />
                    <RaisedButton
                        label="5"
                        primary={true}
                        style={styles.button}
                        labelStyle={styles.label}
                        onTouchTap={this.handleDialNumber("5")} />
                    <RaisedButton
                        label="6"
                        primary={true}
                        style={styles.button}
                        labelStyle={styles.label}
                        onTouchTap={this.handleDialNumber("6")} />
                    <RaisedButton
                        label="B"
                        primary={true}
                        style={styles.button}
                        labelStyle={styles.label}
                        onTouchTap={this.handleDialNumber("B")} />
                </div>
                <div style={styles.row}>
                    <RaisedButton
                        label="7"
                        primary={true}
                        style={styles.button}
                        labelStyle={styles.label}
                        onTouchTap={this.handleDialNumber("7")} />
                    <RaisedButton
                        label="8"
                        primary={true}
                        style={styles.button}
                        labelStyle={styles.label}
                        onTouchTap={this.handleDialNumber("8")} />
                    <RaisedButton
                        label="9"
                        primary={true}
                        style={styles.button}
                        labelStyle={styles.label}
                        onTouchTap={this.handleDialNumber("9")} />
                    <RaisedButton
                        label="C"
                        primary={true}
                        style={styles.button}
                        labelStyle={styles.label}
                        onTouchTap={this.handleDialNumber("C")} />
                </div>
                <div style={styles.row}>
                    <RaisedButton
                        label="*"
                        primary={true}
                        style={styles.button}
                        labelStyle={styles.label}
                        onTouchTap={this.handleDialNumber("*")} />
                    <RaisedButton
                        label="0"
                        primary={true}
                        style={styles.button}
                        labelStyle={styles.label}
                        onTouchTap={this.handleDialNumber("0")} />
                    <RaisedButton
                        label="#"
                        primary={true}
                        style={styles.button}
                        labelStyle={styles.label}
                        onTouchTap={this.handleDialNumber("#")} />
                    <RaisedButton
                        label="D"
                        primary={true}
                        style={styles.button}
                        labelStyle={styles.label}
                        onTouchTap={this.handleDialNumber("D")} />
                </div>
            </div>
        );
    }
}
