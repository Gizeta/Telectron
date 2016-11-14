import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import client from './wrapper';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import TargetToolbox from './views/TargetToolbox';
import DialPanel from './views/DialPanel';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const styles = {
    closeButton: {
        WebkitAppRegion: 'no-drag'
    },
    appBar: {
        WebkitUserSelect: 'none',
        WebkitAppRegion: 'drag'
    },
    content: {
        margin: '5px 10px'
    }
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            callState: ""
        };
    }

    // onRightIconButtonTouchTap seems not working in material-ui@0.15.4
    handleCloseButtonTouchTap() {
        window.close();
    }

    handleDial(num) {
        client.sendDtmf(num);
    }

    handleConnect(target) {
        client.init();
        client.call(`sip:${target}`);
    }

    handleDisconnect() {
        client.destroy();
    }

    changeCallState(callState) {
        this.setState({callState});
    }

    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title={"Telectron" + (this.state.callState == "" ? "" : " (" + this.state.callState + ")")}
                        showMenuIconButton={false}
                        iconElementRight={
                            <IconButton onTouchTap={::this.handleCloseButtonTouchTap} style={styles.closeButton}>
                                <NavigationClose />
                            </IconButton>
                        }
                        style={styles.appBar}
                    />
                    <div style={styles.content}>
                        <TargetToolbox
                            onConnect={::this.handleConnect}
                            onDisconnect={::this.handleDisconnect} />
                        <DialPanel
                            onDial={::this.handleDial} />
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

window.app = ReactDOM.render(
    <App />,
    document.getElementById('app')
);