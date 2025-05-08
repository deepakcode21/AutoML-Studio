# Auto-ML Studio – No Code Automated Machine Learning Tool

**[AutoML Studio](https://auto-ml-studio-phi.vercel.app/)** is a no-code automated machine learning platform that lets users build and evaluate predictive models through an intuitive web interface. Built with a React.js frontend and a FastAPI backend, Auto-ML Studio enables users to upload CSV datasets, automatically preprocess the data (e.g. handling missing values, encoding categorical variables, normalization, and train-test splitting), select from multiple algorithms (such as Linear Regression, Decision Tree, Random Forest, etc.), and view performance metrics and visualizations. This democratizes machine learning by letting non-experts harness ML algorithms without writing code.

## Key Features

* **Data Upload & Preprocessing:** Upload CSV files via the web UI. The platform automatically handles common data cleaning, as automated data processing is crucial for good model performance.
  
* **Flexible Model Selection:** Choose from several built-in algorithms for regression and classification, including Linear Regression, Decision Tree, Random Forest, and more. The system abstracts these algorithms behind simple options so users can experiment without coding.
* **Performance Metrics:** After training, Auto-ML Studio displays key evaluation metrics. For classification tasks, this includes **Accuracy** (the proportion of correct predictions). For regression tasks, metrics like **Root Mean Squared Error (RMSE)** and **R² (coefficient of determination)** are provided to quantify model fit.
* **Interactive Visualizations:** The tool auto-generates charts to help interpret model results. For classifiers, it shows a *confusion matrix* (a 2D table of true vs. predicted classes) to analyze errors. For all models, it can display **feature importance** plots (indicating each input feature's contribution to the model).

## Tech Stack

* **Frontend:** React.js (JavaScript) – a popular library for building interactive UIs. The frontend is a single-page application deployed on Vercel with automatic builds from the GitHub repo.
* **Backend:** FastAPI (Python) – a modern, high-performance web framework for building APIs. FastAPI’s data-validation and async performance features make it ideal for ML backends.
* **Machine Learning:** Python libraries such as pandas (for data handling), scikit-learn (for model training and evaluation), and matplotlib or Plotly (for generating charts).
* **Deployment:**

  * *Frontend:* Hosted on **Vercel**
  * *Backend:* Hosted on **Railway**
* **Collaboration:** Built in collaboration with **[Pivink](https://github.com/Pivink)**. Open to community contributions and improvements.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-org/auto-ml-studio.git
   cd AutoML-Studio
   ```

2. **Backend setup:**

   * Navigate to the `backend` directory: `cd backend`.
   * Create a Python virtual environment (optional but recommended): `python -m venv venv && source venv/bin/activate`.
   * Install dependencies: `pip install -r requirements.txt`.
   * Configure environment variables in a `.env` file (e.g., for database URLs or secret keys).
   * Run the FastAPI server:

     ```bash
     uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
     ```

     This will start the backend API locally at `http://localhost:8000`.

3. **Frontend setup:**

   * Open a new terminal and navigate to the `frontend` directory: `cd frontend`.
   * Install Node.js dependencies: `npm install` (or `yarn`).
   * Ensure the `.env` file contains the correct API URL.
   * Start the React development server:

     ```bash
     npm run dev
     ```

     The frontend should open in your browser at `http://localhost:5173` and communicate with the backend.

4. **Verify:**

   * Upload a sample CSV file through the web UI and ensure that preprocessing and model training work without errors.
   * You should see output metrics and charts generated automatically.

  
## Usage Guide

1. **Access the Web App:** Open the deployed frontend in a browser [AutoML Studio Live](https://auto-ml-studio-phi.vercel.app/) . You should see the welcome page.

2. **Upload Data:** Navigate to the **Data Upload** section and upload your CSV file. The app will preview the data. Auto-ML Studio will automatically preprocess the data.

3. **Select Model:** Choose a machine learning model from the options (e.g., Linear Regression for regression tasks, Decision Tree or Random Forest for classification, etc.).

4. **Train Model:** Click **Train**. The backend FastAPI service will train the selected model on your data. Once training is complete, the UI will display performance metrics:

   * **Accuracy** (for classification) or **RMSE/R²** (for regression).
   * A *confusion matrix* for classification tasks (showing true/false positives/negatives).
   * A *feature importance* chart to help explain which features most influenced the model’s predictions.

5. **Review Results:** Examine the metrics and visualizations. The confusion matrix provides insight into model performance, while feature importance helps you understand which variables the model is relying on. Use these insights to iterate (e.g., try a different model or adjust preprocessing).

6. **Download/Export:** You may have the option to download the trained model or results report. Otherwise, screenshots and copying results from the UI are available.


## Contribution

Auto-ML Studio is **open-source** and welcomes contributions! This project is built in collaboration with **[Pivink](https://github.com/Pivink)** and the broader community. To contribute:

* Fork the repository and create a new branch for your feature or bugfix.
* Ensure code style is consistent (use linters/formatters as needed).
* Add tests for new features.
* Submit a pull request with a clear description of your changes.

We appreciate contributions that improve functionality, documentation, or performance. open issues on GitHub.

**Credits:** Developed by the Auto-ML Studio team in partnership with [Pivink](https://github.com/Pivink). Powered by open-source technologies (React, FastAPI, scikit-learn, etc.) and inspired by the democratization of AI through no-code tools.

## Deployed Version

Check it live [AutoML Studio Live](https://auto-ml-studio-phi.vercel.app/)


##  License

MIT License — use it freely and make cool stuff!

Made with ❤️ by [Deepak (ArrowMax)](https://github.com/deepakcode21) & [Pivink (RdxJohn)](https://github.com/Pivink)