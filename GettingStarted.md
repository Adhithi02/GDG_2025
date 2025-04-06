
# 🚀 Getting Started with the Civic Rights Platform

Welcome! This guide will help you clone the project, set it up on your local machine, and get everything running smoothly.

---

## 📁 Step 1: Clone the Repository

First, clone the project and navigate into it:

```
git clone https://github.com/Adhithi02/GDG_2025.git
cd GDG_2025
```

---

## 📅 Step 2: Download the AI Model (`best.pt`)

This project uses a YOLO-based model to classify complaint images like potholes and stray animals. The trained model file (`best.pt`) is **not included in the repository** due to size restrictions.

🔗 **Download the model from Google Drive**  
👉 [Click here to download best.pt](https://drive.google.com/drive/folders/1NO2-Hk0FxV5jT1j7NbkOl078xdooU9bt?usp=sharing)

Once downloaded, move the file into the following directory:

```
python-backend/best.pt
```

✅ Ensure that the file name is exactly `best.pt` and not something like `best(1).pt`.

---

## 🔧 Step 3: Run the Python Backend (Flask)

The backend is a Flask server that performs image classification using the downloaded model.

```
cd python-backend
pip install -r requirements.txt
python app.py
```

- The server will start at `http://localhost:5000/`
- It accepts image uploads and returns classification predictions

---

## 🌐 Step 4: Run the React Frontend

Open a new terminal window or tab for the frontend:

```
npm install
npm run dev
```

- This starts the frontend at `http://localhost:5173/`
- The app allows users to file complaints and track their status

---

## 🧠 How It Works

1. A user uploads a photo of an issue (e.g., pothole, stray dog)
2. The backend predicts the type of issue using AI (`best.pt`)
3. The complaint is automatically assigned to the relevant department
4. Users and officials can track the complaint in real time

---

## 📌 Notes

- `best.pt` is excluded from version control using `.gitignore` — please don’t try to commit it.
- You need:
  - Python 3 and `pip`
  - Node.js and `npm`
- Geolocation is used when submitting complaints — allow location access in your browser

---

## ✅ You're All Set!

You can now explore the platform, file mock complaints, and simulate the full workflow.  
Let’s build cleaner and smarter cities together! 🏟️✨

