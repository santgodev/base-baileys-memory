/**
 * Utilidad para manejar citas y horarios
 */

const appointmentsConfig = require('../config/appointments');
const fechasCitas = require('../config/fechas-citas.json');

class AppointmentManager {
  constructor() {
    this.config = appointmentsConfig;
    this.pendingAppointments = new Map(); // Citas pendientes de confirmación
  }

  /**
   * Verifica si una fecha es válida
   * @param {string} dateStr - Fecha en formato DD/MM/YYYY
   * @returns {boolean} True si la fecha es válida
   */
  isValidDate(dateStr) {
    const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    if (!regex.test(dateStr)) return false;

    const [, day, month, year] = dateStr.match(regex);
    const date = new Date(year, month - 1, day);
    
    // Verificar que la fecha sea válida y no sea pasada
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return date >= today && 
           date.getDate() == parseInt(day) && 
           date.getMonth() == parseInt(month) - 1 && 
           date.getFullYear() == parseInt(year);
  }

  /**
   * Verifica si una hora es válida
   * @param {string} timeStr - Hora en formato HH:MM
   * @returns {boolean} True si la hora es válida
   */
  isValidTime(timeStr) {
    const regex = /^(\d{1,2}):(\d{2})$/;
    if (!regex.test(timeStr)) return false;

    const [, hours, minutes] = timeStr.match(regex);
    const hour = parseInt(hours);
    const minute = parseInt(minutes);

    return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
  }

  /**
   * Verifica si una hora está dentro del horario de atención
   * @param {string} timeStr - Hora en formato HH:MM
   * @returns {boolean} True si está dentro del horario
   */
  isWithinBusinessHours(timeStr) {
    const time = this.parseTime(timeStr);
    const start = this.parseTime(this.config.businessHours.start);
    const end = this.parseTime(this.config.businessHours.end);

    return time >= start && time < end;
  }

  /**
   * Convierte string de hora a minutos desde medianoche
   * @param {string} timeStr - Hora en formato HH:MM
   * @returns {number} Minutos desde medianoche
   */
  parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Convierte minutos desde medianoche a string de hora
   * @param {number} minutes - Minutos desde medianoche
   * @returns {string} Hora en formato HH:MM
   */
  formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  /**
   * Convierte fecha DD/MM/YYYY a formato ISO
   * @param {string} dateStr - Fecha en formato DD/MM/YYYY
   * @returns {string} Fecha en formato ISO
   */
  parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  /**
   * Convierte fecha ISO a formato DD/MM/YYYY
   * @param {string} isoDate - Fecha en formato ISO
   * @returns {string} Fecha en formato DD/MM/YYYY
   */
  formatDate(isoDate) {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Verifica si una fecha es día no laborable
   * @param {string} dateStr - Fecha en formato DD/MM/YYYY
   * @returns {boolean} True si es día no laborable
   */
  isNonWorkingDay(dateStr) {
    const isoDate = this.parseDate(dateStr);
    const dayOfWeek = new Date(isoDate).getDay();
    
    // Domingo = 0, Sábado = 6
    if (dayOfWeek === 0) return true;
    
    // Verificar si es día festivo
    return this.config.nonWorkingDays.includes(isoDate);
  }

  /**
   * Obtiene horarios disponibles para una fecha específica
   * @param {string} dateStr - Fecha en formato DD/MM/YYYY
   * @returns {Array} Array de horarios disponibles
   */
  getAvailableSlots(dateStr) {
    if (this.isNonWorkingDay(dateStr)) {
      return [];
    }

    const isoDate = this.parseDate(dateStr);
    const occupiedSlots = this.getOccupiedSlotsForDate(isoDate);
    
    const availableSlots = [];
    const startMinutes = this.parseTime(this.config.businessHours.start);
    const endMinutes = this.parseTime(this.config.businessHours.end);
    const slotDuration = this.config.businessHours.timeSlot;

    // Generar todos los slots disponibles
    for (let time = startMinutes; time < endMinutes; time += slotDuration) {
      const timeStr = this.formatTime(time);
      
      // Verificar si no está ocupado
      const isOccupied = occupiedSlots.some(slot => 
        slot.start === timeStr
      );

      if (!isOccupied) {
        availableSlots.push({
          start: timeStr,
          end: this.formatTime(time + slotDuration),
          available: true
        });
      }
    }

    return availableSlots;
  }

  /**
   * Obtiene slots ocupados para una fecha específica
   * @param {string} isoDate - Fecha en formato ISO
   * @returns {Array} Array de slots ocupados
   */
  getOccupiedSlotsForDate(isoDate) {
    const dateData = this.config.occupiedSlots.find(item => item.date === isoDate);
    return dateData ? dateData.slots : [];
  }

  /**
   * Verifica si un horario específico está disponible
   * @param {string} dateStr - Fecha en formato DD/MM/YYYY
   * @param {string} timeStr - Hora en formato HH:MM
   * @returns {Object} Resultado de la verificación
   */
  checkAvailability(dateStr, timeStr) {
    // Validaciones básicas
    if (!this.isValidDate(dateStr)) {
      return { available: false, reason: 'invalid_date' };
    }

    if (!this.isValidTime(timeStr)) {
      return { available: false, reason: 'invalid_time' };
    }

    if (this.isNonWorkingDay(dateStr)) {
      return { available: false, reason: 'non_working_day' };
    }

    if (!this.isWithinBusinessHours(timeStr)) {
      return { available: false, reason: 'outside_business_hours' };
    }

    // Verificar si está ocupado
    const isoDate = this.parseDate(dateStr);
    const occupiedSlots = this.getOccupiedSlotsForDate(isoDate);
    
    const isOccupied = occupiedSlots.some(slot => 
      slot.start === timeStr
    );

    if (isOccupied) {
      return { available: false, reason: 'already_booked' };
    }

    return { available: true, reason: 'available' };
  }

  /**
   * Crea una cita pendiente de confirmación
   * @param {string} dateStr - Fecha en formato DD/MM/YYYY
   * @param {string} timeStr - Hora en formato HH:MM
   * @param {string} clientId - ID del cliente
   * @returns {Object} Cita creada
   */
  createPendingAppointment(dateStr, timeStr, clientId) {
    const appointment = {
      id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: dateStr,
      time: timeStr,
      isoDate: this.parseDate(dateStr),
      clientId: clientId,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.config.confirmation.timeout)
    };

    this.pendingAppointments.set(appointment.id, appointment);
    
    // Programar expiración
    setTimeout(() => {
      this.expireAppointment(appointment.id);
    }, this.config.confirmation.timeout);

    return appointment;
  }

  /**
   * Confirma una cita pendiente
   * @param {string} appointmentId - ID de la cita
   * @returns {Object} Resultado de la confirmación
   */
  confirmAppointment(appointmentId) {
    const appointment = this.pendingAppointments.get(appointmentId);
    
    if (!appointment) {
      return { success: false, reason: 'appointment_not_found' };
    }

    if (appointment.status !== 'pending') {
      return { success: false, reason: 'appointment_already_processed' };
    }

    // Marcar como confirmada
    appointment.status = 'confirmed';
    appointment.confirmedAt = new Date();
    
    // Aquí podrías guardar en base de datos
    this.pendingAppointments.delete(appointmentId);

    return { 
      success: true, 
      appointment: appointment,
      message: this.config.messages.appointmentConfirmed
        .replace('{date}', appointment.date)
        .replace('{time}', appointment.time)
    };
  }

  /**
   * Cancela una cita pendiente
   * @param {string} appointmentId - ID de la cita
   * @returns {Object} Resultado de la cancelación
   */
  cancelAppointment(appointmentId) {
    const appointment = this.pendingAppointments.get(appointmentId);
    
    if (!appointment) {
      return { success: false, reason: 'appointment_not_found' };
    }

    this.pendingAppointments.delete(appointmentId);

    return { 
      success: true, 
      message: this.config.messages.appointmentCancelled
    };
  }

  /**
   * Expira una cita por timeout
   * @param {string} appointmentId - ID de la cita
   */
  expireAppointment(appointmentId) {
    const appointment = this.pendingAppointments.get(appointmentId);
    if (appointment && appointment.status === 'pending') {
      appointment.status = 'expired';
      this.pendingAppointments.delete(appointmentId);
    }
  }

  /**
   * Obtiene todas las citas pendientes de un cliente
   * @param {string} clientId - ID del cliente
   * @returns {Array} Array de citas pendientes
   */
  getPendingAppointments(clientId) {
    return Array.from(this.pendingAppointments.values())
      .filter(app => app.clientId === clientId && app.status === 'pending');
  }

  /**
   * Consulta disponibilidad de una fecha específica desde el JSON
   * @param {string} dateStr - Fecha en formato DD/MM
   * @returns {Object} Información de disponibilidad
   */
  consultarDisponibilidadFecha(dateStr) {
    // Buscar la fecha en el JSON
    const fechaData = fechasCitas.fechas_disponibles.find(
      item => item.fecha === dateStr
    );

    if (!fechaData) {
      return {
        disponible: false,
        mensaje: 'Disculpa, esa fecha no está disponible para agendar citas.',
        horarios: [],
        citasOcupadas: []
      };
    }

    return {
      disponible: true,
      mensaje: `¡Perfecto! El ${dateStr} (${fechaData.dia_semana}) está disponible.`,
      horarios: fechaData.horarios_disponibles,
      citasOcupadas: fechaData.citas_ocupadas,
      diaSemana: fechaData.dia_semana
    };
  }

  /**
   * Obtiene estadísticas de citas
   * @returns {Object} Estadísticas
   */
  getStats() {
    const totalPending = this.pendingAppointments.size;
    const totalOccupied = this.config.occupiedSlots.reduce((total, date) => 
      total + date.slots.length, 0
    );

    return {
      pending: totalPending,
      occupied: totalOccupied,
      businessHours: this.config.businessHours,
      workingDays: 6, // Lunes a Sábado
      nonWorkingDays: this.config.nonWorkingDays.length
    };
  }
}

module.exports = AppointmentManager;
