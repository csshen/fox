import React from 'react';
import axios from 'axios';
import ReactMapGL, { Marker } from 'react-map-gl';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import 'mapbox-gl/dist/mapbox-gl.css';
import logo from './logo.png'
var root = 'https://745774b0.ngrok.io';




export default class Login extends React.Component {

  state = {
    email: '',
    password: '',
    metadata: null,
    success: 0,
    code: (<Button
              className='Button'
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => this.getCode()}
            >
              Request Unlock Code
            </Button>),
    viewport: {
      latitude: 33.773992, 
      longitude: -84.398691,
      width: '100%',
      height: '350px',
      zoom: 15
    }
  }

  handleChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleSubmit = event => {
    event.preventDefault();

    const email = this.state.email;
    const password = this.state.password;

    axios.post(root + '/login', { email, password})
      .then(res => {
        this.setState({message: res.data.message, success: 0});
        if (this.state.message == "success") {
          this.setState({success : 1, metadata: res.data.metadata})
        } else {
          this.setState({success : 0})
        }
      });
  }

  getCode() {
    const email = this.state.email;
    axios.post(root + '/get_code', { email })
      .then(res => this.setState({code: (<h2 style={{textAlign: 'center'}}>{res.data.code}</h2>)}));
  }


  
  render() {
    let error = (<Typography color='secondary' component="h5" variant="body1">{this.state.message}</Typography>);
    if (this.state.success == 1){
        error = null;
    }
    
    let homepage = (<Container component="main">
      <br/>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <img  src={logo}/>
          { this.state.text}
        </Grid>
        <Grid item xs={0} md={3}/>
        <Grid item xs={12} md={6}>
          <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error}
        <form onSubmit={this.handleSubmit} noValidate>
          <TextField
          onChange={this.handleChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
          onChange={this.handleChange}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            className='Button'
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>

        </Grid>
        <Grid xs={0} md={3}/>
      </Grid>

      

    </Container>);

    
    if (this.state.success == 0) {
      return homepage;
    } else {
      let requestpage;
      if (this.state.metadata) {
        requestpage = (
          <Container>
          <br/>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography align='center' component="h5" variant="h5">Your Account</Typography>
            </Grid>

            <Grid item xs={0} md={3}/>
            <Grid item xs={12} md={6}>

              <ReactMapGL
                {...this.state.viewport}
                onViewportChange={(viewport) => this.setState({viewport})}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                mapStyle={'mapbox://styles/csshen/ck2vz26il16zl1cmlc8o0bow7'}
              >

              <Marker 
                latitude={33.773992} 
                longitude={-84.398691}
                offsetLeft={0} 
                offsetTop={0}>
                
                <Tooltip placement="top" title="Locker #321">
                  <img src='https://image.flaticon.com/icons/png/512/45/45332.png' width={'20px'} />
                </Tooltip>
                
              </Marker>

              </ReactMapGL>

              
              
            <br/>
            {this.state.code}
            </Grid>
            <Grid item xs={0} md={3}/>
            <Grid item xs={0} md={3}/>
            <Grid item xs={6} md={3}>
              { 'Your order is ready!' }<br/>
              { this.state.metadata.order }
            </Grid>
            <Grid item xs={6} md={3}>
              <img src={this.state.metadata.image} style={{width: '100%', height: 'auto'}} />
            </Grid>
            <Grid item xs={0} md={3}/>

            
            
            </Grid>
          </Container>
        );
      }
      return requestpage;
    }
  }
}