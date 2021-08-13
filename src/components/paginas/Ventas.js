import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../../firebase'

import Orden from '../ui/Orden';

const Ventas = () => {

  const [ordenes, guardarOrdenes] = useState([])

  const { firebase } = useContext(FirebaseContext)

  //Consultar la base de datos al cargar
  useEffect(() => {
    const obtenerOrdenes = async () => {
      await firebase.db.collection('ordenes').onSnapshot(manejarSnapshot)
    }
    obtenerOrdenes()
  })

  //Snapshot para DB tiempo real
  function manejarSnapshot(snapshot) {
    const ordenes = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    })

    guardarOrdenes(ordenes)
  }

  return (
    <>
      <div className='p-6'>
        <div className='border-b-2 flex items-center justify-between flex-wrap'>
          <h1 className='text-3xl font-light mb-4'>Ventas</h1>
        </div>
        <div className="flex flex-wrap py-5">
        {ordenes.map(orden => (
          <Orden
            key={orden.id}
            orden={orden}
          />
        ))}
        </div>        
      </div>
    </>
  );
}

export default Ventas;