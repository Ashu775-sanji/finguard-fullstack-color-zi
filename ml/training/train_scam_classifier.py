"""Train the replaceable FinGuard baseline NLP model on an anonymized CSV.
Expected columns: text,label,category. Never place real secrets or banking credentials in datasets.
"""
from pathlib import Path
import argparse,joblib,pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

def train(csv_path:str,out_path:str):
 data=pd.read_csv(csv_path).dropna(subset=['text','label']);x1,x2,y1,y2=train_test_split(data.text.astype(str),data.label,test_size=.2,random_state=42,stratify=data.label)
 model=Pipeline([('tfidf',TfidfVectorizer(lowercase=True,strip_accents='unicode',ngram_range=(1,2),min_df=2,max_features=40000)),('classifier',LogisticRegression(max_iter=1200,class_weight='balanced'))]);model.fit(x1,y1);print(classification_report(y2,model.predict(x2)));Path(out_path).parent.mkdir(parents=True,exist_ok=True);joblib.dump(model,out_path)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('csv');p.add_argument('--out',default='ml/models/scam_tfidf_logreg.joblib');a=p.parse_args();train(a.csv,a.out)
