"""Read-only statistics for one Unsloth Knowledge Base. Python 3.10+.
Usage: python inspect_rag_chunks.py --kb "Experiment 350-50"
Optional: --db /actual/path/rag.db
Does not modify the index or print document text.
"""
import argparse
import sqlite3
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--kb', required=True, help='Exact Knowledge Base name')
parser.add_argument('--db', type=Path, default=Path.home()/'.unsloth/studio/rag/rag.db')
args = parser.parse_args()
try:
    db = sqlite3.connect(args.db.resolve().as_uri()+'?mode=ro', uri=True)
    bases = db.execute('SELECT id FROM knowledge_bases WHERE name = ?', (args.kb,)).fetchall()
    if len(bases) != 1:
        raise ValueError('Expected exactly one KB with this name; choose a unique name.')
    scope = 'kb_'+bases[0][0]
    rows = db.execute('''SELECT d.filename, d.status, d.embedding_model,
        COUNT(c.id), MIN(c.token_count), MAX(c.token_count),
        ROUND(AVG(c.token_count), 1)
        FROM documents d LEFT JOIN chunks c ON c.document_id=d.id
        WHERE d.scope=? GROUP BY d.id ORDER BY d.filename''', (scope,)).fetchall()
    if not rows:
        print('No documents in this KB.')
    for name, status, model, count, minimum, maximum, average in rows:
        print(f'{name}: status={status}; chunks={count}; tokens min/max/avg={minimum}/{maximum}/{average}')
        print(f'  embedding identity: {model}')
    db.close()
except (sqlite3.Error, ValueError) as exc:
    parser.exit(1, f'Cannot inspect KB: {exc}\nCheck KB name, database path, schema and indexing status.\n')
