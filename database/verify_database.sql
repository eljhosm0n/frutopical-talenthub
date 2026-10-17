-- Ejecutar en MySQL Workbench. No modifica datos: confirma la base y las tablas.
USE frutopical_talenthub;

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'frutopical_talenthub'
ORDER BY table_name;

-- La API del primer bloque necesita estas columnas.
SELECT table_name, column_name, column_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'frutopical_talenthub'
  AND table_name IN ('convocatoria', 'candidato', 'postulacion', 'estado_postulacion')
ORDER BY table_name, ordinal_position;
