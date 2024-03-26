import React, { useEffect, useState } from 'react';
import CardDetails from './cardDetails';
import CardDisplay from './cardDisplay';
function App() {
  return (
      <div className = "app">
        <CardDetails/>
        <CardDisplay/>
      </div>

  );
}

export default App;
