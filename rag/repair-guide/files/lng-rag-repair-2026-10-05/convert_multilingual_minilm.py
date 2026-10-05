"""Use llama.cpp's existing SentencePiece vocabulary exporter for multilingual MiniLM.
The checkpoint is BertModel with an XLM-R Unigram tokenizer, NOT a WordPiece tokenizer.
No changes to installed Unsloth or llama.cpp sources.
"""
import sys,runpy,pathlib
root=pathlib.Path.home()/'.unsloth/llama.cpp'
sys.path.insert(0,str(root));sys.path.insert(0,str(root/'gguf-py'))
from conversion.bert import BertModel
from conversion.base import ModelBase
@ModelBase.register('BertModel')
class MultilingualMiniLM(BertModel):
 model_arch=BertModel.model_arch
 def set_vocab(self):
  self._xlmroberta_set_vocab()
  self.vocab_size=self.hparams['vocab_size']
runpy.run_path(str(root/'convert_hf_to_gguf.py'),run_name='__main__')
