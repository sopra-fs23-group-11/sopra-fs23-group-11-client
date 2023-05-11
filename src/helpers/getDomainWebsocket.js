import { isProduction } from '../helpers/isProduction'

export const getDomainWebsocket = () => {
    const prodUrl = 'ws://sopra-fs23-group11-server.oa.r.appspot.com/ws' //
    const devUrl = 'ws://localhost:8080/ws'
  
    return isProduction ? prodUrl : devUrl
  }