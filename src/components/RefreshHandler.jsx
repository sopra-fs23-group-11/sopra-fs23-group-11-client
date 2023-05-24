import React, {useEffect } from 'react'

export default function RefreshHandler({socket, lobbyCode}) {
    useEffect(() => {
        const handleRefresh = (e) => {
          e.preventDefault();
          e.returnValue = ''; // Chrome requires a returnValue to show a confirmation dialog
          socket.send("/app/leave", {}, JSON.stringify({ lobbyCode }))
          // Redirect the user to the desired page
        };
    
        window.addEventListener('beforeunload', handleRefresh);
    
        return () => {
          window.removeEventListener('beforeunload', handleRefresh);
        };
      }, []);
    
      return <></>; // Empty fragment as the component doesn't render anything
    }

