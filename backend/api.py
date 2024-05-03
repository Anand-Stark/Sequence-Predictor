from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import pickle
import collections
import numpy as np
from keras.models import load_model
from PIL import Image

app = Flask(__name__)

CORS(app)

mapping = {
    'Riboviria': 0,
    'Duplodnaviria': 1,
    'Monodnaviria': 2,
    'Varidnaviria': 3
}

def convert_sequence_into_kmer_representation_coronavirus(seq, k_value=6, img_dimension=32):
    kmer_counter = collections.Counter()
    for i in range(len(seq)):
        kmer = seq[i: i+k_value]
        kmer_counter[kmer] += 1
    
    kmer_counter_ordered = dict()
    for i in range(img_dimension*img_dimension):
        if most_common_kmers_list[i] in kmer_counter.keys():
            kmer_counter_ordered[most_common_kmers_list[i]] = kmer_counter[most_common_kmers_list[i]]
        else:
            kmer_counter_ordered[most_common_kmers_list[i]] = 0
            
    kmer_values = list(kmer_counter_ordered.values())
    kmer_values = np.array(kmer_values)
    kmer_values = kmer_values.reshape((32, 32))
    
    return kmer_values

def convert_sequence_into_kmer_representation(seq, k_value=6, img_dimension=64):
    kmer_counter = collections.Counter()
    for i in range(len(seq)):
        kmer = seq[i: i+k_value]
        kmer_counter[kmer] += 1
    
    kmer_counter_ordered = dict()
    for i in range(img_dimension*img_dimension):
        if most_common_kmers_list[i] in kmer_counter.keys():
            kmer_counter_ordered[most_common_kmers_list[i]] = kmer_counter[most_common_kmers_list[i]]
        else:
            kmer_counter_ordered[most_common_kmers_list[i]] = 0
            
    kmer_values = list(kmer_counter_ordered.values())
    kmer_values = np.array(kmer_values)
    kmer_values = kmer_values.reshape((64, 64))
    
    return kmer_values

def convert_to_image(img_array):
    img_array = ((img_array - img_array.min()) / (img_array.max() - img_array.min()) * 255).astype(np.uint8)
    
    img = Image.fromarray(img_array)
    return img


@app.route('/predict', methods=['POST'])
def predict():
    print("hi")
    data = request.json
    print(data["sequence"])
    img_array = convert_sequence_into_kmer_representation(seq=data["sequence"])
    img_array_coronavirus = convert_sequence_into_kmer_representation_coronavirus(data["sequence"])
    
    img = convert_to_image(img_array)
    img_coronavirus = convert_to_image(img_array_coronavirus)
    
    img_rgb = img.convert("RGB")
    img_rgb_coronavirus = img_coronavirus.convert("RGB")
    
    np_img = np.array(img_rgb)
    np_img_coronavirus = np.array(img_rgb_coronavirus)
    
    np_img = np_img[np.newaxis, ...]
    np_img_coronavirus = np_img_coronavirus[np.newaxis, ...]
    print(np_img_coronavirus.shape)
    print(np_img.shape)
    
    prediction = int(np.argmax(model.predict(np_img)[0]))
    prediction_coronavirus = int(np.argmax(coronavirus_model.predict(np_img_coronavirus)[0]))
    
    pred_sarscov2 = None
    
    if prediction==0:
        final_prediction = "Riboviria"
        pred_sarscov2 = int(sarscov2_model.predict(np_img))
        print(pred_sarscov2)
    elif prediction==1:
        final_prediction = "Duplodnaviria"
    elif prediction==2:
        final_prediction = "Monodnaviria"
    else:
        final_prediction = "Varidnaviria"
        
    if prediction_coronavirus==0:
        coronavirus_prediction = "229E"
    elif prediction_coronavirus==1:
        coronavirus_prediction = "Covid-19"
    elif prediction_coronavirus==2:
        coronavirus_prediction = "HKU1"
    elif prediction_coronavirus==3:
        coronavirus_prediction = "MERS-CoV"
    elif prediction_coronavirus==4:
        coronavirus_prediction = "NL63"
    else:
        coronavirus_prediction = "SARS-CoV"
    
    return jsonify({'prediction': final_prediction, 'coronavirus_prediction': coronavirus_prediction, 'sars_cov_2_prediction': pred_sarscov2})

if __name__=='__main__':
    model_path = "./backend/saved_model/4_class_classification_model.keras"
    model = load_model(model_path)
    
    sarscov2_model_path = "./backend/saved_model_sarscov2_classification/sars_cov2_binary_classification.keras"
    sarscov2_model = load_model(sarscov2_model_path)
    
    coronavirus_path = "./backend/saved_model_coronavirus_classification/coronavirus_6_class_classification.keras"
    coronavirus_model = load_model(coronavirus_path)
    
    with open("./backend/most_common_kmers_list.pkl", 'rb') as file:
        most_common_kmers_list = pickle.load(file)
        
    with open("./backend/most_common_kmers_list_coronavirus.pkl", "rb") as file:
        most_common_kmers_list_coronavirus = pickle.load(file)
    
    app.run(debug=True)
    