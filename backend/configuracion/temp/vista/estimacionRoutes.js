// Módulo temporal - RF18: Estimación de costo de envío (pendiente de integración final)

/**
 * Rutas de Estimación de Costo de Envío
 * RF18 - Estimación de costo de envío
 * 
 * Define las rutas para el cálculo y confirmación de estimaciones de costo de envío
 */

import express from 'express';
import EstimacionController from '../controlador/estimacionController.js';

const router = express.Router();

/**
 * GET /api/temp/estimacion/health
 * Endpoint de verificación de salud del módulo
 * 
 * Respuesta exitosa (200):
 * {
 *   exito: true,
 *   mensaje: "Módulo de estimación de costo de envío operativo",
 *   codigo: "RF18_HEALTH_OK",
 *   version: "1.0.0",
 *   timestamp: string
 * }
 */
router.get('/health', EstimacionController.healthCheck);
console.log('✅ Ruta temporal registrada: GET /api/temp/estimacion/health');

/**
 * POST /api/temp/estimacion/confirmar
 * Ajusta el costo final al confirmar el pedido
 * 
 * Body esperado:
 * {
 *   costoEstimado: number (requerido),
 *   ajustes?: {
 *     descuento?: number,
 *     porcentajeDescuento?: number (0-100),
 *     recargo?: number,
 *     porcentajeRecargo?: number
 *   }
 * }
 * 
 * Respuesta exitosa (200):
 * {
 *   exito: true,
 *   mensaje: "Costo ajustado correctamente",
 *   datos: {
 *     costoEstimado: number,
 *     costoFinal: number,
 *     diferencia: number,
 *     ajustesAplicados: string[],
 *     moneda: "COP",
 *     estado: "confirmado",
 *     fechaConfirmacion: string
 *   }
 * }
 * 
 * Errores posibles:
 * - 400: Datos incompletos, ajustes inválidos, costo mal estimado
 * - 500: Error en el cálculo
 */
router.post('/confirmar', EstimacionController.confirmarCosto);
console.log('✅ Ruta temporal registrada: POST /api/temp/estimacion/confirmar');

/**
 * GET /api/temp/estimacion/:idAgricultor/:idDistribuidor
 * Calcula la estimación del costo de envío entre vendedor y usuario
 * 
 * Nota: Los parámetros de ruta mantienen nombres antiguos (idAgricultor, idDistribuidor)
 * para compatibilidad con Postman, pero internamente se mapean a idVendedor e idUsuario.
 * 
 * Parámetros de ruta:
 * - idAgricultor: ID del vendedor (mapeado internamente como idVendedor)
 * - idDistribuidor: ID del usuario (mapeado internamente como idUsuario)
 * 
 * Respuesta exitosa (200):
 * {
 *   exito: true,
 *   mensaje: "Estimación calculada correctamente",
 *   datos: {
 *     idVendedor: number,
 *     idUsuario: number,
 *     ubicacionVendedor: { latitud, longitud, ciudad },
 *     ubicacionUsuario: { latitud, longitud, ciudad },
 *     distanciaKm: number,
 *     tarifaBase: number,
 *     costoPorKm: number,
 *     costoEstimado: number,
 *     formula: string,
 *     moneda: "COP",
 *     estado: "estimado"
 *   }
 * }
 * 
 * Errores posibles:
 * - 400: Parámetros inválidos o incompletos
 * - 404: Ubicación incorrecta
 * - 500: Error en el cálculo
 */
router.get('/:idAgricultor/:idDistribuidor', EstimacionController.calcularEstimacion);
console.log('✅ Ruta temporal registrada: GET /api/temp/estimacion/:idAgricultor/:idDistribuidor');

export default router;