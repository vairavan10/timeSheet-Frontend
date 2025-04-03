import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ThemeContextProvider from './context/ThemeContext';
import reportWebVitals from './reportWebVitals';

// Create a root instance for concurrent features (React 18+)
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
 
     <ThemeContextProvider>
     <App />


    </ThemeContextProvider>
  
);

// Optional: Measure performance
reportWebVitals();  // Example: reportWebVitals(console.log);
