from flask import Flask, request, jsonify
from ultralytics import YOLO
from PIL import Image
import io
import base64
import os
import gdown
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 📦 Automatically download the model if not already present
MODEL_PATH = 'best.pt'
DRIVE_FILE_ID = '1zNKD-5tdaofMgqBvXEiLel-jD_VkZgG8'

if not os.path.exists(MODEL_PATH):
    print("Downloading best.pt from Google Drive...")
    gdown.download(f"https://drive.google.com/uc?id={DRIVE_FILE_ID}", MODEL_PATH, quiet=False)

# ✅ Load YOLO model
model = YOLO(MODEL_PATH)

# 🔤 Class mapping
label_map = {
    'dog': 'dog',
    'dogs': 'dog',
    'dogss': 'dog',
    'stray dog': 'dog',
    'pothole': 'potholes',
    'potholes': 'potholes',
    'road damage': 'potholes'
}

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    img_bytes = file.read()
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB')

    results = model.predict(img, save=False, conf=0.4)
    boxes = results[0].boxes

    predictions = []
    top_class = None
    top_score = 0

    for box in boxes:
        cls_id = int(box.cls[0])
        raw_cls_name = model.names[cls_id].lower()
        mapped_cls_name = label_map.get(raw_cls_name, 'unknown')
        score = float(box.conf[0])

        predictions.append({
            'class': mapped_cls_name,
            'score': round(score, 2)
        })

        if score > top_score:
            top_score = score
            top_class = mapped_cls_name

    # 📸 Encode annotated image
    annotated_frame = results[0].plot()
    buffered = io.BytesIO()
    Image.fromarray(annotated_frame).save(buffered, format="JPEG")
    encoded_img = base64.b64encode(buffered.getvalue()).decode()

    return jsonify({
        'annotated_image': encoded_img,
        'predictions': predictions,
        'top_class': top_class
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
