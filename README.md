# 🚀 Auto-ML Studio – Your No-Code ML Playground

**Auto-ML Studio** is a super-easy, no-code machine learning platform. Just upload a CSV, pick a model, and boom — get results like a pro ML engineer without writing a single line of code. 😎

### 🔧 Built With

* **Frontend:** React.js (hosted on Vercel)
* **Backend:** FastAPI (hosted on Railway)
* **ML Power:** Python + scikit-learn + pandas + matplotlib


## ✨ Features That Make It Awesome

* **📂 Easy CSV Upload:** Just drop your file—no coding needed.
* **🧼 Auto Data Cleanup:** It fixes missing values, encodes text, and gets your data ready.
* **🧠 Choose Your ML Model:** Pick from Linear Regression, Decision Tree, Random Forest & more.
* **📊 See the Results:** Get Accuracy, RMSE, R² and see how your model is doing.
* **📉 Visuals That Speak:** Confusion matrix, feature importance charts—all done for you.
* **📁 Project Dashboard:** Simple drag-and-drop interface to manage everything smoothly.

## 🎯 What You Can Do

* **📁 Upload CSV Files**
  Drag & drop your dataset, and we’ll clean it (missing values, encoding, normalizing — all handled).

* **🧠 Choose a Model**
  Pick from ML models like:

  * Linear Regression
  * Decision Tree
  * Random Forest
    *(more coming soon!)*

* **📊 See Results Instantly**
  Get performance metrics like:

  * **Accuracy** (for classification)
  * **RMSE / R²** (for regression)
  * Confusion Matrix & Feature Importance Charts

* **📋 Manage Projects Easily**
  A neat dashboard to manage uploads, check metrics, and switch between models.

## 🛠 Tech Breakdown

| Part     | Tech Used           | Host       |
| -------- | ------------------- | ---------- |
| Frontend | React.js            | Vercel 🌐  |
| Backend  | FastAPI (Python)    | Railway ☁️ |
| ML Tools | pandas, sklearn     | -          |
| Charts   | matplotlib / Plotly | -          |


## 📂 Folder Structure (Simple View)

```
Auto-ML-Studio/
├── backend/       # FastAPI app (APIs, ML code)
├── frontend/      # React app (UI)
└── README.md      # You're reading it 😉
```


## 🧑‍💻 How to Run Locally

### Step 1: Clone

```bash
git clone https://github.com/your-org/auto-ml-studio.git
cd auto-ml-studio
```

### Step 2: Start Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Step 3: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Now open your browser: [http://localhost:3000](http://localhost:3000) 🎉


## 🌐 Deployed Version

Check it live 👉 [AutoML Studio Live](https://auto-ml-studio-phi.vercel.app/)


## 🧑‍🏫 How to Use It

1. **Go to the app**
2. **Upload your CSV**
3. **Pick a model**
4. **Click "Train"**
5. **View Results** – metrics + graphs
6. **Done!** ML without the math headache. 😅


## 🤝 Contribute

Wanna help make this better?

* Fork the repo
* Make changes (add features, fix bugs, clean UI, anything!)
* Create a pull request

Every contribution counts. 💪


## 📜 License

MIT License — use it freely and make cool stuff!


Made with ❤️ by [Deepak (ArrowMax)](https://github.com/deepakcode21) & [Pivink (RdxJohn)](https://github.com/Pivink)