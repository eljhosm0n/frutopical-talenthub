USE frutopical_talenthub;

-- Inserta solo los estados que falten; se puede ejecutar más de una vez.
INSERT INTO estado_postulacion (nombre)
SELECT 'RECIBIDA' WHERE NOT EXISTS (SELECT 1 FROM estado_postulacion WHERE nombre = 'RECIBIDA');
INSERT INTO estado_postulacion (nombre)
SELECT 'PRESELECCIONADA' WHERE NOT EXISTS (SELECT 1 FROM estado_postulacion WHERE nombre = 'PRESELECCIONADA');
INSERT INTO estado_postulacion (nombre)
SELECT 'EN EVALUACIÓN' WHERE NOT EXISTS (SELECT 1 FROM estado_postulacion WHERE nombre = 'EN EVALUACIÓN');
INSERT INTO estado_postulacion (nombre)
SELECT 'ELEGIBLE' WHERE NOT EXISTS (SELECT 1 FROM estado_postulacion WHERE nombre = 'ELEGIBLE');
INSERT INTO estado_postulacion (nombre)
SELECT 'NO SELECCIONADA' WHERE NOT EXISTS (SELECT 1 FROM estado_postulacion WHERE nombre = 'NO SELECCIONADA');
