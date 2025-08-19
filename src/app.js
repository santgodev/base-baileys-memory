/**
 * Aplicación principal del bot colombiano
 * Integra todos los flujos y funcionalidades
 */

const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');

const { AppointmentFlow } = require('./flows');

const main = async () => {
  try {
    console.log('📅 Iniciando Bot de Citas...');
    
    // Crear instancia del flujo de citas
    const appointmentFlow = new AppointmentFlow();
    
    // Combinar todos los flujos
    const flows = [
      ...appointmentFlow.getFlows(),
      // Flujos dinámicos de citas
      appointmentFlow.createDateProcessingFlow(),
      appointmentFlow.createTimeProcessingFlow(),
      appointmentFlow.createConfirmationFlow(),
      appointmentFlow.createCancellationFlow(),
      appointmentFlow.createChangeTimeFlow()
    ];
    
    console.log(`✅ Flujos creados: ${flows.length}`);
    
    // Configurar adaptadores
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow(flows);
    const adapterProvider = createProvider(BaileysProvider);
    
    // Crear el bot
    const bot = createBot({
      flow: adapterFlow,
      provider: adapterProvider,
      database: adapterDB,
    });
    
    console.log('🤖 Bot creado exitosamente');
    
    // Iniciar portal web
    QRPortalWeb();
    
    console.log('🌐 Portal web iniciado');
    console.log('📅 ¡Bot de Citas listo para usar!');
    
    // Mostrar estadísticas iniciales
    const appointmentStats = appointmentFlow.getStats();
    
    console.log('📅 Estadísticas de citas:');
    console.log(`  Citas pendientes: ${appointmentStats.pending}`);
    console.log(`  Horarios ocupados: ${appointmentStats.occupied}`);
    console.log(`  Horario de atención: ${appointmentStats.businessHours.start} - ${appointmentStats.businessHours.end}`);
    
  } catch (error) {
    console.error('❌ Error al iniciar el bot:', error);
    process.exit(1);
  }
};

// Manejar señales de terminación
process.on('SIGINT', () => {
  console.log('\n🛑 Bot detenido por el usuario');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Bot detenido por el sistema');
  process.exit(0);
});

// Iniciar la aplicación
main().catch(console.error);
