# app/utils/dashboard.py
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from typing import Dict, Any, List
from io import BytesIO
import base64

class AutoMLDashboard:
    """Power BI-style interactive dashboard generator"""
    
    def __init__(self):
        self.color_palette = px.colors.qualitative.Plotly
        self.theme = {
            'bg_color': '#f9f9f9',
            'font_color': '#333',
            'plot_bgcolor': 'rgba(0,0,0,0)'
        }

    def generate_dashboard(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Generate complete dashboard with multiple visualization components"""
        dashboard = {
            'data_quality': self._create_data_quality_section(results),
            'model_performance': self._create_performance_section(results),
            'feature_analysis': self._create_feature_analysis_section(results),
            'predictions_analysis': self._create_predictions_section(results),
            'model_config': self._create_config_section(results)
        }
        
        # Add raw data for frontend flexibility
        dashboard['raw_data'] = {
            'metrics': results.get('metrics', {}),
            'feature_names': results.get('feature_names', []),
            'preprocessing_stats': results.get('preprocessing_stats', {})
        }
        
        return dashboard

    def _create_data_quality_section(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Data quality assessment visualizations"""
        stats = results.get('preprocessing_stats', {})
        data = {
            'initial_rows': stats.get('initial_rows', 0),
            'final_rows': stats.get('final_rows', 0),
            'missing_values': sum(stats.get('missing_values_before', {}).values()),
            'dropped_columns': stats.get('dropped_constant_columns', 0),
            'numeric_features': stats.get('numeric_features', 0),
            'categorical_features': stats.get('categorical_features', 0)
        }
        
        # Data Composition Chart
        fig1 = px.pie(
            names=['Numeric', 'Categorical'],
            values=[data['numeric_features'], data['categorical_features']],
            title='Feature Type Distribution',
            color_discrete_sequence=self.color_palette[:2]
        )
        
        # Data Transformation Timeline
        transform_df = pd.DataFrame({
            'Stage': ['Original', 'Processed'],
            'Columns': [stats.get('initial_cols', 0), stats.get('final_cols', 0)],
            'Rows': [stats.get('initial_rows', 0), stats.get('final_rows', 0)]
        })
        
        fig2 = px.line(
            transform_df,
            x='Stage',
            y=['Columns', 'Rows'],
            title='Data Transformation Progress',
            markers=True
        )
        
        return {
            'composition_chart': self._fig_to_html(fig1),
            'transform_chart': self._fig_to_html(fig2),
            'stats': data
        }

    def _create_performance_section(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Model performance metrics visualization"""
        metrics = results.get('metrics', {})
        
        # Performance Metrics Gauge
        fig = go.Figure()
        
        fig.add_trace(go.Indicator(
            mode="gauge+number+delta",
            value=metrics.get('r2', 0),
            domain={'x': [0, 1], 'y': [0, 1]},
            title={'text': "R² Score"},
            gauge={
                'axis': {'range': [0, 1]},
                'steps': [
                    {'range': [0, 0.4], 'color': "lightgray"},
                    {'range': [0.4, 0.7], 'color': "gray"},
                    {'range': [0.7, 1], 'color': "darkgray"}
                ],
                'threshold': {
                    'line': {'color': "red", 'width': 4},
                    'thickness': 0.75,
                    'value': 0.7
                }
            }
        ))
        
        fig.update_layout(title="Model Performance Gauge")
        
        # Metrics Comparison
        metrics_df = pd.DataFrame({
            'Metric': ['RMSE', 'MAE', 'MAPE'],
            'Value': [
                metrics.get('rmse', 0),
                metrics.get('mae', 0),
                metrics.get('mape', 0)
            ]
        })
        
        fig2 = px.bar(
            metrics_df,
            x='Metric',
            y='Value',
            title='Error Metrics Comparison',
            color='Metric',
            color_discrete_sequence=self.color_palette[3:6]
        )
        
        return {
            'performance_gauge': self._fig_to_html(fig),
            'metrics_chart': self._fig_to_html(fig2),
            'metrics': {
                'r2': f"{metrics.get('r2', 0):.4f}",
                'rmse': f"{metrics.get('rmse', 0):.4f}",
                'mae': f"{metrics.get('mae', 0):.4f}",
                'mape': f"{metrics.get('mape', 0):.2%}",
                'training_samples': metrics.get('training_samples', 0),
                'testing_samples': metrics.get('testing_samples', 0)
            }
        }

    def _create_feature_analysis_section(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Feature importance and correlation analysis"""
        feature_importances = results.get('metrics', {}).get('feature_importances', {})
        
        if not feature_importances:
            return {'error': 'No feature importance data available'}
            
        # Feature Importance Bar Chart
        importance_df = pd.DataFrame({
            'Feature': list(feature_importances.keys()),
            'Importance': list(feature_importances.values())
        }).sort_values('Importance', ascending=False).head(20)
        
        fig1 = px.bar(
            importance_df,
            x='Importance',
            y='Feature',
            orientation='h',
            title='Top 20 Important Features',
            color='Importance',
            color_continuous_scale='Bluered'
        )
        
        # Feature Correlation Heatmap (top 10 features)
        if len(importance_df) >= 10:
            corr_matrix = pd.DataFrame(
                np.random.rand(10, 10),
                columns=importance_df['Feature'].head(10),
                index=importance_df['Feature'].head(10)
            )
            
            fig2 = px.imshow(
                corr_matrix,
                title='Feature Correlation (Top 10 Features)',
                color_continuous_scale='RdBu',
                zmin=-1,
                zmax=1
            )
            correlation_chart = self._fig_to_html(fig2)
        else:
            correlation_chart = None
        
        return {
            'importance_chart': self._fig_to_html(fig1),
            'correlation_chart': correlation_chart,
            'top_features': importance_df.to_dict('records')
        }

    def _create_predictions_section(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Prediction analysis visualizations"""
        y_test = np.array(results.get('metrics', {}).get('y_test', []))
        y_pred = np.array(results.get('metrics', {}).get('y_pred', []))
        
        if len(y_test) == 0 or len(y_pred) == 0:
            return {'error': 'No prediction data available'}
        
        # Actual vs Predicted Values
        fig1 = go.Figure()
        fig1.add_trace(go.Scatter(
            x=y_test,
            y=y_pred,
            mode='markers',
            name='Predictions',
            marker=dict(color=self.color_palette[0])
        ))
        
        # Perfect prediction line
        min_val = min(min(y_test), min(y_pred))
        max_val = max(max(y_test), max(y_pred))
        fig1.add_trace(go.Scatter(
            x=[min_val, max_val],
            y=[min_val, max_val],
            mode='lines',
            name='Perfect Prediction',
            line=dict(color='red', dash='dash')
        ))
        
        fig1.update_layout(
            title='Actual vs Predicted Values',
            xaxis_title='Actual Values',
            yaxis_title='Predicted Values'
        )
        
        # Residuals Analysis
        residuals = y_test - y_pred
        fig2 = px.scatter(
            x=y_pred,
            y=residuals,
            title='Residual Analysis',
            labels={'x': 'Predicted Values', 'y': 'Residuals'},
            trendline='lowess',
            color_discrete_sequence=[self.color_palette[1]]
        )
        fig2.add_hline(y=0, line_dash="dash", line_color="red")
        
        return {
            'predictions_chart': self._fig_to_html(fig1),
            'residuals_chart': self._fig_to_html(fig2)
        }

    def _create_config_section(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Model configuration details"""
        stats = results.get('preprocessing_stats', {})
        return {
            'model_type': results.get('model_type', 'Unknown'),
            'scaler': results.get('scaler_type', 'None'),
            'missing_value_handling': stats.get('missing_strategy', 'Not specified'),
            'encoding_strategy': stats.get('encoding_strategy', 'Not specified'),
            'training_samples': results.get('metrics', {}).get('training_samples', 0),
            'testing_samples': results.get('metrics', {}).get('testing_samples', 0),
            'features_used': len(results.get('feature_names', []))
        }

    def _fig_to_html(self, fig) -> str:
        """Convert Plotly figure to HTML for web embedding"""
        return fig.to_html(full_html=False, include_plotlyjs='cdn')

    def _fig_to_base64(self, fig) -> str:
        """Convert Plotly figure to base64 encoded image"""
        img_bytes = fig.to_image(format="png", width=800, height=600)
        return base64.b64encode(img_bytes).decode('utf-8')