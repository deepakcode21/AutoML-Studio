import React from 'react';
import { Bar, Scatter } from 'react-chartjs-2';
import {
    Card,
    CardHeader,
    CardContent,
    Grid,
    Typography,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box
} from '@mui/material';

const Dashboard2 = ({ dataAnalysis = {} }) => {
    // Safely destructure with defaults
    const {
        feature_statistics = {},
        correlations = {},
        missing_values = {},
        data_quality = {},
        distributions = {}
    } = dataAnalysis;

    // Prepare feature statistics chart data
    const featureStatsData = {
        labels: Object.keys(feature_statistics),
        datasets: [
            {
                label: 'Mean Values',
                data: Object.values(feature_statistics).map(stat => stat.mean),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Standard Deviation',
                data: Object.values(feature_statistics).map(stat => stat.std),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    };

    // Prepare correlation data
    const correlationData = {
        labels: Object.keys(correlations),
        datasets: [{
            label: 'Correlation Coefficient',
            data: Object.values(correlations),
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
        }]
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 2 }}>
            {/* Data Quality Overview */}
            <Card>
                <CardHeader title="Data Quality Summary" />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                            <Typography variant="body2" color="textSecondary">Total Features</Typography>
                            <Typography variant="h6">{data_quality.total_features || 0}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="body2" color="textSecondary">Numeric Features</Typography>
                            <Typography variant="h6">{data_quality.numeric_features || 0}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="body2" color="textSecondary">Missing Values</Typography>
                            <Typography variant="h6">{data_quality.total_missing || 0}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="body2" color="textSecondary">Constant Features</Typography>
                            <Typography variant="h6">{data_quality.constant_features?.length || 0}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Feature Statistics */}
            {Object.keys(feature_statistics).length > 0 && (
                <Card>
                    <CardHeader title="Feature Statistics" />
                    <CardContent>
                        <Box sx={{ height: '400px' }}>
                            <Bar
                                data={featureStatsData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            beginAtZero: false,
                                            title: {
                                                display: true,
                                                text: 'Value'
                                            }
                                        }
                                    },
                                    plugins: {
                                        tooltip: {
                                            callbacks: {
                                                afterLabel: function(context) {
                                                    const stats = feature_statistics[context.label];
                                                    return [
                                                        `Median: ${stats.median.toFixed(2)}`,
                                                        `Range: ${stats.min.toFixed(2)} to ${stats.max.toFixed(2)}`,
                                                        `Skewness: ${stats.skew.toFixed(2)}`,
                                                        `Kurtosis: ${stats.kurtosis.toFixed(2)}`,
                                                        `Zero values: ${stats.zeros}`,
                                                        `Negative values: ${stats.negatives}`
                                                    ];
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Top Correlations */}
            {Object.keys(correlations).length > 0 && (
                <Card>
                    <CardHeader title="Top Feature Correlations" />
                    <CardContent>
                        <Box sx={{ height: '500px' }}>
                            <Bar
                                data={correlationData}
                                options={{
                                    indexAxis: 'y',
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        x: {
                                            min: 0,
                                            max: 1,
                                            title: {
                                                display: true,
                                                text: 'Correlation Coefficient'
                                            }
                                        }
                                    }
                                }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Missing Values Table */}
            {Object.keys(missing_values).length > 0 && (
                <Card>
                    <CardHeader title="Missing Values Analysis" />
                    <CardContent>
                        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Feature</TableCell>
                                        <TableCell align="right">Missing Values</TableCell>
                                        <TableCell align="right">% Missing</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(missing_values)
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([feature, count]) => (
                                            <TableRow 
                                                key={feature}
                                                sx={{ 
                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                    bgcolor: count > 0 ? 'rgba(255, 152, 0, 0.1)' : 'inherit'
                                                }}
                                            >
                                                <TableCell>{feature}</TableCell>
                                                <TableCell align="right">{count}</TableCell>
                                                <TableCell align="right">
                                                    {(count / data_quality.total_features * 100).toFixed(1)}%
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default Dashboard2;