import React from 'react';

export const ImageItem = ({src}) => {
  return (
    <img style={{maxWidth: 300, minWidth: 300, padding: 10}} src={src}/>
  );
}
