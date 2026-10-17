export function notFound(_request, response) {
  response.status(404).json({ error: 'Ruta no encontrada.' });
}

export function errorHandler(error, _request, response, _next) {
  console.error(error);
  if (error.code === 'ER_DUP_ENTRY') return response.status(409).json({ error: 'Ya existe un registro con esos datos.' });
  if (error.code === 'ER_NO_REFERENCED_ROW_2') return response.status(422).json({ error: 'La relación indicada no existe.' });
  response.status(500).json({ error: 'Ocurrió un error inesperado.' });
}
