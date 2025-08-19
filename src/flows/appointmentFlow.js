/**
 * Flujo para manejar citas y agendamiento
 */

const { addKeyword, addAnswer } = require('@bot-whatsapp/bot');
const AppointmentManager = require('../utils/appointmentManager');

class AppointmentFlow {
  constructor() {
    this.appointmentManager = new AppointmentManager();
    this.flows = this.createFlows();
  }

  /**
   * Crea todos los flujos relacionados con citas
   * @returns {Array} Array de flujos creados
   */
  createFlows() {
    const flows = [];

    // Flujo de bienvenida y saludos
    const welcomeFlow = addKeyword(['hola', 'ole', 'alo', 'buenos días', 'buenas', 'buenas tardes', 'buenas noches', 'hey', 'hi', 'hello'])
      .addAnswer('¡Hola! Buenas tardes, ¿en qué te podemos colaborar?')
      .addAnswer(
        [
          '📅 Soy tu asistente virtual para agendar citas',
          '',
          '🔑 *Comandos disponibles:*',
          '• *cita* - Agendar nueva cita',
          '• *horarios* - Ver horarios disponibles',
          '• *mis citas* - Ver mis citas',
          '• *cancelar* - Cancelar cita',
          '• *ayuda citas* - Ayuda del sistema',
          '',
          '💬 ¿Qué te gustaría hacer?'
        ]
      );

    flows.push(welcomeFlow);

    // Flujo principal de citas
    const mainAppointmentFlow = addKeyword(['cita', 'agendar', 'reservar', 'horario'])
      .addAnswer('📅 ¡Perfecto! Te ayudo a agendar tu cita')
      .addAnswer(
        [
          '📝 *Proceso de agendamiento:*',
          '',
          '1️⃣ Primero elige la fecha (DD/MM)',
          '2️⃣ Luego elige la hora (HH:MM)',
          '3️⃣ Confirma tu cita',
          '',
          '⏰ *Horario de atención:*',
          '• Lunes a Viernes: 8:00 AM - 6:00 PM',
          '• Sábados: 8:00 AM - 12:00 PM',
          '• Domingos: Cerrado',
          '',
          '📅 ¿Para qué fecha te gustaría agendar? (ej: 15/01, 18/01, 22/01)',
          '',
          '💡 *Fechas disponibles:*',
          '• 15/01 (Miércoles)',
          '• 18/01 (Sábado)',
          '• 22/01 (Miércoles)',
          '• 25/01 (Sábado)',
          '• 29/01 (Miércoles)'
        ]
      );

    flows.push(mainAppointmentFlow);

    // Flujo para ver horarios disponibles
    const viewSlotsFlow = addKeyword(['horarios', 'disponible', 'ver horarios'])
      .addAnswer(
        [
          '🕐 *Consulta de Horarios Disponibles*',
          '',
          '📅 Escribe la fecha que quieres consultar:',
          'Formato: DD/MM (ej: 15/01, 18/01, 22/01)',
          '',
          '💡 *Fechas disponibles:*',
          '• 15/01 (Miércoles)',
          '• 18/01 (Sábado)',
          '• 22/01 (Miércoles)',
          '• 25/01 (Sábado)',
          '• 29/01 (Miércoles)'
        ]
      );

    flows.push(viewSlotsFlow);

    // Flujo para cancelar citas
    const cancelFlow = addKeyword(['cancelar', 'cancelar cita', 'anular'])
      .addAnswer(
        [
          '❌ *Cancelación de Cita*',
          '',
          '📝 Para cancelar tu cita, necesito:',
          '• Tu nombre completo',
          '• La fecha de la cita',
          '• La hora de la cita',
          '',
          '💬 ¿Cuál es tu nombre completo?'
        ]
      );

    flows.push(cancelFlow);

    // Flujo para consultar mis citas
    const myAppointmentsFlow = addKeyword(['mis citas', 'ver citas', 'citas'])
      .addAnswer(
        [
          '📋 *Consulta de Mis Citas*',
          '',
          'Para ver tus citas, necesito tu nombre completo.',
          '',
          '💬 ¿Cuál es tu nombre completo?'
        ]
      );

    flows.push(myAppointmentsFlow);

    // Flujo para ayuda de citas
    const helpAppointmentFlow = addKeyword(['ayuda citas', 'ayuda agendar'])
      .addAnswer(
        [
          '📚 *AYUDA - SISTEMA DE CITAS*',
          '',
          '🔑 *Comandos principales:*',
          '• *cita* - Agendar nueva cita',
          '• *horarios* - Ver horarios disponibles',
          '• *mis citas* - Ver mis citas',
          '• *cancelar* - Cancelar cita',
          '',
          '📅 *Formato de fecha:* DD/MM',
          '🕐 *Formato de hora:* HH:MM (24h)',
          '',
          '⏰ *Horario de atención:*',
          '• Lunes-Viernes: 8:00-18:00',
          '• Sábados: 8:00-12:00',
          '• Domingos: Cerrado',
          '',
          '💡 *Consejos:*',
          '• Las citas duran 1 hora',
          '• Tienes 5 minutos para confirmar',
          '• Puedes cancelar en cualquier momento'
        ]
      );

    flows.push(helpAppointmentFlow);

    // Flujo para mensajes no entendidos
    const defaultFlow = addKeyword(['default'])
      .addAnswer(
        [
          'Disculpa, no he logrado entender tu mensaje.',
          '',
          '🔑 *Comandos disponibles:*',
          '• *cita* - Agendar nueva cita',
          '• *horarios* - Ver horarios disponibles',
          '• *mis citas* - Ver mis citas',
          '• *cancelar* - Cancelar cita',
          '• *ayuda citas* - Ayuda del sistema',
          '',
          '💬 ¿Qué te gustaría hacer?'
        ]
      );

    flows.push(defaultFlow);

    return flows;
  }

  /**
   * Crea un flujo dinámico para procesar fechas
   * @returns {Object} Flujo creado
   */
  createDateProcessingFlow() {
    // Crear flujo que detecte cualquier patrón de fecha
    const flow = addKeyword(['default']);
    
    flow.addAnswer((ctx, { flowDynamic }) => {
      const userText = ctx.body;
      const clientId = ctx.from;
      
      // Buscar patrón de fecha en el texto (solo DD/MM)
      const datePattern = /(\d{1,2})\/(\d{1,2})/;
      const dateMatch = userText.match(datePattern);
      
      if (dateMatch) {
        const day = dateMatch[1];
        const month = dateMatch[2];
        const currentYear = new Date().getFullYear();
        const dateStr = `${day}/${month}/${currentYear}`;
        
        // Consultar disponibilidad en el JSON
        const disponibilidad = this.appointmentManager.consultarDisponibilidadFecha(dateStr);
        
        if (!disponibilidad.disponible) {
          flowDynamic(disponibilidad.mensaje);
          flowDynamic('💬 ¿Te gustaría probar con otra fecha? (ej: 15/01, 18/01, 22/01)');
          return;
        }

        // Mostrar información de disponibilidad
        flowDynamic(disponibilidad.mensaje);
        
        // Mostrar horarios disponibles
        let message = `🕐 *Horarios disponibles para el ${dateStr} (${disponibilidad.diaSemana}):*\n\n`;
        disponibilidad.horarios.forEach((hora, index) => {
          message += `${index + 1}. ${hora}:00 - ${hora}:59\n`;
        });
        
        // Mostrar citas ocupadas si las hay
        if (disponibilidad.citasOcupadas.length > 0) {
          message += '\n📅 *Citas ya agendadas:*\n';
          disponibilidad.citasOcupadas.forEach(cita => {
            message += `• ${cita.hora}:00 - ${cita.cliente}\n`;
          });
        }
        
        message += '\n💬 ¿A qué hora prefieres? (ej: 14:00)';
        
        flowDynamic(message);
        
        // Guardar fecha y horarios disponibles en contexto del usuario
        this.saveUserContext(clientId, { 
          date: dateStr, 
          step: 'selecting_time',
          horariosDisponibles: disponibilidad.horarios,
          diaSemana: disponibilidad.diaSemana
        });
        return;
      }
      
      // Si no es una fecha, mostrar mensaje de ayuda
      flowDynamic('Disculpa, no he logrado entender tu mensaje.');
      flowDynamic(
        [
          '🔑 *Comandos disponibles:*',
          '• *cita* - Agendar nueva cita',
          '• *horarios* - Ver horarios disponibles',
          '• *mis citas* - Ver mis citas',
          '• *cancelar* - Cancelar cita',
          '• *ayuda citas* - Ayuda del sistema',
          '',
          '📅 *Para agendar:* Escribe una fecha (ej: 15/01, 18/01)',
          '💬 ¿Qué te gustaría hacer?'
        ]
      );
    });

    return flow;
  }

  /**
   * Crea un flujo dinámico para procesar horas
   * @returns {Object} Flujo creado
   */
  createTimeProcessingFlow() {
    // Crear flujo que detecte cualquier patrón de hora
    const flow = addKeyword(['default']);
    
    flow.addAnswer((ctx, { flowDynamic }) => {
      const userText = ctx.body;
      const clientId = ctx.from;
      
      // Obtener contexto del usuario
      const userContext = this.getUserContext(clientId);
      
      if (!userContext || !userContext.date) {
        // Si no hay contexto de fecha, verificar si es una fecha
        const datePattern = /(\d{1,2})\/(\d{1,2})/;
        const dateMatch = userText.match(datePattern);
        
        if (dateMatch) {
          // Es una fecha, procesarla
          const day = dateMatch[1];
          const month = dateMatch[2];
          const currentYear = new Date().getFullYear();
          const dateStr = `${day}/${month}/${currentYear}`;
          
          const disponibilidad = this.appointmentManager.consultarDisponibilidadFecha(dateStr);
          
          if (!disponibilidad.disponible) {
            flowDynamic(disponibilidad.mensaje);
            flowDynamic('💬 ¿Te gustaría probar con otra fecha? (ej: 15/01, 18/01, 22/01)');
            return;
          }

          flowDynamic(disponibilidad.mensaje);
          
          let message = `🕐 *Horarios disponibles para el ${dateStr} (${disponibilidad.diaSemana}):*\n\n`;
          disponibilidad.horarios.forEach((hora, index) => {
            message += `${index + 1}. ${hora}:00 - ${hora}:59\n`;
          });
          
          if (disponibilidad.citasOcupadas.length > 0) {
            message += '\n📅 *Citas ya agendadas:*\n';
            disponibilidad.citasOcupadas.forEach(cita => {
              message += `• ${cita.hora}:00 - ${cita.cliente}\n`;
            });
          }
          
          message += '\n💬 ¿A qué hora prefieres? (ej: 14:00)';
          
          flowDynamic(message);
          
          this.saveUserContext(clientId, { 
            date: dateStr, 
            step: 'selecting_time',
            horariosDisponibles: disponibilidad.horarios,
            diaSemana: disponibilidad.diaSemana
          });
          return;
        }
        
        flowDynamic('Disculpa, primero necesito que elijas una fecha. Escribe "cita" para empezar.');
        return;
      }

      // Buscar patrón de hora en el texto
      const timePattern = /(\d{1,2}):(\d{2})/;
      const timeMatch = userText.match(timePattern);
      
      if (!timeMatch) {
        flowDynamic('Disculpa, no he logrado entender tu mensaje. Dijita la hora así: 14:00');
        return;
      }
      
      const timeStr = timeMatch[0];
      
      // Validar que la hora esté en los horarios disponibles
      const horaNumerica = timeStr.split(':')[0];
      if (!userContext.horariosDisponibles.includes(horaNumerica)) {
        flowDynamic(`Disculpa, la hora ${timeStr} no está disponible para el ${userContext.date}.`);
        flowDynamic(`Los horarios disponibles son: ${userContext.horariosDisponibles.join(', ')}:00`);
        return;
      }

      // Verificar que no esté ocupada
      const disponibilidad = this.appointmentManager.consultarDisponibilidadFecha(userContext.date);
      const horaOcupada = disponibilidad.citasOcupadas.find(cita => cita.hora === horaNumerica);
      
      if (horaOcupada) {
        flowDynamic(`Disculpa, la hora ${timeStr} ya está ocupada por ${horaOcupada.cliente}.`);
        flowDynamic('💬 ¿Te gustaría elegir otro horario?');
        return;
      }

      // Crear cita pendiente
      const appointment = this.appointmentManager.createPendingAppointment(
        userContext.date, 
        timeStr, 
        clientId
      );

      // Mensaje de confirmación
      flowDynamic(`✅ ¿Confirmas tu cita para el ${userContext.date} (${userContext.diaSemana}) a las ${timeStr}?`);
      
      // Opciones de confirmación
      flowDynamic(
        [
          '💬 Responde con:',
          '',
          '✅ *sí* - Para confirmar la cita',
          '❌ *no* - Para cancelar',
          '🔄 *cambiar* - Para elegir otro horario',
          '',
          '⏰ Tienes 5 minutos para confirmar'
        ]
      );

      // Guardar contexto de confirmación
      this.saveUserContext(clientId, { 
        ...userContext, 
        time: timeStr, 
        appointmentId: appointment.id,
        step: 'confirming' 
      });
    });

    return flow;
  }

  /**
   * Crea flujo para confirmación de citas
   * @returns {Object} Flujo creado
   */
  createConfirmationFlow() {
    const flow = addKeyword(['sí', 'si', 'confirmo', 'confirmar', 'ok', 'vale']);
    
    flow.addAnswer((ctx, { flowDynamic }) => {
      const clientId = ctx.from;
      const userContext = this.getUserContext(clientId);
      
      if (!userContext || !userContext.appointmentId) {
        flowDynamic('Disculpa, no hay cita pendiente de confirmación. Escribe "cita" para agendar una nueva.');
        return;
      }

      // Confirmar cita
      const result = this.appointmentManager.confirmAppointment(userContext.appointmentId);
      
      if (result.success) {
        flowDynamic(result.message);
        flowDynamic(
          [
            '📋 *Resumen de tu cita:*',
            '',
            `📅 Fecha: ${userContext.date} (${userContext.diaSemana})`,
            `🕐 Hora: ${userContext.time}`,
            `🆔 ID: ${userContext.appointmentId}`,
            '',
            '💡 *Recordatorios:*',
            '• Llega 10 minutos antes',
            '• Duración: 1 hora',
            '• Si necesitas cancelar, escribe "cancelar"',
            '',
            '🎉 ¡Nos vemos pronto!'
          ]
        );
        
        // Limpiar contexto
        this.clearUserContext(clientId);
      } else {
        flowDynamic('Disculpa, hubo un error al confirmar la cita. Por favor, intenta de nuevo.');
      }
    });

    return flow;
  }

  /**
   * Crea flujo para cancelación de citas
   * @returns {Object} Flujo creado
   */
  createCancellationFlow() {
    const flow = addKeyword(['no', 'cancelar', 'cancelo', 'anular']);
    
    flow.addAnswer((ctx, { flowDynamic }) => {
      const clientId = ctx.from;
      const userContext = this.getUserContext(clientId);
      
      if (!userContext || !userContext.appointmentId) {
        flowDynamic('Disculpa, no hay cita pendiente de cancelación.');
        return;
      }

      // Cancelar cita
      const result = this.appointmentManager.cancelAppointment(userContext.appointmentId);
      
      if (result.success) {
        flowDynamic(result.message);
        flowDynamic('💬 ¿Te gustaría agendar para otra fecha? Escribe "cita" para empezar de nuevo.');
        
        // Limpiar contexto
        this.clearUserContext(clientId);
      } else {
        flowDynamic('Disculpa, hubo un error al cancelar la cita. Por favor, intenta de nuevo.');
      }
    });

    return flow;
  }

  /**
   * Crea flujo para cambio de horario
   * @returns {Object} Flujo creado
   */
  createChangeTimeFlow() {
    const flow = addKeyword(['cambiar', 'otro', 'otra hora', 'diferente']);
    
    flow.addAnswer((ctx, { flowDynamic }) => {
      const clientId = ctx.from;
      const userContext = this.getUserContext(clientId);
      
      if (!userContext || !userContext.appointmentId) {
        flowDynamic('Disculpa, no hay cita pendiente de cambio.');
        return;
      }

      // Cancelar cita actual
      this.appointmentManager.cancelAppointment(userContext.appointmentId);
      
      flowDynamic('🔄 Cita cancelada. Vamos a elegir un nuevo horario.');
      flowDynamic('📅 ¿Para qué fecha te gustaría agendar? (DD/MM)');
      
      // Limpiar contexto pero mantener la fecha si la quiere
      this.saveUserContext(clientId, { date: userContext.date, step: 'selecting_time' });
    });

    return flow;
  }

  /**
   * Guarda contexto del usuario en memoria
   * @param {string} clientId - ID del cliente
   * @param {Object} context - Contexto a guardar
   */
  saveUserContext(clientId, context) {
    if (!this.userContexts) {
      this.userContexts = new Map();
    }
    this.userContexts.set(clientId, context);
  }

  /**
   * Obtiene contexto del usuario
   * @param {string} clientId - ID del cliente
   * @returns {Object} Contexto del usuario
   */
  getUserContext(clientId) {
    if (!this.userContexts) {
      return null;
    }
    return this.userContexts.get(clientId);
  }

  /**
   * Limpia contexto del usuario
   * @param {string} clientId - ID del cliente
   */
  clearUserContext(clientId) {
    if (this.userContexts) {
      this.userContexts.delete(clientId);
    }
  }

  /**
   * Obtiene todos los flujos creados
   * @returns {Array} Array de flujos
   */
  getFlows() {
    return this.flows;
  }

  /**
   * Obtiene estadísticas de citas
   * @returns {Object} Estadísticas
   */
  getStats() {
    return this.appointmentManager.getStats();
  }
}

module.exports = AppointmentFlow;
