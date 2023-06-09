import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'
import Context from './context/Context'
//import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
)



