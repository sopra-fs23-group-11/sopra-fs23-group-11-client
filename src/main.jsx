import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import GameProvider from './contexts/GameContext'
import customTheme from './themes/customTheme'


import { ChakraProvider } from '@chakra-ui/react'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={customTheme}>
      <GameProvider>
        <App />
      </GameProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
