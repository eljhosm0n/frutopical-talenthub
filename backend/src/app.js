import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { environment } from './config/env.js';
import { errorHandler, notFound } from './middlewares/error-handler.js';

import { convocatoriasRouter } from './modules/convocatorias/convocatorias.routes.js';
import { postulacionesRouter } from './modules/postulaciones/postulaciones.routes.js';
import { vinculacionesRouter } from './modules/vinculaciones/vinculaciones.routes.js';
import { expedientesRouter } from './modules/expedientes/expedientes.routes.js';
import { solicitudesRouter } from './modules/solicitudes/solicitudes.routes.js';
import usuariosRouter from './modules/usuarios/usuarios.routes.js';
import diagnosticoRoutes from './modules/diagnostico/diagnostico.routes.js';
import sstRoutes from './modules/sst/sst.routes.js';

import authRoutes from './routes/auth.routes.js';

const { clientOrigin } = environment();

export const app = express();

app.use(helmet());

app.use(
  cors({
    origin: clientOrigin
  })
);

app.use(express.json());

app.use(morgan('dev'));

app.get(
  '/api/v1/health',
  (_request, response) => response.json({ status: 'ok' })
);

// Módulos públicos
app.use('/api/v1/convocatorias', convocatoriasRouter);
app.use('/api/v1/postulaciones', postulacionesRouter);

// Autenticación
app.use('/api/v1/auth', authRoutes);

// Módulos internos
app.use('/api/v1/vinculaciones', vinculacionesRouter);
app.use('/api/v1/expedientes', expedientesRouter);
app.use('/api/v1/solicitudes', solicitudesRouter);
app.use('/api/v1/usuarios', usuariosRouter);
app.use('/api/v1/diagnostico', diagnosticoRoutes);
app.use('/api/sst', sstRoutes);

app.use(notFound);
app.use(errorHandler);