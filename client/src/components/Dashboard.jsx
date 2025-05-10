import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {
    Card,
    CardHeader,
    CardContent,
    Grid,
    Typography,
    Box,
    Paper,
    useTheme,
    Divider
} from '@mui/material';
import DatasetIcon from '@mui/icons-material/Dataset';
import StartIcon from '@mui/icons-material/PlayArrow';
import EndIcon from '@mui/icons-material/Stop';
import WarningIcon from '@mui/icons-material/Warning';
import DeleteIcon from '@mui/icons-material/Delete';
import NumbersIcon from '@mui/icons-material/Numbers';
import CategoryIcon from '@mui/icons-material/Category';
import ModelIcon from '@mui/icons-material/Assessment';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DataObjectIcon from '@mui/icons-material/DataObject';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const MetricItem = ({ label, value, icon, unit = '', color = 'primary' }) => {
    const theme = useTheme();
    
    return (
        <Paper elevation={0} sx={{
            p: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'background.default',
            borderRadius: '12px',
            border: `1px solid ${theme.palette.divider}`,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[2]
            }
        }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
                {icon && React.cloneElement(icon, { 
                    sx: { 
                        color: theme.palette[color].main,
                        fontSize: '1.2rem' 
                    } 
                })}
                <Typography 
                    variant="body2" 
                    color="text.secondary"
                    fontWeight="500"
                >
                    {label}
                </Typography>
            </Box>
            <Typography 
                variant="h5" 
                fontWeight={600}
                color="text.primary"
                sx={{ mt: 0.5 }}
            >
                {value !== undefined && value !== null ? 
                    value.toLocaleString() + (unit ? ` ${unit}` : '') : 
                    'N/A'}
            </Typography>
        </Paper>
    );
};

const Dashboard = ({ metrics = {}, dashboardMetrics = {} }) => {
    const theme = useTheme();
    
    // Safely extract metrics with defaults
    const {
        rmse = 0,
        r2 = 0,
        mae = 0,
        explained_variance = 0,
        max_error = 0,
        mape = 0,
        training_samples = 0,
        testing_samples = 0,
        feature_importances = {}
    } = metrics;

    // Safely extract dashboard metrics with defaults
    const {
        model_performance = {},
        data_quality = {},
        feature_analysis = {}
    } = dashboardMetrics || {};

    // Performance chart data
    const performanceData = {
        labels: ['RMSE', 'MAE', 'R²', 'Explained Variance', 'Max Error', 'MAPE'],
        datasets: [{
            label: 'Performance Metrics',
            data: [rmse, mae, r2, explained_variance, max_error, mape],
            backgroundColor: [
                theme.palette.error.main,
                theme.palette.warning.main,
                theme.palette.success.main,
                theme.palette.info.main,
                theme.palette.error.dark,
                theme.palette.warning.dark
            ],
            borderColor: [
                theme.palette.error.dark,
                theme.palette.warning.dark,
                theme.palette.success.dark,
                theme.palette.info.dark,
                theme.palette.error.darker,
                theme.palette.warning.darker
            ],
            borderWidth: 1
        }]
    };

    // Feature importance data
    const featureImportanceData = {
        labels: Object.keys(feature_importances),
        datasets: [{
            label: 'Feature Importance',
            data: Object.values(feature_importances),
            backgroundColor: theme.palette.primary.light,
            borderColor: theme.palette.primary.main,
            borderWidth: 1
        }]
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: { xs: 1, sm: 2 } }}>
            {/* Performance Metrics Section */}
            <Grid container spacing={3}>
                {/* Performance Chart */}
                <Grid item xs={12} md={8}>
                    <Card sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '12px',
                        boxShadow: 'none',
                        border: `1px solid ${theme.palette.divider}`
                    }}>
                        <CardHeader 
                            title="Model Performance" 
                            avatar={<ModelIcon color="primary" />}
                            titleTypographyProps={{
                                variant: 'h6',
                                fontWeight: 600
                            }}
                        />
                        <Divider />
                        <CardContent sx={{ flex: 1, p: 0 }}>
                            <Box sx={{ height: '300px', p: 2 }}>
                                <Bar
                                    data={performanceData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                grid: {
                                                    color: theme.palette.divider
                                                }
                                            },
                                            x: {
                                                grid: {
                                                    display: false
                                                }
                                            }
                                        },
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                            tooltip: {
                                                mode: 'index',
                                                intersect: false
                                            }
                                        }
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Quick Stats */}
                <Grid item xs={12} md={4}>
                    <Card sx={{
                        height: '100%',
                        borderRadius: '12px',
                        boxShadow: 'none',
                        border: `1px solid ${theme.palette.divider}`
                    }}>
                        <CardHeader 
                            title="Quick Stats" 
                            avatar={<ShowChartIcon color="secondary" />}
                            titleTypographyProps={{
                                variant: 'h6',
                                fontWeight: 600
                            }}
                        />
                        <Divider />
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <MetricItem 
                                        label="R² Score" 
                                        value={r2} 
                                        icon={<NumbersIcon />}
                                        color="success"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <MetricItem 
                                        label="RMSE" 
                                        value={rmse} 
                                        icon={<WarningIcon />}
                                        color="error"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <MetricItem 
                                        label="MAE" 
                                        value={mae} 
                                        icon={<WarningIcon />}
                                        color="warning"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <MetricItem 
                                        label="Explained Variance" 
                                        value={explained_variance} 
                                        icon={<ShowChartIcon />}
                                        color="info"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Data Quality Section */}
            <Card sx={{
                borderRadius: '12px',
                boxShadow: 'none',
                border: `1px solid ${theme.palette.divider}`
            }}>
                <CardHeader 
                    title="Data Quality Metrics" 
                    avatar={<DataObjectIcon color="info" />}
                    titleTypographyProps={{
                        variant: 'h6',
                        fontWeight: 600
                    }}
                />
                <Divider />
                <CardContent>
                    <Grid container spacing={2}>
                        {/* Dataset Size */}
                        <Grid item xs={12} md={6}>
                            <Typography 
                                variant="subtitle2" 
                                color="text.secondary"
                                fontWeight="500"
                                gutterBottom
                            >
                                Dataset Size
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <MetricItem 
                                        label="Training Samples" 
                                        value={training_samples} 
                                        icon={<DatasetIcon />}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <MetricItem 
                                        label="Testing Samples" 
                                        value={testing_samples} 
                                        icon={<DatasetIcon />}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <MetricItem 
                                        label="Initial Rows" 
                                        value={data_quality?.initial_rows} 
                                        icon={<StartIcon />}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <MetricItem 
                                        label="Final Rows" 
                                        value={data_quality?.final_rows} 
                                        icon={<EndIcon />}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Data Quality */}
                        <Grid item xs={12} md={6}>
                            <Typography 
                                variant="subtitle2" 
                                color="text.secondary"
                                fontWeight="500"
                                gutterBottom
                            >
                                Data Quality
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <MetricItem 
                                        label="Missing Values" 
                                        value={data_quality?.missing_values?.before} 
                                        icon={<WarningIcon />}
                                        color="warning"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <MetricItem 
                                        label="After Cleaning" 
                                        value={data_quality?.missing_values?.after} 
                                        icon={<WarningIcon />}
                                        color="success"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <MetricItem 
                                        label="Dropped Columns" 
                                        value={data_quality?.dropped_columns} 
                                        icon={<DeleteIcon />}
                                        color="error"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <MetricItem 
                                        label="Numeric Features" 
                                        value={data_quality?.feature_types?.numeric} 
                                        icon={<NumbersIcon />}
                                        color="info"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Feature Importance - Only show if we have feature importances */}
            {Object.keys(feature_importances).length > 0 && (
                <Card sx={{
                    borderRadius: '12px',
                    boxShadow: 'none',
                    border: `1px solid ${theme.palette.divider}`
                }}>
                    <CardHeader 
                        title="Feature Importance" 
                        titleTypographyProps={{
                            variant: 'h6',
                            fontWeight: 600
                        }}
                    />
                    <Divider />
                    <CardContent>
                        <Box sx={{ height: '400px' }}>
                            <Bar
                                data={featureImportanceData}
                                options={{
                                    indexAxis: 'y',
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        x: {
                                            beginAtZero: true,
                                            grid: {
                                                color: theme.palette.divider
                                            }
                                        },
                                        y: {
                                            grid: {
                                                display: false
                                            }
                                        }
                                    },
                                    plugins: {
                                        legend: {
                                            display: false
                                        },
                                        tooltip: {
                                            mode: 'index',
                                            intersect: false
                                        }
                                    }
                                }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default Dashboard;