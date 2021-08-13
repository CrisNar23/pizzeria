import React, { useState, useContext, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { FirebaseContext } from '../../firebase'
import { useNavigate } from 'react-router-dom'

const Pedidos = () => {

  const [productos, guardarProductos] = useState([])
  const [total, guardarTotal] = useState('')
  const [productoSeleccionado, guardarProductoSeleccionado] = useState('')

  const { firebase } = useContext(FirebaseContext)

  //Hook para redireccionar
  const navigate = useNavigate()

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

  //Validación y leer los datos del formulario
  const formik = useFormik({
    initialValues: {
      nombreCliente: '',
      telefono: '',
      producto: '',
      precio: '',
      fecha: ''
    },
    validationSchema: Yup.object({
      nombreCliente: Yup.string()
        .min(3, 'El nombre debe contener al menos 3 caracteres')
        .required('El nombre del cliente es obligatorio'),
      telefono: Yup.number()
        .min(7, 'El teléfono debe contener al menos 7 caracteres')
        .required('El teléfono del cliente es obligatorio'),
      producto: Yup.string()
        .required('Debe seleccionar un producto'),
      fecha: Yup.date()
        .required('La fecha es obligatoria'),
    }),
    onSubmit: ordenes => {
      try {
        ordenes.producto = productoSeleccionado
        ordenes.precio = total
        firebase.db.collection('ordenes').add(ordenes)

        //Redireccionar
        navigate('/ventas')
      } catch (error) {
        console.log(error)
      }
    }
  })

  const almacenarProducto = value => {
    const producto = productos.find(producto => producto.nombre === value)
    guardarProductoSeleccionado(producto)
    guardarTotal(producto.precio)
  }

  return (
    <>
      <div className='p-6'>
        <div className='border-b-2 flex items-center justify-between flex-wrap'>
          <h1 className='text-3xl font-light mb-4'>Pedidos</h1>
        </div>

        <div className='flex justify-center mt-10'>
          <div className='w-full max-w-3xl'>
            <form onSubmit={formik.handleSubmit}>
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombreCliente'>Nombre</label>
                <input
                  className='shadow appearance-none border rounded w-full 
                    py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='nombreCliente'
                  type='text'
                  placeholder='Nombre Cliente'
                  value={formik.values.nombreCliente}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.nombreCliente && formik.errors.nombreCliente ? (
                <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-2' role='alert'>
                  <p>{formik.errors.nombreCliente}</p>
                </div>
              ) : null}

              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='telefono'>Teléfono</label>
                <input
                  className='shadow appearance-none border rounded w-full 
                    py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='telefono'
                  type='numeric'
                  placeholder='Teléfono'
                  value={formik.values.telefono}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.telefono && formik.errors.telefono ? (
                <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-2' role='alert'>
                  <p>{formik.errors.telefono}</p>
                </div>
              ) : null}

              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='producto'>Producto</label>
                <select
                  className='shadow appearance-none border rounded w-full 
                py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='producto'
                  name='producto'
                  value={formik.values.producto}
                  onChange={e => {
                    formik.handleChange(e);
                    almacenarProducto(e.currentTarget.value)
                  }}
                  onBlur={formik.handleBlur}

                >
                  <option value=''>-- Seleccione un producto --</option>
                  {productos.map(producto => <option key={producto.id} value={producto.nombre}>{producto.nombre}</option>)}
                </select>
              </div>
              {formik.touched.producto && formik.errors.producto ? (
                <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-2' role='alert'>
                  <p className='font-bold'>Hubo un error:</p>
                  <p>{formik.errors.producto}</p>
                </div>
              ) : null}

              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='precio'>Precio</label>
                <input
                  className='shadow appearance-none border rounded w-full 
                    py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='precio'
                  placeholder='$0'
                  readOnly='readOnly'
                  value={total}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='fecha'>Fecha</label>
                <input
                  className='shadow appearance-none border rounded w-full 
                    py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='fecha'
                  type='date'
                  value={formik.values.fecha}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.fecha && formik.errors.fecha ? (
                <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-2' role='alert'>
                  <p>{formik.errors.fecha}</p>
                </div>
              ) : null}

              <input
                type='submit'
                className='bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold'
                value='Realizar Pedido'
              />

            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Pedidos;
