function markdownToHTML(markdown) {
    // Transformar encabezados (H1 a H6)
    markdown = markdown.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
    markdown = markdown.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    markdown = markdown.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    markdown = markdown.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    markdown = markdown.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    markdown = markdown.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Transformar negritas y cursivas
    markdown = markdown.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');  // Negritas
    markdown = markdown.replace(/\*(.*)\*/gim, '<em>$1</em>');             // Cursivas

    // Transformar listas no ordenadas
    markdown = markdown.replace(/^\s*\n\* (.*)/gim, '<ul>\n<li>$1</li>\n</ul>');
    markdown = markdown.replace(/^\* (.*)/gim, '<li>$1</li>');

    // Transformar listas ordenadas
    markdown = markdown.replace(/^\s*\n[0-9]+\.\s(.*)/gim, '<ol>\n<li>$1</li>\n</ol>');
    markdown = markdown.replace(/^[0-9]+\.\s(.*)/gim, '<li>$1</li>');

    // Transformar enlaces
    markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');

    // Transformar saltos de línea dobles en párrafos
    markdown = markdown.replace(/\n$/gim, '<br />');

    // Retornar el HTML transformado
    return markdown.trim();
}


function htmlToMarkdown(html) {
    // Convertir HTML a Markdown
    function convertHtmlToMarkdown(html) {
        // Eliminar contenido desde <style> hasta el final del HTML si no hay </style>
        if (html.includes('<style') && !html.includes('</style>')) {
            html = html.split('<style')[0];
        } else {
            // Eliminar etiquetas <style> y <script> con su contenido
            html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
            html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        }

        // Reemplazar encabezados
        html = html.replace(/<h1[^>]*>((?:.|\n)*)<\/h1>/g, function(match, p1) {
            return '# ' + p1.trim() + '\n';
        });
        html = html.replace(/<h2[^>]*>((?:.|\n)*)<\/h2>/g, function(match, p1) {
            return '## ' + p1.trim() + '\n';
        });
        html = html.replace(/<h3[^>]*>((?:.|\n)*)<\/h3>/g, function(match, p1) {
            return '### ' + p1.trim() + '\n';
        });

        // Reemplazar párrafos
        html = html.replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (match, p1) => p1.trim() + '\n\n');

        // Reemplazar listas desordenadas
        html = html.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (match, p1) =>
          p1.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (match, p1) => '- ' + p1.trim() + '\n') + '\n'
        );

        // Reemplazar listas ordenadas
        html = html.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, (match, p1) => {
            let index = 1;
            return p1.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (match, p1) => `${index++}. ${p1.trim()}\n`) + '\n';
        });

        // Reemplazar enlaces
        html = html.replace(/<a\s+href="([\s\S]*?)"[^>]*>([\s\S]*?)<\/a>/g, (match, href, text) => `[${text.trim()}](${href.trim()})`);

        // Reemplazar imágenes
        html = html.replace(/<img\s+src="([\s\S]*?)"[^>]*alt="([\s\S]*?)"[^>]*\/>/g, (match, src, alt) => `![${alt.trim()}](${src.trim()})`);

        // Reemplazar negritas y cursivas
        html = html.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/g, (match, p1) => `**${p1.trim()}**`);
        html = html.replace(/<em[^>]*>([\s\S]*?)<\/em>/g, (match, p1) => `*${p1.trim()}*`);

        // Reemplazar saltos de línea
        html = html.replace(/<br\s*\/?>/g, '  \n');

        // Limpiar etiquetas restantes
        html = html.replace(/<\/?[^>]+>/g, '');

        // Limpiar líneas vacías y dobles saltos de línea
        html = html.replace(/\n\s*\n\s*/g, '\n\n');

        return html.trim();
    }

    // Convertir HTML a Markdown
    return convertHtmlToMarkdown(html);
}
