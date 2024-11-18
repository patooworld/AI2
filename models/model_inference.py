from transformers import TFGPT2LMHeadModel, TFGPT2Tokenizer, TFBertForQuestionAnswering, TFBertTokenizer

def generate_text(model_path, prompt, max_length=200):
  """
  Generates text using the trained GPT-2 model.
  """
  model = TFGPT2LMHeadModel.load_weights(model_path)
  tokenizer = TFGPT2Tokenizer.from_pretrained('gpt2')

  # Preprocess prompt
  input_ids = tokenizer.encode(prompt, return_tensors='tf')

  # Generate text
  output = model.generate(input_ids, max_length=max_length)
  generated_text = tokenizer.decode(output[0], skip_special_tokens=True)
  return generated_text

def answer_question(model_path, context, question):
  """
  Answers a question using the trained BERT model (example using SQuAD format).
  """
  model = TFBertForQuestionAnswering.load_weights(model_path)
  tokenizer = TFBertTokenizer.from_pretrained('bert-base-uncased')

  # Preprocess context and question (replace with your processing code)
  # ...

  # Get answer span from model prediction
  # ...

  return answer_span  # Replace with actual answer extraction logic
