import React from 'react';

const Orden = ({ orden }) => {

  const { nombreCliente, telefono, precio, fecha, producto } = orden

  //const ingrediente = ingredientes

  return (
    <div className='p-5 w-1/2'>
      <div className='p-5 shadow-md bg-white'>
        <div className='lg:flex'>
          <div className='lg:w-5/12 xl:w-4/12'>
            <img className='border-solid border-4 border-gray-800 h-48 w-48' src={producto.imagen} alt={producto.nombre} />
          </div>

          <div className='lg:w-7/12 xl:w-8/12 pl-5'>
            <p className='font-bold text-2xl text-yellow-600 mb-4'>{producto.nombre}</p>
            <p className='text-gray-700 mb-4'><b>Ingredientes:</b> {' '}
              {producto.ingredientes.map((ingrediente, i) => <span key={ingrediente} className='text-gray-600 mb-4'>{(i+1 !== producto.ingredientes.length) ? ingrediente + ', ' : ingrediente}</span>)}
            </p>
            <p className='text-gray-700 mb-4'><b>Cliente: </b>{nombreCliente}</p>
            <p className='text-gray-700 mb-4'><b>Teléfono: </b>{telefono}</p>
            <p className='text-gray-700 mb-4'><b>Fecha: </b>{fecha}</p>
            <p className='text-gray-700 mb-4'><b>Precio: </b> {' '}
              <span className='text-gray-600'>${precio}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orden;