import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

def preprocess_text(text):
  """
  Preprocesses text data by removing stopwords and tokenizing.
  """
  tokens = word_tokenize(text.lower())
  tokens = [token for token in tokens if token not in stopwords.words('english')]
  return tokens

def load_data(filename):
  """
  Loads text data from a file.
  """
  with open(filename, 'r') as f:
    data = f.read()
  return data
