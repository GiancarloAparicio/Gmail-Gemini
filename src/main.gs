/**
 * Función principal que obtiene y procesa los correos en la bandeja de entrada de Gmail
 * que no tienen ninguna etiqueta
 */
function main() {
  var maxResults = 30; // Máximo número de correos a obtener en cada lote
  var pauseMillis = 30000; // Tiempo de pausa entre iteraciones (30 segundos)
  var procesados = 0; // Contador de correos procesados

  // Bucle para obtener y procesar correos
  while (true) {
    try {
      // Obtener un lote de correos sin etiquetas y recientes
      var correos = obtenerCorreosSinEtiquetasRecientes(maxResults);

      // Si no hay más correos, terminar el bucle
      if (correos.length === 0) {
        Logger.log("No hay correos sin etiquetas recientes.");
        break;
      } 

      Logger.log("Procesando correos sin etiquetas. " );

    
      // Iterar sobre cada correo obtenido
      correos.forEach(function(correo) {
        // Iterar sobre cada mensaje en el hilo
        correo.getMessages().forEach(function(mensaje) {
          procesados++;
          categorizarCorreoGemini(mensaje);
          
        });
      });

      // Pausar para evitar superar el límite de llamadas a la API
      Utilities.sleep(pauseMillis);
    } catch (e) {
      // Registrar el error en los registros de Apps Script
      Logger.log("En estos momentos no se puede obtener los correos: " + e.message);
      Logger.log(JSON.stringify(e))
      break;
    }
  }

  Logger.log("Total de correos procesados: " + procesados);
}


function test(){
  setFiltaEnSheet("Gmail-gemini", "data",[1,2,3,4,5,6])
}
