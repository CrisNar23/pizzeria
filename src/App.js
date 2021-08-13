import React from 'react';
import { Routes, Route } from 'react-router';

import firebase, { FirebaseContext } from './firebase'

import Ventas from './components/paginas/Ventas';
import Menu from './components/paginas/Menu';
import Pedidos from './components/paginas/Pedidos';
import NuevoProducto from './components/paginas/NuevoProducto';
import Navbar from './components/ui/Navbar';

function App() {
  return (
    <FirebaseContext.Provider
      value={{firebase}}
    >
      <div>
        <Navbar />

        <Routes>
          <Route path='/' element={<Ventas />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/pedidos' element={<Pedidos />} />
          <Route path='/ventas' element={<Ventas />} />
          <Route path='/nuevoProducto' element={<NuevoProducto />} />
        </Routes>
      </div>
    </FirebaseContext.Provider>
  );
}

export default App;
