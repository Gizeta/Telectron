import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CommunicationCall from 'material-ui/svg-icons/communication/call';
import CommunicationCallEnd from 'material-ui/svg-icons/communication/call-end';

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center'
    },
    label: {
        flex: 'none'
    },
    text: {
        flex: 'auto',
        margin: '0 10px'
    },
    button: {
        flex: 'none',
        minWidth: 50
    }
}

export default class TargetToolbox extends Component {
    static propTypes = {
        onConnect: React.PropTypes.func,
        onDisconnect: React.PropTypes.func
    }

    constructor(props) {
        super(props);

        this.state = {
            target: '12345@10.105.242.58',
            calling: false
        }
    }

    handleTextChanged(event) {
        this.setState({target: event.target.value});
    }

    handleConnectButton() {
        if (this.props.onConnect)
            this.props.onConnect(this.state.target);
        
        this.setState({calling: true});
    }

    handleDisconnectButton() {
        if (this.props.onDisconnect)
            this.props.onDisconnect();

        this.setState({calling: false});
    }

    render() {
        let callButton;
        if (this.state.calling) {
            callButton = (
                <RaisedButton
                    icon={<CommunicationCallEnd />}
                    secondary={true}
                    onTouchTap={::this.handleDisconnectButton}
                    style={styles.button}
                />
            );
        }
        else {
            callButton = (
                <RaisedButton
                    icon={<CommunicationCall />}
                    primary={true}
                    onTouchTap={::this.handleConnectButton}
                    style={styles.button}
                />
            );
        }

        return (
            <div style={styles.container}>
                <span style={styles.label}>To: </span>
                <TextField
                    hintText="Target SIP Address"
                    value={this.state.target}
                    onChange={::this.handleTextChanged}
                    style={styles.text}
                />
                {callButton}
            </div>
        );
    }
}
