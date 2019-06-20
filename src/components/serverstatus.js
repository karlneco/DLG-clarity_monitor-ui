import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import './serverstatus.css'


const API_PORT = '11000'
const API_STATUS = '/statusupdate/';

//ram states
const RAM_CRIT = 3000;
const RAM_LOW = 5000

//disk states
const DISK_CRIT = 30*1024*1024*1024;
const DISK_LOW = 60*1024*1024*1024;

const RefreshInterval = 10;

class ServerStatus extends Component {
    constructor(props){
        super(props)

        this.state = {
            servername: props.servername,
        };
    }

    componentDidMount() {
        fetch("http://" + this.state.servername + ":" + API_PORT + API_STATUS)
        .then (response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('na');
            }
        })
        .then(data => this.setState({
            freeRAM: data.FreeRAM,
            revitIsRunning: data.RevitIsRunning,
            clarityTrayIsRunning: data.ClarityTrayIsRunning,
            systemDriveFree: data.SystemDriveFree,
            activeTask: data.ActiveTask,
            activeTaskRuntime: data.ActiveTaskRuntime,
            serverState: data.ServerState,
        }))
        .catch(error => this.setState({
            serverState: 'OFFLINE',
        }))
    console.log(this.state)

        this.interval = setInterval(() => {
            this.setState({ time:  Date.now() });

                fetch("http://" + this.state.servername + ":" + API_PORT + API_STATUS)
                .then (response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('na');
                    }
                })
                .then(data => this.setState({
                    freeRAM: data.FreeRAM,
                    revitIsRunning: data.RevitIsRunning,
                    clarityTrayIsRunning: data.ClarityTrayIsRunning,
                    systemDriveFree: data.SystemDriveFree,
                    activeTask: data.ActiveTask,
                    activeTaskRuntime: data.ActiveTaskRuntime,
                    serverState: data.ServerState,
                }))
                .catch(error => this.setState({
                    serverState: 'OFFLINE',
                }))

            }, RefreshInterval * 1000); // every 1 second(s)
    }


    componentWillUnmount(){
        clearInterval(this.interval)
    }

    showLink () {
        if(this.state.activeTask !== "unknown"){
            return(
                <span>
                    Active Task: <a href={"http://revitserver/CentralAdministrator/Task/Status/" + this.state.activeTask}>{this.state.activeTask}</a><br/>
                    Task Run time: {this.state.activeTaskRuntime} minues<br/>
                </span>
            )
        }
    }
    
    formatSizeUnits = (b) => {
        const bytes = parseInt(b)
        let bytesString
        if      (bytes >= 1073741824) { bytesString = (bytes / 1073741824).toFixed(2) + " GB"; }
        else if (bytes >= 1048576)    { bytesString = (bytes / 1048576).toFixed(2) + " MB"; }
        else if (bytes >= 1024)       { bytesString = (bytes / 1024).toFixed(2) + " KB"; }
        else if (bytes > 1)           { bytesString = bytes + " bytes"; }
        else if (bytes === 1)          { bytesString = bytes + " byte"; }
        else                          { bytesString = "0 bytes"; }
        return (
            <span>{bytesString}</span>
        )
    }


    //this formats the amount of free RAM
    freeRamDisplay = (r) => {
        if (r<RAM_CRIT){
            return(
                <div className="resource_crit">{this.formatSizeUnits(parseInt(r*1024*1024))}</div>
            )
        } else { 
            if (r<RAM_LOW) {
                return(
                    <div className="resource_low">{this.formatSizeUnits(parseInt(r*1024*1024))}</div>
                )
            }
        }
        return(
            <div>{this.formatSizeUnits(parseInt(r*1024*1024))}</div>
        )
    }


    //this formats the amount of free Disk Space
    freeDiskDisplay = (r) => {
        if (r<DISK_CRIT){
            return(
                <div className="resource_crit">{this.formatSizeUnits(parseInt(r))}</div>
            )
        } else { 
            if (r<DISK_LOW) {
                return(
                    <div className="resource_low">{this.formatSizeUnits(parseInt(r))}</div>
                )
            }
        }
        return(
            <div>{this.formatSizeUnits(parseInt(r))}</div>
        )
    }



    render(){

        let revitState = "is not running";
        if (this.state.revitIsRunning) {
            revitState = " is running"
        }


        const TaskLink = this.showLink();
        const freeRAM = this.freeRamDisplay(this.state.freeRAM);
        const freeDisk = this.freeDiskDisplay(this.state.systemDriveFree);

        const status = this.state.serverState;

        let serverStateUI = status
        switch (status) {
            case 'OFFLINE':
                serverStateUI = 'offline'
                break;
            default:
                break;
        }

        return(
            <div className='server_card'>
                <h2 className={serverStateUI}>{this.state.servername} - {status}</h2>
                <div className="server_status">
                    <div>Revit is {revitState}</div>
                    <div>{TaskLink}</div>
                </div>
                <div className='server_data'>
                    <div>Free RAM: </div><div>{freeRAM}</div>
                    <div>Free Disk Space: </div><div>{freeDisk}</div>
                </div>
                <Grid container spacing={1} justify="space-evenly" alignItems="flex-end">
                    <Grid item>
                        <Button disabled variant="outlined" color="primary">Journals...</Button></Grid>
                    <Grid item>
                            <Button disabled variant="outlined" color="primary">Cleanup</Button></Grid>
                    <Grid item>
                        <Button disabled ="contained" color="primary">Pause</Button></Grid>
                </Grid>
            </div>
        )
    }
}

export default ServerStatus
