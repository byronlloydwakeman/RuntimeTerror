import * as React from 'react';
import Button from '@mui/material/Button';

function GreenResponsiveButton(props) {
  // STYLING
  const buttonStyle = {
    Button: {
      color: '#045149',
      border: '1px solid #045149',
      backgroundColor: 'white',
      padding: '5px 10px',
      '&:hover': {
        backgroundColor: '#045149 !important',
        boxShadow: 'none !important',
        borderColor: 'white',
        color: 'white',
      },
    },
  };
  // STYLING

  return (
    <Button size="small" sx={buttonStyle.Button}>
      {props.text}
    </Button>
  );
}
export default GreenResponsiveButton;
