import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MovieMasher from './MovieMasher';
const element = document.createElement("main")
document.body.appendChild(element)
ReactDOM.render(<React.StrictMode><MovieMasher /></React.StrictMode>, element)
