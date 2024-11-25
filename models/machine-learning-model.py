import mlflow.sklearn
import numpy as np
from sklearn.linear_model import LogisticRegression
from mlflow.models.signature import infer_signature

# Start your training job with `start_run()`
with mlflow.start_run() as run:

    lr = LogisticRegression()
    X = np.array([-2, -1, 0, 1, 2, 1]).reshape(-1, 1)
    y = np.array([0, 0, 1, 1, 1, 0])
    lr.fit(X, y)
    score = lr.score(X, y)
    signature = infer_signature(X, y)

    # Activate the MLFlow logging API to log your training job metrics
    print("test log_metrics.")
    mlflow.log_metric("score", score)

    # Activate the MLFlow logging API to log your training job parameters
    print("test log_params.")
    mlflow.log_param("alpha", "alpha")
    print("All done")
