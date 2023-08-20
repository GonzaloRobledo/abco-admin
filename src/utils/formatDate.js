export const formatDate = date => {
  const dateFormat = new Date(date)

  // Obtener los componentes de la fecha
  const dia = dateFormat.getUTCDate()
  const mes = dateFormat.getUTCMonth() + 1 // Los meses en JavaScript van de 0 a 11
  const año = dateFormat.getUTCFullYear()

  // Crear una cadena con el formato deseado
  return `${dia || 'xx'}/${mes || 'xx'}/${año || 'xxxx'}`
}
