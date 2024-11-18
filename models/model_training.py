from transformers import TFGPT2LMHeadModel, TFGPT2Tokenizer, TFBertForQuestionAnswering, TFBertTokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.callbacks import EarlyStopping

def train_gpt2_model(data_path, model_path):
  """
  Trains a GPT-2 model for text generation.
  """
  # Load data
  data = load_data(data_path)
  inputs = tokenizer.encode(data, return_tensors='tf')

  # Define model and tokenizer
  model = TFGPT2LMHeadModel.from_pretrained('gpt2')
  tokenizer = TFGPT2Tokenizer.from_pretrained('gpt2')

  # Train the model
  model.compile(optimizer='adam', loss='categorical_crossentropy')
  early_stopping = EarlyStopping(monitor='val_loss', patience=3)
  model.fit(inputs, inputs[:, 1:], epochs=5, validation_split=0.2, callbacks=[early_stopping])

  # Save the model
  model.save(model_path)

def train_bert_model(data_path, model_path):
  """
  Trains a BERT model for question answering (example using SQuAD format).
  """
  # Load data (replace with your question-answering data format)
  # ...

  # Define model and tokenizer
  model = TFBertForQuestionAnswering.from_pretrained('bert-base-uncased-qa')
  tokenizer = TFBertTokenizer.from_pretrained('bert-base-uncased')

  # Train the model (replace with your training code)
  # ...

  # Save the model
  model.save(model_path)
