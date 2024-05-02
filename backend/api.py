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
    data = request.json
    img_array = convert_sequence_into_kmer_representation(seq=data["sequence"])
    img = convert_to_image(img_array)
    img_rgb = img.convert("RGB")
    
    np_img = np.array(img_rgb)
    
    np_img = np_img[np.newaxis, ...]
    print(np_img.shape)
    
    prediction = int(np.argmax(model.predict(np_img)[0]))
    
    # pred_sarscov2 = None
    
    if prediction==0:
        final_prediction = "Riboviria"
        # pred_sarscov2 = int(sarscov2_model.predict(np_img))
        # print(pred_sarscov2)
    elif prediction==1:
        final_prediction = "Duplodnaviria"
    elif prediction==2:
        final_prediction = "Monodnaviria"
    else:
        final_prediction = "Varidnaviria"
    
    return jsonify({'prediction': final_prediction})

if __name__=='__main__':
    model_path = "./saved_model/4_class_classification_model.keras"
    model = load_model(model_path)
    
    # sarscov2_model_path = "./saved_model_sarscov2/2_class_classification_model.keras"
    # sarscov2_model = load_model(sarscov2_model_path)
    
    with open("./most_common_kmers_list.pkl", 'rb') as file:
        most_common_kmers_list = pickle.load(file)
    
    app.run(debug=True)
    