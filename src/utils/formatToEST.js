export const formatToEST = date => {
  if (!date) return

  const fechaUTC = new Date(date)

  // Convertir a huso horario del Este (ETC)
  const husoHorarioETC = 'America/New_York'

  // Formatear manualmente la fecha ETC en el formato deseado '2023-11-30T20:14:01.530Z'
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: husoHorarioETC,
    hour12: false,
    timeZoneName: 'short'
  }
  const formatoPersonalizadoETC = new Intl.DateTimeFormat('en-US', options)
  const fechaFormateadaETC = formatoPersonalizadoETC.format(fechaUTC)
  const split = fechaFormateadaETC.split(', ')
  const year_split = split[0].split('/')
  return `${year_split[2]}-${year_split[1]}-${year_split[0]} // ${split[1]}`
}
