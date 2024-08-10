/**
 * Función que obtiene los correos en la bandeja de entrada de Gmail que no tienen etiquetas
 * y que tienen un máximo de 1 año de antigüedad.
 * 
 * @param {number} maxResults - Número máximo de correos a obtener.
 * @return {GmailMessage[]} - Lista de correos sin etiquetas y con un máximo de 1 año de antigüedad.
 */

function obtenerCorreosSinEtiquetasRecientes(maxResults) {
  // Obtener la fecha de hace 3 meses en formato 'YYYY/MM/DD'
  var fechaLimite = new Date();
  fechaLimite.setMonth(fechaLimite.getMonth() - 3);  // Restar 3 meses a la fecha actual
  // fechaLimite.setFullYear(fechaLimite.getFullYear() - 1);

  var fechaFormato = Utilities.formatDate(fechaLimite, Session.getScriptTimeZone(), 'yyyy/MM/dd');

  // Consulta de búsqueda para obtener correos sin etiquetas y recientes
  var query = 'label:inbox -has:userlabels after:' + fechaFormato;

  // Obtener los correos que coinciden con la consulta
  var correos = GmailApp.search(query, 0, maxResults);

  // Devolver la lista de correos encontrados
  return correos;
}


/**
 * Obtiene los correos de Gmail que tienen una etiqueta específica.
 * 
 * @param {string} etiqueta - La etiqueta de Gmail para buscar los correos.
 * @returns {Array} - Una lista de objetos con información sobre los correos que coinciden con la etiqueta.
 */
function obtenerCorreosPorEtiqueta(etiqueta) {
  // Buscar hilos de correo que tengan la etiqueta especificada
  var threads = GmailApp.search("label:" + etiqueta);
  var mensajes = [];

  // Iterar sobre cada hilo de correo encontrado
  threads.forEach(function(thread) {
    // Obtener los mensajes de cada hilo
    var mensajesDelHilo = thread.getMessages();
    
    // Iterar sobre cada mensaje en el hilo
    mensajesDelHilo.forEach(function(mensaje) {
      // Registrar el asunto del mensaje para fines de depuración
      Logger.log("Asunto: " + mensaje.getSubject());

      // Agregar información relevante del mensaje a la lista de resultados
      mensajes.push({
        asunto: mensaje.getSubject(),
        remitente: mensaje.getFrom(),
        fecha: mensaje.getDate()
      });
    });
  });

  // Retornar la lista de mensajes con la información recolectada
  return mensajes;
}

/**
 * Obtiene un resumen de un correo dado su asunto y cuerpo.
 *
 * @param {string} asunto - El asunto del correo.
 * @param {string} cuerpo - El cuerpo del correo.
 * @return {string} El resumen generado del correo.
 */
function obtenerResumenCorreo(asunto, cuerpo) {
  // Validar que los parámetros sean cadenas de texto no vacías
  if (typeof asunto !== 'string' || typeof cuerpo !== 'string' || asunto.trim() === '' || cuerpo.trim() === '') {
    throw new Error('Asunto y cuerpo deben ser cadenas de texto no vacías.');
  }

  // Crear el prompt con los datos del correo
  var prompt = `Dame un resumen para el siguiente correo. Asunto: ${asunto}. Cuerpo: ${cuerpo}`;
  
  // Asumimos que consultGemini es una función externa que procesa el prompt y devuelve un resumen
  return consultGemini(prompt);
}

/**
 * Mueve un correo a una categoría (etiqueta) específica en Gmail.
 *
 * @param {GmailMessage} correo - El correo que se va a mover.
 * @param {string} categoria - El nombre de la categoría (etiqueta) a la cual mover el correo.
 */
function moverCategoria(correo, categoria) {
  // Verificar si el parámetro 'categoria' es un string no vacío
  if (typeof categoria !== 'string' || categoria.trim() === '') {
    Logger.log('La categoría proporcionada no es válida.');
    return;
  }

  try {
    // Obtén el hilo del mensaje
    var hilo = correo.getThread();

    // Obtén la etiqueta deseada, o créala si no existe
    var etiqueta = GmailApp.getUserLabelByName(categoria);
    if (!etiqueta) {
      etiqueta = GmailApp.createLabel(categoria);
    }

    // Añade la etiqueta al hilo del mensaje
    hilo.addLabel(etiqueta);

    // Registro de la acción realizada
    Logger.log(`Mover correo "${correo.getSubject()}" a la categoría "${categoria}"`);
  } catch (e) {
    // Manejo de errores
    Logger.log('Error al procesar el correo o la etiqueta: ' + e.message);
  }
}


/**
 * Función que categoriza y procesa un correo específico.
 * 
 * @param {GmailMessage} mensaje - El mensaje de correo a procesar.
 */
function categorizarCorreoGemini(mensaje) {
  // Obtener información del mensaje
  var asunto = mensaje.getSubject(); // Obtener el asunto del correo
  var remitente = mensaje.getFrom(); // Obtener el remitente del correo
  var cuerpo = mensaje.getBody(); // Obtener el cuerpo del correo
  var fechaHora = mensaje.getDate(); // Obtener la fecha y hora del correo
  var id = mensaje.getId();

  cuerpo = htmlToMarkdown(cuerpo)

  // Obtener la categoría del correo
  var categoria = obtenerCategoria(asunto, remitente);

  if (categoria !== "Error"){
    // Obtener un resumen del correo (opcional, si se requiere)
    var resumen = obtenerResumenCorreo(asunto, cuerpo);

    // Mover el correo a la categoría obtenida
    moverCategoria(mensaje, categoria);

    Logger.log(`Procesando: ${asunto}`);
    // Guarda los datos de los correos en un spreadsheet y hoja específica
    setFilaEnSheet("Gmail-gemini", "data", [String(id), String(asunto), String(remitente), String(categoria), String(fechaHora), String(resumen), String(cuerpo)]);
  }

}


/**
 * Obtiene la categoría de un correo dado su asunto y remitente.
 *
 * @param {string} asunto - El asunto del correo.
 * @param {string} remitente - El remitente del correo.
 * @return {string} La categoría asignada al correo.
 */
function obtenerCategoria(asunto, remitente) {
  // Crear el prompt con los datos del correo y las categorías
  var prompt = `
    Based on these categories, only one of these categories is returned: 
    "Study": Emails from GitHub, GitLab, UNAC, university, certifications, courses, bootcamps 
    "Banks": Bank emails, except promotions, which go in "Promotions"
    "Promotions": Emails with benefits, coupons or time-based promotions, invitations and event notifications 
    "Newsletter": News sources in English or Spanish 
    "Invoices": Bills from banks, cards, electricity, water, services, Yapeos, Plin, transactions
    "Advertising": Promotions or purchase incentives 
    "HelpDesk": Access codes, logins, etc. Correspondence with technical support or customer service 
    "Jobs": Employment opportunities and work communications 
    "Other": Other uncategorized emails 
    
    What category does the following email fit into?
    Subject: ${asunto}
    Sender: ${remitente}
  `;

  var categoria = consultGemini(prompt);

  Logger.log(`Obteniendo categoria: ${categoria}`);
  
  // Asumimos que consultGemini es una función que procesa el prompt y devuelve la categoría
  return categoria;
}
