/**
 * Configuración de horarios para citas
 * Simula horarios ocupados y disponibles
 */

const appointmentsConfig = {
  // Horarios de atención
  businessHours: {
    start: '08:00',
    end: '18:00',
    timeSlot: 60, // Duración de cada cita en minutos
    breakTime: '12:00-13:00' // Hora de almuerzo
  },

  // Horarios ya ocupados (simulados)
  occupiedSlots: [
    // Lunes
    {
      date: '2025-01-20',
      slots: [
        { start: '09:00', end: '10:00', client: 'María González' },
        { start: '11:00', end: '12:00', client: 'Carlos Ruiz' },
        { start: '14:00', end: '15:00', client: 'Ana Martínez' },
        { start: '16:00', end: '17:00', client: 'Luis Pérez' }
      ]
    },
    // Martes
    {
      date: '2025-01-21',
      slots: [
        { start: '08:00', end: '09:00', client: 'Sofía López' },
        { start: '10:00', end: '11:00', client: 'Diego Silva' },
        { start: '13:00', end: '14:00', client: 'Carmen Vega' },
        { start: '15:00', end: '16:00', client: 'Roberto Torres' },
        { start: '17:00', end: '18:00', client: 'Patricia Jiménez' }
      ]
    },
    // Miércoles
    {
      date: '2025-01-22',
      slots: [
        { start: '09:00', end: '10:00', client: 'Fernando Castro' },
        { start: '11:00', end: '12:00', client: 'Isabel Morales' },
        { start: '14:00', end: '15:00', client: 'Ricardo Herrera' },
        { start: '16:00', end: '17:00', client: 'Elena Rojas' }
      ]
    },
    // Jueves
    {
      date: '2025-01-23',
      slots: [
        { start: '08:00', end: '09:00', client: 'Miguel Ángel' },
        { start: '10:00', end: '11:00', client: 'Lucía Mendoza' },
        { start: '13:00', end: '14:00', client: 'Jorge Valdez' },
        { start: '15:00', end: '16:00', client: 'Rosa Flores' },
        { start: '17:00', end: '18:00', client: 'Alberto Sánchez' }
      ]
    },
    // Viernes
    {
      date: '2025-01-24',
      slots: [
        { start: '09:00', end: '10:00', client: 'Verónica Cruz' },
        { start: '11:00', end: '12:00', client: 'Héctor Mendoza' },
        { start: '14:00', end: '15:00', client: 'Diana Ramírez' },
        { start: '16:00', end: '17:00', client: 'Francisco Luna' }
      ]
    },
    // Sábado (medio día)
    {
      date: '2025-01-25',
      slots: [
        { start: '08:00', end: '09:00', client: 'Gabriela Ortiz' },
        { start: '09:00', end: '10:00', client: 'Manuel Vargas' },
        { start: '10:00', end: '11:00', client: 'Adriana Paredes' },
        { start: '11:00', end: '12:00', client: 'Eduardo Moreno' }
      ]
    }
  ],

  // Días no laborables
  nonWorkingDays: [
    '2025-01-19', // Domingo
    '2025-01-26', // Domingo
    '2025-01-27', // Lunes (día festivo)
    '2025-01-28'  // Martes (día festivo)
  ],

  // Configuración de confirmación
  confirmation: {
    required: true,
    timeout: 300000, // 5 minutos para confirmar
    reminderMessage: '⏰ Recuerda confirmar tu cita en los próximos 5 minutos'
  },

  // Mensajes del bot
  messages: {
    welcome: '📅 ¡Hola! Te ayudo a agendar tu cita',
    selectDate: '📅 ¿Para qué fecha te gustaría agendar? (DD/MM)',
    selectTime: '🕐 ¿A qué hora prefieres? (HH:MM)',
    confirmAppointment: '✅ ¿Confirmas tu cita para el {date} a las {time}?',
    appointmentConfirmed: '🎉 ¡Cita confirmada! Te espero el {date} a las {time}',
    appointmentCancelled: '❌ Cita cancelada. ¿Te gustaría agendar para otra fecha?',
    noAvailability: 'Disculpa, no hay horarios disponibles para esa fecha/hora',
    showAvailableSlots: '🕐 Horarios disponibles para el {date}:',
    invalidDate: 'Disculpa, esa fecha no es válida. Dijita la fecha así: 20/01',
    invalidTime: 'Disculpa, esa hora no es válida. Dijita la hora así: 14:30',
    outsideHours: 'Disculpa, ese horario está fuera del horario de atención (8:00 AM - 6:00 PM)',
    alreadyBooked: 'Disculpa, ese horario ya está ocupado. ¿Te gustaría elegir otro?'
  }
};

module.exports = appointmentsConfig;
