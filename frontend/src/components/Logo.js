import React from 'react';
import logo from './logo3.png'; // JPG ki jagah PNG format use karein

const Logo = ({ w = '100', h = '100' }) => {
  return (
    <img
      src={logo}
      alt="Logo"
      width={w}
      height={h}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default Logo;