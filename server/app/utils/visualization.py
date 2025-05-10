import io
import base64
import matplotlib.pyplot as plt

def get_visualization_plot(model, columns, model_name: str) -> str:
    plt.figure(figsize=(8, 6))
    if hasattr(model, 'feature_importances_'):
        plt.barh(columns, model.feature_importances_)
        plt.xlabel('Importance')
        plt.title('Feature Importance')
    elif hasattr(model, 'coef_'):
        plt.barh(columns, model.coef_)
        plt.xlabel('Coefficient Value')
        plt.title('Linear Regression Coefficients')
    else:
        return None
    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')

def get_prediction_plot(y_true, y_pred) -> str:
    plt.figure(figsize=(8, 5))
    y_vals = y_true.values if hasattr(y_true, 'values') else y_true
    plt.plot(y_vals, label='Actual', marker='o')
    plt.plot(y_pred, label='Predicted', marker='x')
    plt.title('Actual vs Predicted')
    plt.xlabel('Sample')
    plt.ylabel('Value')
    plt.legend()
    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')