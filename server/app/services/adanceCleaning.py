# app/services/advanceCleaning.py
import pandas as pd
import numpy as np
import json
from io import StringIO
from fastapi import HTTPException
from sklearn.impute import KNNImputer
from sklearn.preprocessing import StandardScaler, MinMaxScaler, OneHotEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import PCA
from imblearn.over_sampling import SMOTE
from scipy import stats
import re
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AdvancedDataCleaner:
    def __init__(self, file, preprocessing_config):
        self.file = file
        self.preprocessing = preprocessing_config
        self.df = None
        self.stats = {
            'rows_processed': 0,
            'rows_removed': 0,
            'columns_processed': 0,
            'missing_values_imputed': {},
            'columns_normalized': [],
            'columns_encoded': [],
            'duplicates_removed': 0,
            'outliers_removed': 0
        }
    
    async def clean_data(self):
        try:
            # Read the CSV file
            contents = await self.file.read()
            self.df = pd.read_csv(StringIO(contents.decode('utf-8')))
            self.stats['rows_processed'] = len(self.df)
            
            # Validate columns from preprocessing config
            self._validate_columns()
            
            # Apply preprocessing steps
            if self.preprocessing.get('impute_missing', False):
                self._handle_missing_values()
            
            if self.preprocessing.get('remove_outliers', False):
                self._handle_outliers()
            
            if self.preprocessing.get('feature_scaling', False):
                self._scale_features()
            
            if self.preprocessing.get('encode_categorical', False):
                self._encode_categorical()
            
            if self.preprocessing.get('text_processing', False):
                self._process_text_columns()
            
            if self.preprocessing.get('dimensionality_reduction', False):
                self._reduce_dimensionality()
            
            if self.preprocessing.get('handle_imbalance', False):
                self._handle_imbalance()
            
            # Final cleanup
            self._remove_duplicates()
            
            return {
                'csv': self.df.to_csv(index=False),
                'stats': self.stats
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    def _validate_columns(self):
        available_cols = set(self.preprocessing.get('available_columns', []))
        config_cols = set()
        
        # Collect all columns mentioned in preprocessing config
        for col_type in ['numeric_columns', 'categorical_columns', 'text_columns', 
                        'datetime_columns']:
            config_cols.update(self.preprocessing.get(col_type, []))
        
        if self.preprocessing.get('target_column'):
            config_cols.add(self.preprocessing['target_column'])
        
        # Check if all configured columns exist in the dataframe
        missing_cols = config_cols - available_cols
        if missing_cols:
            raise HTTPException(
                status_code=400,
                detail=f"Columns not found in dataset: {', '.join(missing_cols)}"
            )
    
    def _handle_missing_values(self):
        try:
            logger.info("Starting missing value handling")
            
            # Standard missing value indicators
            missing_indicators = ['', 'none', 'na', 'n/a', 'nan', 'null', 'missing', '-', 
                                'we dont have comf', 'null', 'NULL', 'NaN', 'N/A', 'NA',
                                'missing', 'MISSING', 'None', 'NONE', '?', '.']
            
            # Step 1: Convert all missing indicators to NaN across ALL columns
            logger.info("Converting all missing indicators to NaN")
            for col in self.df.columns:
                # Convert to string for reliable comparison
                self.df[col] = self.df[col].astype(str)
                
                # Replace missing indicators with NaN
                self.df[col] = self.df[col].apply(
                    lambda x: np.nan if str(x).strip().lower() in [m.strip().lower() for m in missing_indicators] else x
                )
            
            # Also replace empty strings and whitespace only
            self.df.replace(r'^\s*$', np.nan, regex=True, inplace=True)
            
            # Step 2: Clean raw data (handles numeric conversions)
            self._clean_raw_data()
            
            # Get column lists from config
            method = self.preprocessing.get('imputation_method', 'median')
            numeric_cols = self.preprocessing.get('numeric_columns', [])
            categorical_cols = self.preprocessing.get('categorical_columns', [])
            text_cols = self.preprocessing.get('text_columns', [])
            
            # Step 3: Handle numeric columns
            if numeric_cols:
                numeric_cols = [col for col in numeric_cols if col in self.df.columns]
                logger.info(f"Processing numeric columns: {numeric_cols}")
                
                # First ensure all numeric columns are actually numeric
                for col in numeric_cols:
                    if not pd.api.types.is_numeric_dtype(self.df[col]):
                        self.df[col] = pd.to_numeric(self.df[col], errors='coerce')
                
                # Now impute
                if method == 'knn':
                    # Handle KNN imputation for all numeric columns at once
                    try:
                        # Check if we have enough data for KNN
                        non_missing_count = self.df[numeric_cols].dropna().shape[0]
                        if non_missing_count < 2:
                            logger.warning("Not enough data for KNN, using median instead")
                            raise ValueError("Not enough non-missing values for KNN")
                        
                        n_neighbors = min(5, non_missing_count)
                        imputer = KNNImputer(n_neighbors=n_neighbors)
                        self.df[numeric_cols] = imputer.fit_transform(self.df[numeric_cols])
                        
                        # Record stats
                        for col in numeric_cols:
                            missing_count = self.df[col].isna().sum()
                            if missing_count > 0:
                                self.stats['missing_values_imputed'][col] = missing_count
                    except Exception as e:
                        logger.error(f"KNN failed: {e}, using median instead")
                        # Fallback to median imputation
                        for col in numeric_cols:
                            missing_count = self.df[col].isna().sum()
                            if missing_count > 0:
                                self.stats['missing_values_imputed'][col] = missing_count
                                self.df[col].fillna(self.df[col].median(), inplace=True)
                else:
                    # Handle mean/median imputation
                    for col in numeric_cols:
                        try:
                            missing_count = self.df[col].isna().sum()
                            if missing_count > 0:
                                self.stats['missing_values_imputed'][col] = missing_count
                                
                                if method == 'mean':
                                    fill_value = self.df[col].mean()
                                else:  # median
                                    fill_value = self.df[col].median()
                                
                                self.df[col].fillna(fill_value, inplace=True)
                        except Exception as e:
                            logger.error(f"Failed to impute {col}: {str(e)}")
                            self.df[col].fillna(self.df[col].median(), inplace=True)
            
            # Step 4: Handle categorical/text columns
            logger.info("Processing categorical/text columns")
            for col in categorical_cols + text_cols:
                if col in self.df.columns:
                    try:
                        # Ensure text columns are strings
                        if col in text_cols:
                            self.df[col] = self.df[col].astype(str)
                        
                        missing_count = self.df[col].isna().sum()
                        if missing_count > 0:
                            self.stats['missing_values_imputed'][col] = missing_count
                            
                            if col in categorical_cols:
                                # For categorical, use mode or "missing" category
                                if not self.df[col].mode().empty:
                                    fill_value = self.df[col].mode()[0]
                                else:
                                    fill_value = "missing"
                            else:  # text columns
                                fill_value = ""
                            
                            self.df[col].fillna(fill_value, inplace=True)
                            
                            # Clean text data - remove asterisk prefix
                            if col in text_cols:
                                self.df[col] = self.df[col].str.replace(r'^\*', '', regex=True)
                    except Exception as e:
                        logger.error(f"Error processing {col}: {str(e)}")
                        self.df[col].fillna("missing", inplace=True)
            
            # Final check: ensure no missing values remain
            for col in self.df.columns:
                if self.df[col].isna().any():
                    if pd.api.types.is_numeric_dtype(self.df[col]):
                        self.df[col].fillna(self.df[col].median(), inplace=True)
                    else:
                        self.df[col].fillna("missing", inplace=True)
            
            logger.info("Missing value handling completed successfully")
            
        except Exception as e:
            logger.error(f"Critical error in _handle_missing_values: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to handle missing values: {str(e)}"
            )
    def _handle_outliers(self):
        method = self.preprocessing.get('outlier_method', 'iqr')
        threshold = self.preprocessing.get('outlier_threshold', 1.5)
        cols = self.preprocessing.get('numeric_columns', [])
        
        if not cols:
            return
            
        initial_rows = len(self.df)
        
        if method == 'iqr':
            for col in cols:
                if col not in self.df.columns:
                    continue
                    
                Q1 = self.df[col].quantile(0.25)
                Q3 = self.df[col].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - (threshold * IQR)
                upper_bound = Q3 + (threshold * IQR)
                
                self.df = self.df[(self.df[col] >= lower_bound) & 
                                (self.df[col] <= upper_bound)]
        else:  # z-score method
            for col in cols:
                if col not in self.df.columns:
                    continue
                    
                z_scores = np.abs(stats.zscore(self.df[col]))
                self.df = self.df[z_scores < threshold]
        
        self.stats['rows_removed'] += initial_rows - len(self.df)
        self.stats['outliers_removed'] = initial_rows - len(self.df)
        self.stats['columns_processed'] += len(cols)
    
    def _scale_features(self):
        method = self.preprocessing.get('scaling_method', 'standard')
        cols = self.preprocessing.get('numeric_columns', [])
        
        if not cols:
            return
            
        if method == 'standard':
            scaler = StandardScaler()
        else:  # minmax
            scaler = MinMaxScaler()
        
        self.df[cols] = scaler.fit_transform(self.df[cols])
        self.stats['columns_normalized'] = cols
        self.stats['columns_processed'] += len(cols)
    
    def _encode_categorical(self):
        method = self.preprocessing.get('encoding_method', 'onehot')
        cols = self.preprocessing.get('categorical_columns', [])
        
        if not cols:
            return
            
        if method == 'onehot':
            encoder = OneHotEncoder(sparse=False, drop='first')
            encoded = encoder.fit_transform(self.df[cols])
            encoded_cols = encoder.get_feature_names_out(cols)
            encoded_df = pd.DataFrame(encoded, columns=encoded_cols)
            
            self.df = pd.concat([self.df.drop(cols, axis=1), encoded_df], axis=1)
            self.stats['columns_encoded'] = list(encoded_cols)
        else:  # ordinal or other methods would go here
            pass
            
        self.stats['columns_processed'] += len(cols)
    
    def _process_text_columns(self):
        cols = self.preprocessing.get('text_columns', [])
        remove_stop = self.preprocessing.get('remove_stopwords', False)
        lemmatize = self.preprocessing.get('lemmatize', False)
        method = self.preprocessing.get('text_vectorization', 'tfidf')
        
        if not cols:
            return
            
        # Basic English stop words list (can be expanded)
        stop_words = set([
            'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", 
            "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 
            'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', 
            "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 
            'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 
            'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 
            'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 
            'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 
            'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 
            'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 
            'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 
            'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 
            'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 
            'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 
            'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', 
            "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', 
            "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 
            'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', 
            "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', 
            "wouldn't"
        ]) if remove_stop else None
        
        for col in cols:
            if col not in self.df.columns:
                continue
                
            # Text cleaning
            self.df[col] = self.df[col].astype(str).apply(
                lambda x: self._clean_text(x, stop_words, lemmatize))
            
            # Vectorization
            if method == 'tfidf':
                vectorizer = TfidfVectorizer(max_features=100)
                vectors = vectorizer.fit_transform(self.df[col])
                vector_cols = [f"{col}_tfidf_{i}" for i in range(vectors.shape[1])]
                vector_df = pd.DataFrame(vectors.toarray(), columns=vector_cols)
                
                self.df = pd.concat([self.df.drop(col, axis=1), vector_df], axis=1)
                self.stats['columns_encoded'].extend(vector_cols)
        
        self.stats['columns_processed'] += len(cols)
    
    def _clean_text(self, text, stop_words=None, lemmatize=False):
        # Lowercase
        text = text.lower()
        # Remove special chars
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
        # Remove stopwords
        if stop_words:
            text = ' '.join([word for word in text.split() if word not in stop_words])
        # Basic lemmatization (can be enhanced with more rules)
        if lemmatize:
            text = ' '.join([self._simple_lemmatize(word) for word in text.split()])
        return text
    
    def _simple_lemmatize(self, word):
        # Basic lemmatization rules (can be expanded)
        if word.endswith('ing'):
            return word[:-3]
        elif word.endswith('ly'):
            return word[:-2]
        elif word.endswith('s'):
            return word[:-1]
        elif word.endswith('es'):
            return word[:-2]
        elif word.endswith('ed'):
            return word[:-2]
        return word
    
    def _reduce_dimensionality(self):
        method = self.preprocessing.get('reduction_method', 'pca')
        n_components = self.preprocessing.get('n_components', 10)
        cols = self.preprocessing.get('numeric_columns', [])
        
        if not cols or len(cols) <= n_components:
            return
            
        if method == 'pca':
            pca = PCA(n_components=n_components)
            reduced = pca.fit_transform(self.df[cols])
            reduced_cols = [f'pca_{i}' for i in range(n_components)]
            reduced_df = pd.DataFrame(reduced, columns=reduced_cols)
            
            self.df = pd.concat([self.df.drop(cols, axis=1), reduced_df], axis=1)
            self.stats['columns_processed'] += len(cols)
    
    def _handle_imbalance(self):
        method = self.preprocessing.get('imbalance_method', 'smote')
        target_col = self.preprocessing.get('target_column', '')
        
        if not target_col or target_col not in self.df.columns:
            return
            
        if method == 'smote':
            smote = SMOTE()
            X = self.df.drop(target_col, axis=1)
            y = self.df[target_col]
            X_res, y_res = smote.fit_resample(X, y)
            
            self.df = pd.concat([X_res, y_res], axis=1)
    
    def _remove_duplicates(self):
        initial_rows = len(self.df)
        self.df.drop_duplicates(inplace=True)
        self.stats['duplicates_removed'] = initial_rows - len(self.df)
    def _clean_raw_data(self):
        try:
            logger.info("Cleaning raw data")
            
            # Fix comma decimal numbers
            for col in self.df.select_dtypes(include=['object']).columns:
                self.df[col] = self.df[col].apply(
                    lambda x: str(x).replace(',', '.') if pd.notna(x) and isinstance(x, str) and re.match(r'^\d+,\d+$', str(x)) else x
                )
            
            # Convert numeric columns - more robust handling
            numeric_cols = self.preprocessing.get('numeric_columns', [])
            for col in numeric_cols:
                if col in self.df.columns:
                    try:
                        self.df[col] = pd.to_numeric(self.df[col], errors='coerce')
                    except Exception as e:
                        logger.error(f"Failed to convert {col} to numeric: {str(e)}")
                        # Try more aggressive cleaning if needed
                        self.df[col] = pd.to_numeric(
                            self.df[col].astype(str).str.replace('[^\d.]', '', regex=True),
                            errors='coerce'
                        )
            
            logger.info("Data cleaning completed")
        except Exception as e:
            logger.error(f"Error in _clean_raw_data: {str(e)}")
            raise
        