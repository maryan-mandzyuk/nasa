import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { ImageList } from './Image/ImageList';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 240,
    maxWidth: 240
  },
}));

const baseUrl = 'https://api.nasa.gov/mars-photos/api/v1/rovers';
const apiKey = 'gnxCitFgroGRZh403etOhbYn56lGKjtuGE2bgQ17';
export const App = () => {
  const classes = useStyles();

  const [rover, setRover] = useState('');
  const [camera, setCamera] = useState('');
  const [sol, setSol] = useState(undefined);
  const [photos, setPhotos] = useState([]);
  const [loadPage, setLoadPage] = useState(1);
  const [settingsChanged, setSettingsChanged] = useState(false);
  const [roverError, setRoverError] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [solError, setSolError] = useState(false);


  const validationHandler = () => {
    let passValidation = true;
    if(rover === '') {
      setRoverError(true);
      passValidation = false;
    }

    if(camera === '') {
      setCameraError(true);
      passValidation = false;
    }

    if(!sol || sol <= 0) {
      setSolError(true);
      passValidation = false;
    }
    return passValidation;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const valid = validationHandler();

    if(valid) {
      const res = await axios.get(`${baseUrl}/${rover}/photos?camera=${camera}&sol=${sol}&page=${loadPage}&api_key=${apiKey}`);
      if(settingsChanged) {
        setPhotos(res.data.photos);
      } else {
        setPhotos([...photos, ...res.data.photos]);
      }
      if(res.data.photos.length > 0) {
        setLoadPage(loadPage + 1);
      }
      setSettingsChanged(false);
    }
  }

  const roverChangeHandler = (e) => {
    setRover(e.target.value);
    setLoadPage(1);
    setSettingsChanged(true);
    setRoverError(false);
  }

  const cameraChangeHandler = (e) => {
    setCamera(e.target.value);
    setLoadPage(1);
    setSettingsChanged(true);
    setCameraError(false);
  }

  const solChangeHandler = (e) => {
    setSol(e.target.value);
    setLoadPage(1);
    setSettingsChanged(true);
    setSolError(false);
  }

  return (
    <Grid container direction="column" justify="center" className={classes.root}>
      <Grid item>
        <form onSubmit={submitHandler}>
          <Grid container direction="row" justify="center">
              <FormControl error={roverError} variant="outlined" className={classes.formControl}>
                  <InputLabel>Rover</InputLabel>
                  <Select
                      value={rover}
                      onChange={roverChangeHandler}
                      label="Age"
                  >
                      <MenuItem value={'Curiosity'}>Curiosity</MenuItem>
                      <MenuItem value={'Opportunity'}>Opportunity</MenuItem>
                      <MenuItem value={'Spirit'}>Spirit</MenuItem>
                  </Select>
              </FormControl>
              <FormControl error={cameraError} variant="outlined" className={classes.formControl}>
                  <InputLabel >Camera</InputLabel>
                  <Select
                      value={camera}
                      onChange={cameraChangeHandler}
                      label="Camera"
                  >
                      <MenuItem value={'FHAZ'}>Front Hazard Avoidance Camera</MenuItem>
                      <MenuItem value={'RHAZ'}>Rear Hazard Avoidance Camera</MenuItem>
                      <MenuItem value={'MAST'}>Mast Camera</MenuItem>
                      <MenuItem value={'CHEMCAM'}>Chemistry and Camera Complex</MenuItem>
                      <MenuItem value={'MAHLI'}>Mars Hand Lens Imager</MenuItem>
                      <MenuItem value={'MARDI'}>Mars Descent Imager</MenuItem>
                      <MenuItem value={'NAVCAM'}>Navigation Camera</MenuItem>
                      <MenuItem value={'PANCAM'}>	Panoramic Camera</MenuItem>
                      <MenuItem value={'MINITES'}>Miniature Thermal Emission Spectrometer (Mini-TES)</MenuItem>
                  </Select>
              </FormControl>
              <Grid item>
                  <FormControl  variant="outlined" className={classes.formControl}>
                      <TextField
                      label="SOL"
                      type="number"          
                      variant="outlined"
                      onChange={solChangeHandler}
                      value={sol}
                      error={solError}
                      />
                  </FormControl>
              </Grid>
              <Grid item>
                  <FormControl variant="outlined" className={classes.formControl}>
                      <Button type="submit" variant="contained" color="primary">
                      Submit
                      </Button>
                  </FormControl>
              </Grid>
          </Grid>
        </form>
      </Grid>
      <Grid item>
        <ImageList photos={photos} />        
      </Grid>
      <Grid item>
        <Grid container justify="center" style={{display: photos.length > 1 ? 'grid' : 'none'}}>
          <Grid item>
            <FormControl variant="outlined" className={classes.formControl}>
                <Button variant="contained" color="default" onClick={submitHandler}>
                Load more...
                </Button>
            </FormControl> 
          </Grid>
        </Grid>    
      </Grid>
    </Grid>
  );
}
