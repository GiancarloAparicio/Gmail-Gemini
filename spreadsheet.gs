/**
 * Obtiene un archivo de hoja de cálculo con un nombre específico. Si el archivo no existe, se crea uno nuevo.
 * 
 * @param {string} archivo - El nombre del archivo de hoja de cálculo que se desea obtener o crear.
 * @returns {Spreadsheet} - El objeto de la hoja de cálculo (Spreadsheet).
 */
function getArchivoSheet(archivo) {
  // Busca todos los archivos con el nombre proporcionado
  var archivos = DriveApp.getFilesByName(archivo);
  
  // Si existe al menos un archivo con ese nombre, lo abre
  if (archivos.hasNext()) {
    return SpreadsheetApp.open(archivos.next());
  } else {
    // Si no existe, crea una nueva hoja de cálculo con ese nombre
    return SpreadsheetApp.create(archivo);
  }
}

/**
 * Obtiene una hoja específica dentro de una hoja de cálculo. Si la hoja no existe, la crea.
 * 
 * @param {string} archivo - El nombre del archivo de hoja de cálculo donde se encuentra la hoja.
 * @param {string} nombreHoja - El nombre de la hoja que se desea obtener o crear.
 * @returns {Sheet} - El objeto de la hoja (Sheet).
 */
function getHojaSheet(archivo, nombreHoja) {
  // Obtiene el archivo de hoja de cálculo
  var spreadsheet = getArchivoSheet(archivo);
  
  // Intenta obtener la hoja especificada por nombre
  var hoja = spreadsheet.getSheetByName(nombreHoja);
  
  // Si la hoja no existe
  if (!hoja) {
    // Verifica si hay una hoja por defecto y es la única hoja
    var hojas = spreadsheet.getSheets();
    if (hojas.length === 1 && ( hojas[0].getName() === 'Hoja 1' || hojas[0].getName() === 'Sheet 1' ) ) {
      // Renombra la hoja por defecto
      hoja = hojas[0];
      hoja.setName(nombreHoja);
      
    } else {
      // Si no es la hoja por defecto o hay más hojas, crea una nueva hoja
      hoja = spreadsheet.insertSheet(nombreHoja);
    }
  }
  
  return hoja;
}
    

/**
 * Escribe una fila en una hoja específica de una Google Spreadsheet.
 *
 * @param {string} archivo - El nombre del archivo de hoja de cálculo.
 * @param {string} nombreHoja - El nombre de la hoja donde se escribirá la fila.
 * @param {Array} rowData - Los datos de la fila que se escribirán.
 */
function setFilaEnSheet(archivo, nombreHoja, rowData) {
  // Obtiene la hoja específica dentro del archivo
  var hoja = getHojaSheet(archivo, nombreHoja);
  
  // Obtiene el número de la siguiente fila vacía
  var lastRow = hoja.getLastRow();

  // Si el spreadsheet esta vacio agrega los headers
  if (lastRow == 0){
    headers = ["Id","Asunto", "Remitente", "Categoria", "Fecha", "Resumen", "Body"]
    
    // Establecer los encabezados en la primera fila
    hoja.getRange(1, 1, 1, headers.length).setValues([headers]);
    lastRow++;
  }
    
  var nextRow = lastRow + 1;

  var data = limitarLongitudDeStrings(rowData, 5000)
  
  // Escribe los datos en la siguiente fila vacía
  hoja.getRange(nextRow, 1, 1, rowData.length).setValues([data]);
}


/**
 * Función para limitar la longitud de los elementos de un array de strings.
 * 
 * @param {string[]} arrayDeStrings - Array de strings que se desea procesar.
 * @param {number} maxCaracteres - Número máximo de caracteres permitido para cada string.
 * @returns {string[]} - Nuevo array con cada string limitado a `maxCaracteres` caracteres.
 * @throws {Error} - Si los parámetros de entrada no son válidos o si algún elemento del array no es un string.
 */
function limitarLongitudDeStrings(arrayDeStrings, maxCaracteres) {
  // Verificar que el primer parámetro es un array y el segundo es un número
  if (!Array.isArray(arrayDeStrings) || typeof maxCaracteres !== 'number') {
    throw new Error('Parámetros inválidos. Asegúrate de pasar un array y un número.');
  }

  // Procesar cada string del array
  return arrayDeStrings.map(function(string) {
    // Verificar que el elemento es un string
    if (typeof string === 'string') {
      // Si el string excede el máximo de caracteres, truncarlo
      return string.length > maxCaracteres ? string.substring(0, maxCaracteres) : string;
    } else {
      // Lanzar un error si el elemento no es un string
      throw new Error('El array contiene un elemento que no es una cadena de texto.');
    }
  });
}

