/**
 * Consulta la API de Gemini para generar contenido basado en el texto proporcionado.
 * 
 * @param {string} prompt - El texto que se desea enviar a la API de Gemini para obtener un contenido generado.
 * @returns {string} - El contenido generado por la API de Gemini o un mensaje de error si la solicitud falla.
 */
function consultGemini(prompt) {
  // La clave API debe ser almacenada de forma segura, por ejemplo, en un archivo de propiedades
  var apiKey = "<KEY>"; 
  var url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro-latest:generateContent?key=${apiKey}`;

  // Crear el objeto de carga útil (payload) para la solicitud
  var payload = {
    "contents": [
      {
        "parts": [
          { "text": limpiarStringParaJSON(prompt) }
        ]
      }
    ]
  };

  // Configurar las opciones de la solicitud HTTP
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    'muteHttpExceptions': true // Permite ver los errores detallados
  };

  try {
    // Hacer la solicitud HTTP a la API de Gemini
    var response = UrlFetchApp.fetch(url, options);

    // Verificar si la respuesta es exitosa (código de estado 200)
    if (response.getResponseCode() === 200) {
      // Parsear la respuesta JSON
      var responseData = JSON.parse(response.getContentText());

      // Retornar el texto generado de la respuesta
      if (responseData['candidates'] && responseData['candidates'].length > 0) {
        response = responseData['candidates'][0]['content']['parts'][0]['text'];

        return cleanString(response)

      } else {
        throw new Error("Error respuesta 200, no se encontro responseData");
      }
    } else {
      Logger.log("Error la solicituda completa fallo: " + response.getResponseCode());
      throw new Error("Error");
    }
  } catch (e) {
    // Registrar el error en los registros de Apps Script
    Logger.log("Error al generar el contenido: " + e.message);
    
    return "Error";
  }
}


/**
 * Limpia una cadena para que pueda ser utilizada de forma segura en un JSON.
 * 
 * @param {string} str - La cadena que se va a limpiar.
 * @return {string} - La cadena limpiada y segura para JSON.
 */
function limpiarStringParaJSON(str) {
  return str
    .replace(/\\/g, '\\\\') // Escapa las barras invertidas
    .replace(/"/g, '\\"')   // Escapa las comillas dobles
    .replace(/\n/g, '\\n')  // Reemplaza los saltos de línea con su representación de escape
    .replace(/\r/g, '\\r')  // Reemplaza los retornos de carro con su representación de escape
    .replace(/\t/g, '\\t')  // Reemplaza las tabulaciones con su representación de escape
    .replace(/\f/g, '\\f'); // Reemplaza los saltos de página con su representación de escape
}

/**
 * Limpia una cadena para que pueda ser utilizada de forma segura en un JSON.
 * 
 * @param {string} str - La cadena que se va a limpiar.
 * @return {string} - La cadena limpiada y segura para JSON.
 */
function cleanString(str) {
  return str
    .replace('\"', '')
    .replace('"', '')
    .replace("\'", '')
    .replace("'", '')
}





