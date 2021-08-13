import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { FirebaseContext } from '../../firebase'
import { useNavigate } from 'react-router-dom'
import FileUploader from 'react-firebase-file-uploader'


const NuevoProducto = () => {

  const ingredientes = [{ nombre: 'Jamón', valor: 3000 }, { nombre: 'Queso', valor: 3000 },
  { nombre: 'Piña', valor: 3000 }, { nombre: 'Champiñones', valor: 3000 }, { nombre: 'Pepperoni', valor: 4500 },
  { nombre: 'Tomate', valor: 3000 }, { nombre: 'Salami', valor: 3000 }, { nombre: 'Carne', valor: 3000 },
  { nombre: 'Salchicha', valor: 3000 }, { nombre: 'Pollo', valor: 5000 }, { nombre: 'Arándanos', valor: 3000 },
  { nombre: 'Tocino', valor: 3000 }, { nombre: 'Cereza', valor: 3000 }, { nombre: 'Queso Azul', valor: 3000 },
  { nombre: 'Pimentón', valor: 3000 }]

  //State para los ingredientes
  const [total, guardarTotal] = useState(10000)
  const [lstIngredientes, guardarLstIngredientes] = useState([])

  //State para las imagenes
  const [subiendo, guardarSubiendo] = useState(false)
  const [progreso, guardarProgreso] = useState(0)
  const [urlimagen, guardarUrlImagen] = useState('')

  //Context con las operaciones de firebase
  const { firebase } = useContext(FirebaseContext)

  //Hook para redireccionar
  const navigate = useNavigate()

  //Validación y leer los datos del formulario
  const formik = useFormik({
    initialValues: {
      nombre: '',
      ingredientes: '',
      precio: '',
      imagen: ''
    },
    validationSchema: Yup.object({
      nombre: Yup.string()
        .min(3, 'Los productos deben tener al menos 3 caracteres')
        .required('El nombre del producto es obligatorio'),
      ingredientes: Yup.string().required('Seleccione al menos un ingrediente')
    }),
    onSubmit: productos => {
      try {
        productos.imagen = urlimagen
        productos.ingredientes = lstIngredientes
        productos.precio = total
        firebase.db.collection('productos').add(productos)

        //Redireccionar
        navigate('/menu')
      } catch (error) {
        console.log(error)
      }
    }
  })

  //Almacena los ingredientes de la pizza
  const almacenarIngradientes = ingredienteAgregar => {
    let ingredienteRepetido = false
    lstIngredientes.forEach(ingrediente => {
      if (ingrediente === ingredienteAgregar) {
        ingredienteRepetido = true
      }
    })
    if (ingredienteRepetido !== true) {
      let arrIngredientes = [...lstIngredientes]
      arrIngredientes.push(ingredienteAgregar)
      guardarLstIngredientes(arrIngredientes)
      calcularPrecio(ingredienteAgregar)
    }
  }

  const eliminarIngredientes = ingredienteBorrar => {
    guardarLstIngredientes(ingredientes => ingredientes.filter(ingrediente => ingrediente !== ingredienteBorrar));
  }

  //Calcula el valor de la pizza segun los ingredientes seleccionados
  const calcularPrecio = ingrediente => {
    let nuevoTotal = 0
    if (ingrediente === 'Pepperoni') {
      nuevoTotal = total + 4500
      guardarTotal(nuevoTotal)
      formik.values.precio = nuevoTotal
    } else if (ingrediente === 'Pollo') {
      nuevoTotal = total + 5000
      guardarTotal(nuevoTotal)
      formik.values.precio = nuevoTotal
    } else {
      nuevoTotal = total + 3000
      guardarTotal(nuevoTotal)
      formik.values.precio = nuevoTotal
    }
  }

  //Todo sobre las imagenes
  const handleUploadStart = () => {
    guardarProgreso(0)
    guardarSubiendo(true)
  }

  const handleUploadError = error => {
    guardarSubiendo(false)
    console.log(error)
  }

  const handleUploadSuccess = async nombre => {
    guardarProgreso(100)
    guardarSubiendo(false)

    //Almacenar la URL de destino
    const url = await firebase.storage.ref('productos').child(nombre).getDownloadURL()
    guardarUrlImagen(url)
  }

  const handleProgress = progreso => {
    guardarProgreso(progreso)
  }

  return (
    <>
      <div className='p-6'>
        <div className='border-b-2 flex items-center justify-between flex-wrap'>
          <h1 className='text-3xl font-light mb-4'>Nuevo Producto</h1>
        </div>

        <div className='flex justify-center mt-10'>
          <div className='w-full max-w-3xl'>
            <form onSubmit={formik.handleSubmit}>
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'>Nombre</label>
                <input
                  className='shadow appearance-none border rounded w-full 
                    py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='nombre'
                  type='text'
                  placeholder='Nombre Producto'
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleChange}
                />
              </div>
              {formik.touched.nombre && formik.errors.nombre ? (
                <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-2' role='alert'>
                  <p>{formik.errors.nombre}</p>
                </div>
              ) : null}

              <div>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='ingredientes'>Ingredientes</label>
                <select
                  className='shadow appearance-none border rounded w-full 
                    py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='ingredientes'
                  name='ingredientes'
                  value={formik.values.ingredientes}
                  onChange={e => {
                    formik.handleChange(e);
                    almacenarIngradientes(e.currentTarget.value)
                  }}
                  onBlur={formik.handleBlur}
                >
                  <option value=''>-- Seleccione un ingrediente --</option>
                  {ingredientes.map(ingrediente => <option key={ingrediente.nombre} value={ingrediente.nombre}>{ingrediente.nombre}</option>)}
                </select>
                <div className="w-full p-2 items-center text-white leading-none flex lg:inline-flex flex-wrap">
                  {lstIngredientes.map(ingrediente =>
                    <div className="flex rounded-full bg-orange-600 px-2 py-1 mb-2 text-xs font-bold mr-1" key={ingrediente}>
                      <span key={ingrediente.nombre} className='my-1 pr-2'>{ingrediente}</span>
                      <button
                        type="button"
                        className="rounded-full h-5 w-5 flex items-center justify-center bg-orange-400"
                        onClick={() => eliminarIngredientes(ingrediente)}
                      >
                        X
                    </button>
                    </div>

                  )}
                </div>
              </div>
              {formik.touched.ingredientes && formik.errors.ingredientes ? (
                <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-2' role='alert'>
                  <p>{formik.errors.ingredientes}</p>
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
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='imagen'>Imagen</label>
                <FileUploader
                  accept='image/*'
                  id='imagen'
                  name='imagen'
                  randomizeFilename
                  storageRef={firebase.storage.ref('productos')}
                  onUploadStart={handleUploadStart}
                  onUploadError={handleUploadError}
                  onUploadSuccess={handleUploadSuccess}
                  onProgress={handleProgress}
                />
              </div>
              {subiendo && (
                <div className='h-12 relative w-full border'>
                  <div className='bg-green-500 absolute left-0 top-0 text-white px-2 text-sm 
                          h-12 flex items-center'
                    style={{ width: `${progreso}%` }}
                  >
                    {progreso} %
                </div>
                </div>
              )}
              {urlimagen && (
                <p className='bg-green-500 text-white p-3 text-center my-5'>La imagen se subió correctamente</p>
              )}

              <input
                type='submit'
                className='bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold'
                value='Agregar Producto'
              />

            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default NuevoProducto;