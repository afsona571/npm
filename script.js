import express from 'express';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import lineChartConfig from './charts/lineChart.js';
import barChartConfig from './charts/barChart.js';
import pieChartConfig from './charts/pieChart.js';
import radarChartConfig from './charts/radarChart.js';
import polarAreaChartConfig from './charts/polarAreaChart.js';

const app = express();
const port = 3000;
const width = 800;
const height = 600;

app.use(express.json());

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

const chartConfigs = {
    line: lineChartConfig,
    bar: barChartConfig,
    pie: pieChartConfig,
    radar: radarChartConfig,
    polarArea: polarAreaChartConfig
};

app.post('/generate-chart', async (req, res) => {
    try {
        const { type, data, options } = req.body;
        const chartConfig = chartConfigs[type];
        
        if (!chartConfig) {
            return res.status(400).send('Invalid chart type');
        }
        
        const configuration = chartConfig(data, options);
        
        const image = await chartJSNodeCanvas.renderToBuffer(configuration);
        
        res.setHeader('Content-Type', 'image/png');
        res.send(image);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating chart');
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the Chart API! Use POST /generate-chart to create a chart.');
});

app.listen(port, () => {
    console.log(`Chart API running at http://localhost:${port}`);
});
