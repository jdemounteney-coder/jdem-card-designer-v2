import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Runtime diagnostic: detect whether Tailwind utility classes are present
try {
  const probe = document.createElement('div');
  probe.className = 'hidden bg-purple-50';
  probe.style.position = 'absolute';
  probe.style.left = '-9999px';
  document.body.appendChild(probe);
  const computed = window.getComputedStyle(probe).backgroundColor || '';
  console.info('TAILWIND_DIAG:', { backgroundColor: computed });
  document.body.removeChild(probe);
} catch (e) {
  console.warn('TAILWIND_DIAG: probe failed', e);
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
