import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../../firebase'

import Producto from '../ui/Producto';

const Menu = () => {

  const [productos, guardarProductos] = useState([])

  const { firebase } = useContext(FirebaseContext)

  //Consultar la base de datos al cargar
  useEffect(() => {
    const obtenerProductos = async () => {
      await firebase.db.collection('productos').onSnapshot(manejarSnapshot)
    }

    obtenerProductos()
  })

  //Snapshot para DB tiempo real
  function manejarSnapshot(snapshot) {
    const productos = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    })

    guardarProductos(productos)
  }

  return (
    <>
      <div className='p-6'>
        <div className='border-b-2 flex items-center justify-between flex-wrap'>
          <h1 className='text-3xl font-light mb-4'>Menú</h1>

          <Link to='/nuevoProducto' className='bg-orange-600 hover:bg-orange-500 inline-block mb-5 p-2 text-white font-bold'>
            Agregar Producto
          </Link>
        </div>
        <div className="flex flex-wrap py-5">
          {productos.map(producto => (
            <Producto
              key={producto.id}
              producto={producto}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Menu;