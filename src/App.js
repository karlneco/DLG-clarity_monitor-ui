import React from 'react';
import ServerStatus from './components/serverstatus'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles';
import './App.css';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: 20,
  },
  paper: {
    height: 200,
    width: 400,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderWidth:2,
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
  },
}));

function App() {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item><ServerStatus servername="cgdc01tsk01"/></Grid>
        <Grid item><ServerStatus servername="cgdc01tsk02"/></Grid>
        <Grid item><ServerStatus servername="cgdc01tsk03"/></Grid>
        <Grid item><ServerStatus servername="cgdc01tsk04"/></Grid>
        <Grid item><ServerStatus servername="cgdc01tsk05"/></Grid>
        <Grid item><ServerStatus servername="cgdc01tsk06"/></Grid>
      </Grid>
  </div>
  );
}

export default App;
