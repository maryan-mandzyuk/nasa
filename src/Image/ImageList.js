import React from 'react';
import { ImageItem } from './ImageItem';
import Grid from '@material-ui/core/Grid';

export const ImageList = ({ photos = [] }) => {

  return (
    <Grid container direction="row" justify="center">
      {photos.map((p) => <ImageItem src={p.img_src} />)}
    </Grid>
    );
}
