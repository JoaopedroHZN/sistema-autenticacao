import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx' // Importando o provedor que criamos agora

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Envolvendo o App com o Provedor para distribuir os estados globais */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)