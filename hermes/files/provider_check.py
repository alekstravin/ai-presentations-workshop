"""Check an OpenAI-compatible gateway and a complete tool-call round trip.
Requires: pip install httpx
Set MODEL_BASE_URL, MODEL_API_KEY, MODEL_ID. Does not run arbitrary commands.
"""
import json
import getpass
import os
import httpx

base = os.environ['MODEL_BASE_URL'].rstrip('/')
key = os.environ.get('MODEL_API_KEY') or os.environ.get('GPT2GIGA_API_KEY') or getpass.getpass('Ключ прокси/API (скрытый ввод): ')
model = os.environ['MODEL_ID']
headers = {'Authorization': 'Bearer ' + key}
tools = [{'type': 'function', 'function': {'name': 'add_numbers',
          'description': 'Add two integers. Call this tool to calculate the result.',
          'parameters': {'type': 'object', 'properties': {'a': {'type': 'integer'},
                         'b': {'type': 'integer'}}, 'required': ['a', 'b']}}}]
with httpx.Client(timeout=180) as client:
    r = client.get(base + '/models', headers=headers)
    r.raise_for_status()
    print('Catalog HTTP 200')
    messages = [{'role': 'user', 'content': 'Call add_numbers with a=7, b=11. Then report its result.'}]
    payload = {'model': model, 'messages': messages, 'tools': tools,
               'tool_choice': 'auto', 'max_tokens': 256}
    r = client.post(base + '/chat/completions', headers=headers, json=payload)
    r.raise_for_status()
    message = r.json()['choices'][0]['message']
    calls = message.get('tool_calls', [])
    if len(calls) != 1 or calls[0]['function']['name'] != 'add_numbers':
        raise RuntimeError('No valid tool call; plain chat is not an agent test')
    args = json.loads(calls[0]['function']['arguments'])
    if args != {'a': 7, 'b': 11}:
        raise RuntimeError(f'Unexpected arguments: {args}')
    messages += [message, {'role': 'tool', 'tool_call_id': calls[0]['id'], 'content': '18'}]
    r = client.post(base + '/chat/completions', headers=headers,
                    json={'model': model, 'messages': messages, 'tools': tools, 'max_tokens': 256})
    r.raise_for_status()
    answer = r.json()['choices'][0]['message'].get('content', '')
    if '18' not in answer:
        raise RuntimeError('Tool result was not reflected in the final response')
    print('PASS: model -> tool call -> tool result -> final answer')
    print(answer)
