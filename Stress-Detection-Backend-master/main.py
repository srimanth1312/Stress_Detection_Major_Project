from flask import Flask, render_template, Response,Flask, request, jsonify
import cv2
import tensorflow as tf
from tensorflow.keras.models import load_model
from time import sleep
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.preprocessing import image
import cv2
from flask_cors import CORS
import librosa 
import numpy as np 
import sounddevice as sd
import warnings

app = Flask(__name__)

CORS(app) 
CORS(app, resources={r"/upload-audio": {"origins": "http://localhost:5173"}})

camera = cv2.VideoCapture(0)  
face_classifier = cv2.CascadeClassifier(cv2.data.haarcascades +"haarcascade_frontalface_default.xml")
classifier =load_model("C:\\Users\\druth\\OneDrive\\Desktop\\stress detection\\Multimodal-Emotion-Backend\\model.h5")
emotion_labels = ['Angry','Disgust','Fear','Happy','Neutral', 'Sad', 'Surprise']
cap = cv2.VideoCapture(0)

warnings.filterwarnings("ignore")

@app.route('/')
def home():
    return 'Server Running successfully'

@app.route('/upload-audio', methods=['POST'])
def upload_audio():
    
    # print(request.files)
    audio_file = request.files['audio']
    print(audio_file)

    audio_file.save('audio.webm')
    y, sr = librosa.load("audio.webm", duration=2.0)
    # sd.play(y, sr)
    # sd.wait()
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)  # Compute MFCC features
    mfcc_padded = tf.keras.preprocessing.sequence.pad_sequences(mfcc, maxlen=162, padding='post', truncating='post')

    # Reshape MFCC features to match the expected input shape
    mfcc_reshaped = np.expand_dims(mfcc_padded, axis=-1)  # Add a channel dimension

    emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Surprise', 'Sad']
    emotion_model = tf.keras.models.load_model('Multimodal-Emotion-Backend\\Voicemodel1.h5') # load the model
    predictions = emotion_model.predict(mfcc_reshaped) 
    # Convert probabilities to class labels
    predicted_emotion_index = np.argmax(predictions)
    print(predicted_emotion_index)
    if(predicted_emotion_index>6):predicted_emotion_index=4
    predicted_emotion = emotion_labels[predicted_emotion_index]

    print(f'The emotion of the audio file is {predicted_emotion}.')
    return jsonify(predicted_emotion), 200

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

def gen_frames(): 
    while True:
        _, frame = cap.read()
        labels = []
        gray = cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
        faces = face_classifier.detectMultiScale(gray)

        for (x,y,w,h) in faces:
            cv2.rectangle(frame,(x,y),(x+w,y+h),(0,255,255),2)
            roi_gray = gray[y:y+h,x:x+w]
            roi_gray = cv2.resize(roi_gray,(48,48),interpolation=cv2.INTER_AREA)

            if np.sum([roi_gray])!=0:
                roi = roi_gray.astype('float')/255.0
                roi = img_to_array(roi)
                roi = np.expand_dims(roi,axis=0)
                prediction = classifier.predict(roi)[0]
                label=emotion_labels[prediction.argmax()]
                label_position = (x,y)
                cv2.putText(frame,label,label_position,cv2.FONT_HERSHEY_SIMPLEX,1,(0,255,0),2)
            else:
                cv2.putText(frame,'No Faces',(30,80),cv2.FONT_HERSHEY_SIMPLEX,1,(0,255,0),2)
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
  

if __name__ == '__main__':
    app.run(debug=True)



