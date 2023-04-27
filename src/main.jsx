import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import GameProvider from './contexts/GameContext'


import { ChakraProvider } from '@chakra-ui/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
