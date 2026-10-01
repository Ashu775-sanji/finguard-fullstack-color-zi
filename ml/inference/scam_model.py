from pathlib import Path
import joblib
class ScamTextModel:
 def __init__(self,path='ml/models/scam_tfidf_logreg.joblib'):self.path=Path(path);self.model=joblib.load(self.path) if self.path.exists() else None
 def predict(self,text:str):
  if not self.model:return None
  proba=self.model.predict_proba([text])[0];classes=list(self.model.classes_);i=max(range(len(proba)),key=proba.__getitem__);return {'label':str(classes[i]),'confidence':round(float(proba[i]),4)}
