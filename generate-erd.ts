import { ERDBuilder } from 'typeorm-erd';
import dataSource from './data-source';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

async function generateERD() {
    const erd = new ERDBuilder('mermaid', dataSource);
    await erd.initialize();

    let mermaidCode = erd.render();

    // Fix erDiagram spacing
    mermaidCode = mermaidCode.replace(/^erDiagram\s*/, 'erDiagram\n\n');

    // Define names that should NEVER be quoted
    const unquotedNames = new Set([
        'id',
        'user_id',
        'role_id',
        'purchase_id',
        'authorId',
    ]);

    // Regex to quote field names if type has extra keywords and name is not "id"-like
    mermaidCode = mermaidCode.replace(
        /^ (\s*)([a-zA-Z ]+?)\s+([a-zA-Z_][\w]*)(\s+(?:PK|FK))?$/gm,
        (_match, indent, type, name, modifier = '') => {
            const typeHasExtraKeyword = type.trim().includes(' ');
            const shouldQuote = typeHasExtraKeyword && !unquotedNames.has(name);
            return `${indent}${type} ${shouldQuote ? `"${name}"` : name}${modifier}`;
        }
    );

    // Entity block and spacing cleanup
    mermaidCode = mermaidCode
        .replace(/}\s*(?=\w)/g, '}\n\n') // separate entities
        .replace(/}\s*(\w+\s+\|\|--)/g, '}\n\n$1') // before relations
        .replace(/ +/g, ' ') // normalize spaces
        .replace(/\n{3,}/g, '\n\n'); // avoid too many line breaks

    const outputDir = './diagrams';
    const mermaidFile = join(outputDir, 'erd.mmd');

    mkdirSync(outputDir, { recursive: true });
    writeFileSync(mermaidFile, mermaidCode);
    console.log(`Mermaid ER-diagram saved to: ${mermaidFile}`);
}

generateERD();
