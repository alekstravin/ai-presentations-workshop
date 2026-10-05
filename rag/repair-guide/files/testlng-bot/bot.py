"""TestLNG: native Unsloth RAG events, verified LNG profile; no stored chat history."""
import asyncio
import json
import logging
import os
from pathlib import Path
import uuid

import httpx
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters

ROOT = Path(__file__).resolve().parent
PROFILE = ROOT.parent / 'lng-rag-repair-2026-10-05'
BASE = 'http://127.0.0.1:8888'
MODEL = 'unsloth/Qwen3.5-4B-GGUF'
USERNAME = 'TestLNG234421234_bot'
KB = '1b07438c-3c29-41a5-83c9-352f16c69538'
LOCK = asyncio.Lock()
logging.basicConfig(level=logging.WARNING)
# Never log HTTP request URLs, which contain the Telegram credential.
logging.getLogger('httpx').setLevel(logging.CRITICAL)
logging.getLogger('telegram').setLevel(logging.CRITICAL)


async def answer(question, proof_path=None):
    secret = (Path.home() / '.unsloth/studio/auth/.desktop_secret').read_text().strip()
    async with httpx.AsyncClient(base_url=BASE, timeout=600) as client:
        auth = await client.post('/api/auth/desktop-login', json={'secret': secret})
        auth.raise_for_status()
        headers = {'Authorization': 'Bearer ' + auth.json()['access_token'],
                   'X-Unsloth-Events': '1'}
        models = await client.get('/v1/models', headers=headers)
        models.raise_for_status()
        if not any(m['id'] == MODEL and m.get('loaded', False)
                   for m in models.json().get('data', [])):
            raise RuntimeError('verified_model_not_loaded')
        payload = {
            'model': MODEL, 'messages': [
                {'role': 'system', 'content': (PROFILE/'system-prompt.txt').read_text()},
                {'role': 'user', 'content': question}],
            'max_tokens': 768, 'temperature': .2, 'top_p': .9, 'top_k': 20,
            'min_p': 0, 'repetition_penalty': 1.05, 'presence_penalty': 0,
            'seed': 42, 'enable_thinking': False, 'enable_tools': True,
            'enabled_tools': ['search_knowledge_base', 'web_search'], 'max_tool_calls_per_message': 4,
            # Only document search and public web reads are exposed to this bot.
            # Telegram has no Desktop approval dialog; permit these request-scoped reads.
            'confirm_tool_calls': False,
            'rag_scope': {'kb_id': KB, 'mode': 'hybrid', 'autoinject': True,
                          'autoinject_min_score': 0, 'default_top_k': 2,
                          'context_length': 8192},
            'stream': True, 'cancel_id': 'testlng-' + str(uuid.uuid4())}
        text, sources, events = [], [], []
        if proof_path:
            Path(proof_path).write_text(json.dumps({'question': question, 'payload': payload,
                                                   'state': 'running'}, ensure_ascii=False, indent=2))
        async with client.stream('POST', '/api/inference/chat/completions',
                                 headers=headers, json=payload) as resp:
            resp.raise_for_status()
            async for line in resp.aiter_lines():
                if not line.startswith('data:'): continue
                raw = line[5:].strip()
                if raw == '[DONE]': break
                event = json.loads(raw)
                if proof_path:
                    events.append(event)
                    if event.get('type') in ('tool_start', 'tool_end', 'error'):
                        Path(proof_path).write_text(json.dumps(
                            {'question': question, 'payload': payload, 'events': events,
                             'state': 'running'}, ensure_ascii=False, indent=2))
                if event.get('type') == 'error': raise RuntimeError('generation_error')
                if event.get('type') == 'text':
                    text.append(event.get('content', event.get('text', '')))
                if event.get('choices'):
                    text.append(event['choices'][0].get('delta', {}).get('content') or '')
                if event.get('type') == 'tool_end' and '__RAG_SOURCES__:' in event.get('result', ''):
                    sources.extend(json.loads(event['result'].split('__RAG_SOURCES__:', 1)[1]))
        result = ''.join(text).strip()
        if not result: raise RuntimeError('empty_answer')
        refs = []
        for source in sources:
            label = f"[{source['citationId']}] {source['filename']}"
            if source.get('page') is not None: label += f", стр. PDF {source['page']}"
            if label not in refs: refs.append(label)
        if refs: result += '\n\nНайденные источники:\n' + '\n'.join(refs)
        if proof_path:
            Path(proof_path).write_text(json.dumps(
                {'question': question, 'payload': payload, 'answer': result,
                 'sources': sources, 'events': events}, ensure_ascii=False, indent=2))
        return result


async def start(update: Update, context):
    await update.effective_message.reply_text(
        'Задайте вопрос по СПГ. База: GIIGNL 2025/2026, IEA Q3-2026, '
        'НОВАТЭК 2024/2025. Для свежих сведений попросите веб-поиск. '
        'Разделяю источники базы и интернета. '
        'Расчёты и номера страниц в тексте ответа проверяйте по источникам.')


async def handle(update: Update, context):
    message = update.effective_message
    if len(message.text) > 3000:
        await message.reply_text('Сократите вопрос до 3000 символов.'); return
    await message.reply_text('Ищу в базе СПГ и, если нужно, в интернете… Это может занять несколько минут.')
    try:
        async with LOCK: result = await answer(message.text)
    except Exception as exc:
        logging.warning('LNG request failed: %s', type(exc).__name__)
        result = 'Не удалось получить ответ от локального Unsloth. Проверьте, что Mac и профиль СПГ работают, и повторите вопрос.'
    for offset in range(0, len(result), 3500):
        await message.reply_text(result[offset:offset+3500])


async def verify_identity(app):
    me = await app.bot.get_me()
    if (me.username or '').lower() != USERNAME.lower():
        raise RuntimeError('Wrong bot identity; startup refused')
    logging.warning('Polling ready: @%s; LNG profile', me.username)


async def error_handler(update, context):
    logging.warning('Telegram handler error: %s', type(context.error).__name__)


if __name__ == '__main__':
    load_dotenv(ROOT/'.env')
    token = os.environ.get('TELEGRAM_BOT_TOKEN', '').strip()
    if not token: raise SystemExit('TELEGRAM_BOT_TOKEN is not configured')
    app = Application.builder().token(token).post_init(verify_identity).build()
    app.add_handler(CommandHandler('start', start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle))
    app.add_error_handler(error_handler)
    app.run_polling(drop_pending_updates=False)
