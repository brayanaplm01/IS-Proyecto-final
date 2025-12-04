const Orden = require('../models/Orden');
const DetalleOrden = require('../models/DetalleOrden');
const User = require('../models/User').default;
const Producto = require('../models/Producto');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database').default;
const { Op } = require('sequelize');

// Generar QR para el pago
const generarQRPago = async (req, res) => {
  try {
    const { orden_id } = req.params;
    const { deliveryCost } = req.query; // Leer costo de envío de query params
    const costoEnvio = parseFloat(deliveryCost || '0'); // Convertir a número, default 0 si no existe (JavaScript)
    
    const orden = await Orden.findByPk(orden_id);

    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    // Crear datos para el QR (usamos el nombre guardado en la orden)
    const qrData = {
      orden_id: orden.id,
      total: orden.total + costoEnvio, // Sumar costo de envío al total
      fecha: orden.fecha_orden,
      usuario: orden.usuario_nombre
    };

    // Generar QR como base64
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
    
    res.json({ qrCode });
  } catch (error) {
    console.error('Error al generar QR:', error);
    res.status(500).json({ error: 'Error al generar el código QR' });
  }
};

// Crear nueva orden
const crearOrden = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { usuario_id, items, usuario_nombre } = req.body;
    
    // Calcular total
    let total = 0;
    for (const item of items) {
      const producto = await Producto.findByPk(item.producto_id);
      if (!producto) {
        throw new Error(`Producto ${item.producto_id} no encontrado`);
      }
      total += producto.precio * item.cantidad;
    }

    // Crear orden
    const orden = await Orden.create({
      usuario_id,
      usuario_nombre,
      total,
      estado: 'pendiente'
    }, { transaction: t });

    // Crear detalles de la orden
    for (const item of items) {
      const producto = await Producto.findByPk(item.producto_id);
      const detalle = await DetalleOrden.create({
        orden_id: orden.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: producto.precio,
        subtotal: producto.precio * item.cantidad
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json(orden);
  } catch (error) {
    await t.rollback();
    console.error('Error al crear orden (con rollback):', error);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
};

// Procesar pago
const procesarPago = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { orden_id } = req.params;
    const { metodo_pago, tipo_envio, descripcion_envio, costo_envio } = req.body;

    const orden = await Orden.findByPk(orden_id, { transaction: t });
    if (!orden) {
      await t.rollback();
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    // Actualizar información de envío
    orden.tipo_envio = tipo_envio;
    orden.descripcion_envio = descripcion_envio;
    orden.costo_envio = costo_envio;
    
    // Actualizar estado y fecha de pago
    orden.estado = 'pagado';
    orden.fecha_pago = new Date();
    orden.metodo_pago = metodo_pago;
    orden.numero_factura = `FAC-${Date.now()}`;

    await orden.save({ transaction: t });

    // --- Reducir la cantidad de los productos --- //
    // Recargar la orden con los detalles y productos asociados dentro de la misma transacción
    const ordenConDetalles = await Orden.findByPk(orden_id, {
        include: [
          {
            model: DetalleOrden,
            include: [Producto]
          }
        ],
        transaction: t // Asegurarse de usar la transacción
    });

    if (ordenConDetalles && ordenConDetalles.DetalleOrdens && Array.isArray(ordenConDetalles.DetalleOrdens)) {
      for (const detalle of ordenConDetalles.DetalleOrdens) {
        const producto = detalle.Producto; // Acceder al producto incluido
        if (producto) {
          // Convertir a número para asegurar operaciones correctas
          const cantidadEnStock = parseInt(producto.cantidad);
          const cantidadComprada = detalle.cantidad;

          if (!isNaN(cantidadEnStock) && !isNaN(cantidadComprada) && cantidadEnStock >= cantidadComprada) {
            producto.cantidad = cantidadEnStock - cantidadComprada; // Reducir la cantidad
            await producto.save({ transaction: t }); // Guardar dentro de la transacción
          } else {
            // Manejar caso de cantidad insuficiente (opcional: revertir transacción, log error, etc.)
            console.warn(`Cantidad insuficiente para producto ${producto.id_producto} (${producto.nombre}). Cantidad actual: ${cantidadEnStock}, Cantidad solicitada: ${cantidadComprada}`);
            // Dependiendo de la lógica de negocio, podrías querer lanzar un error aquí
            // throw new Error(`Cantidad insuficiente para ${producto.nombre}`);
          }
        } else {
          console.error(`Producto con ID ${detalle.producto_id} no encontrado al actualizar cantidad.`);
        }
      }
    } else {
      console.warn('No se encontraron detalles de orden para actualizar la cantidad.');
    }
    // ------------------------------------ //

    await t.commit(); // Confirmar la transacción después de actualizar cantidad

    // Recargar la orden con los detalles para la factura (fuera de la transacción si solo es para lectura)
    const ordenCompleta = await Orden.findByPk(orden_id, {
      include: [
        {
          model: DetalleOrden,
          include: [Producto]
        }
      ]
    });

    // Generar factura
    const facturaPath = await generarFactura(ordenCompleta);

    res.json({
      mensaje: 'Pago procesado exitosamente',
      factura_url: `/facturas/${path.basename(facturaPath)}`
    });
  } catch (error) {
    // Solo hacer rollback si la transacción no ha sido confirmada o revertida
    if (t && t.finished === null) {
      await t.rollback();
    }
    console.error('Error al procesar pago:', error);
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
};

// Generar factura en PDF
const generarFactura = async (orden) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const facturaPath = path.join(__dirname, '../public/facturas', `factura-${orden.numero_factura}.pdf`);
      
      // Asegurar que el directorio existe
      if (!fs.existsSync(path.dirname(facturaPath))) {
        fs.mkdirSync(path.dirname(facturaPath), { recursive: true });
      }

      const stream = fs.createWriteStream(facturaPath);
      doc.pipe(stream);

      // Encabezado
      doc.fontSize(20).text('FACTURA', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Número de Factura: ${orden.numero_factura}`);
      doc.text(`Fecha: ${orden.fecha_pago.toLocaleDateString()}`);
      doc.text(`Cliente: ${orden.usuario_nombre}`);
      doc.moveDown();

      // Tabla de productos
      doc.fontSize(12).text('Productos:', { underline: true });
      doc.moveDown();

      // Encabezados de la tabla
      const tableTop = doc.y;
      doc.text('Producto', 50, tableTop);
      doc.text('Cantidad', 250, tableTop);
      doc.text('Precio Unitario', 350, tableTop);
      doc.text('Subtotal', 450, tableTop);
      doc.moveDown();

      // Línea separadora
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Productos
      let y = doc.y;
      let productosSubtotal = 0;
      if (orden.DetalleOrdens && Array.isArray(orden.DetalleOrdens)) {
        orden.DetalleOrdens.forEach(detalle => {
          const producto = detalle.Producto;
          if (producto) {
            const productoNombre = producto.nombre || 'Producto Desconocido';
            const cantidad = detalle.cantidad || 0;
            const precioUnitario = parseFloat(producto.precio || 0).toFixed(2);
            const subtotalLinea = parseFloat(detalle.subtotal || 0).toFixed(2);

            doc.text(productoNombre, 50, y);
            doc.text(cantidad.toString(), 250, y);
            doc.text(`$${precioUnitario}`, 350, y);
            doc.text(`$${subtotalLinea}`, 450, y);
            productosSubtotal += parseFloat(detalle.subtotal || 0);
            y += 20;
          }
        });
      } else {
        doc.text('No hay detalles de productos disponibles.', 50, y);
        y += 20;
      }

      // Información de envío
      doc.moveDown(2);
      // Establecer la posición x antes de agregar la información de envío
      const infoEnvioX = 50; // Usar el mismo margen que la tabla de productos
      doc.text('Información de Envío:', infoEnvioX, doc.y, { underline: true });
      doc.moveDown();
      doc.text(`Tipo de Envío: ${orden.descripcion_envio || 'Entrega normal'}`, infoEnvioX, doc.y);
      const costoEnvio = parseFloat(orden.costo_envio || 0);
      doc.text(`Costo de Envío: $${costoEnvio.toFixed(2)}`, infoEnvioX, doc.y);

      // Totales
      doc.moveDown(2);
      doc.text(`Subtotal Productos: $${productosSubtotal.toFixed(2)}`, { align: 'right' });
      doc.text(`Costo de Envío: $${costoEnvio.toFixed(2)}`, { align: 'right' });
      doc.moveDown();
      const totalFinal = productosSubtotal + costoEnvio;
      doc.fontSize(14).text(`Total: $${totalFinal.toFixed(2)}`, { align: 'right' });

      doc.end();

      stream.on('finish', () => resolve(facturaPath));
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

// Actualizar total de la orden (para añadir costo de envío)
const updateOrdenTotal = async (req, res) => {
  try {
    const { orden_id } = req.params;
    const { nuevoTotal } = req.body;

    const orden = await Orden.findByPk(orden_id);

    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    // Actualizar el total
    orden.total = nuevoTotal;
    await orden.save();

    res.json({ mensaje: 'Total de orden actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar total de orden:', error);
    res.status(500).json({ error: 'Error al actualizar el total de la orden' });
  }
};

// Controlador para listar todas las órdenes
const getAllOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.findAll({
      include: [
        {
          model: User,
          attributes: [
              ['id_usuario', 'id'],
              'nombre',
              'correo'
          ]
        },
        {
          model: DetalleOrden,
          include: [
            {
              model: Producto,
              attributes: [
                  ['id_producto', 'id'],
                  'nombre',
                  'precio'
              ]
            }
          ]
        }
      ],
      order: [['fecha_orden', 'DESC']]
    });
    
    res.status(200).json({ message: 'Órdenes obtenidas correctamente', ordenes });
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener órdenes', error: error.message });
  }
};

// Controlador para actualizar el estado de una orden
const updateOrdenEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const orden = await Orden.findByPk(id);

    if (!orden) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    if (estado !== 'pendiente' && estado !== 'entregado') {
      return res.status(400).json({ message: 'Estado inválido. Debe ser "pendiente" o "entregado".' });
    }

    orden.estado = estado;
    await orden.save();

    const ordenActualizada = await Orden.findByPk(id, {
         include: [
            {
              model: User,
              attributes: [
                   ['id_usuario', 'id'],
                   'nombre',
                   'correo'
               ]
            },
            {
              model: DetalleOrden,
              include: [
                {
                  model: Producto,
                  attributes: [
                       ['id_producto', 'id'],
                        'nombre',
                        'precio'
                    ]
                  }
                ]
              }
          ]
      });


    res.status(200).json({ message: 'Estado de la orden actualizado correctamente', orden: ordenActualizada });
  } catch (error) {
    console.error('Error al actualizar estado de la orden:', error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar estado de la orden', error: error.message });
  }
};

module.exports = {
  generarQRPago,
  crearOrden,
  procesarPago,
  generarFactura,
  updateOrdenTotal,
  getAllOrdenes,
  updateOrdenEstado
}; 