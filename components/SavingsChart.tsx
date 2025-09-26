import React, { useState } from 'react';
import { Transaction } from '../types';
import { getSavingsAnalysis } from '../services/ibmGraniteService';
import { SparklesIcon } from './icons';

interface SavingsChartProps {
    transactions: Transaction[];
}

const SavingsChart: React.FC<SavingsChartProps> = ({ transactions }) => {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        return d;
    }).reverse();

    const dailySavings = last7Days.map(date => {
        const dayStart = date.getTime();
        const dayEnd = dayStart + (24 * 60 * 60 * 1000) - 1;
        const savingsForDay = transactions
            .filter(t => t.roundedAmount && new Date(t.date).getTime() >= dayStart && new Date(t.date).getTime() <= dayEnd)
            .reduce((sum, t) => sum + (t.roundedAmount || 0), 0);
        return {
            date: date,
            savings: savingsForDay,
        };
    });

    const cumulativeSavings = dailySavings.reduce((acc, day, index) => {
        const prevTotal = index > 0 ? acc[index - 1].cumulative : 0;
        acc.push({
            ...day,
            cumulative: prevTotal + day.savings,
            dayLabel: day.date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
        });
        return acc;
    }, [] as { date: Date; savings: number; cumulative: number; dayLabel: string }[]);
    
    const totalSavingsThisWeek = cumulativeSavings.length > 0 ? cumulativeSavings[cumulativeSavings.length - 1].cumulative : 0;
    const minVal = 0;
    const maxVal = Math.max(1, ...cumulativeSavings.map(d => d.cumulative));

    const handleAnalyze = async () => {
        setLoadingAnalysis(true);
        setAnalysis(null);
        try {
            // FIX: Convert Date object to ISO string to match getSavingsAnalysis signature.
            const dataForAnalysis = dailySavings.map(day => ({
                date: day.date.toISOString(),
                savings: day.savings,
            }));
            const result = await getSavingsAnalysis(dataForAnalysis);
            setAnalysis(result);
        } catch (error) {
            setAnalysis("Sorry, we couldn't analyze your savings right now.");
        } finally {
            setLoadingAnalysis(false);
        }
    };
    
    // SVG utility functions
    const SVG_WIDTH = 300;
    const SVG_HEIGHT = 160;
    const pointToCoords = (point: number, index: number) => {
        const x = (index / (cumulativeSavings.length - 1)) * SVG_WIDTH;
        const y = SVG_HEIGHT - (point / maxVal) * SVG_HEIGHT;
        return [x, y];
    };

    const linePath = cumulativeSavings.map((p, i) => pointToCoords(p.cumulative, i)).reduce((acc, point, i) => {
        if (i === 0) return `M ${point[0]},${point[1]}`;
        return `${acc} L ${point[0]},${point[1]}`;
    }, '');

    const areaPath = `${linePath} L ${SVG_WIDTH},${SVG_HEIGHT} L 0,${SVG_HEIGHT} Z`;

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Savings Growth (Last 7 Days)</h3>
            {totalSavingsThisWeek > 0 ? (
                <div className="flex items-center mt-4">
                    <div className="flex flex-col justify-between h-40 text-xs text-right text-gray-400 dark:text-gray-500" style={{width: '40px'}}>
                        <span>₹{maxVal.toFixed(0)}</span>
                        <span>₹{(maxVal / 2).toFixed(0)}</span>
                        <span>₹{minVal}</span>
                    </div>
                    <div className="flex-1">
                        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-40" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#059669" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Grid lines */}
                            <line x1="0" y1={SVG_HEIGHT} x2={SVG_WIDTH} y2={SVG_HEIGHT} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="1"/>
                            <line x1="0" y1={SVG_HEIGHT / 2} x2={SVG_WIDTH} y2={SVG_HEIGHT / 2} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="1" strokeDasharray="2,3"/>
                            <line x1="0" y1="0" x2={SVG_WIDTH} y2="0" stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="1"/>
                            
                            {/* Chart */}
                            <path d={areaPath} fill="url(#areaGradient)" />
                            <path d={linePath} fill="none" stroke="#059669" strokeWidth="2" />

                            {/* Data points and tooltips */}
                            {cumulativeSavings.map((p, i) => {
                                const [x, y] = pointToCoords(p.cumulative, i);
                                return (
                                    <g key={i} className="group">
                                        <circle cx={x} cy={y} r="6" className="fill-transparent" />
                                        <circle cx={x} cy={y} r="3" className="transition-opacity duration-200 fill-white dark:fill-gray-800 stroke-primary" strokeWidth="2" />
                                        <foreignObject x={x-50} y={y-40} width="100" height="30" className="hidden group-hover:block">
                                            <div className="px-2 py-1 text-xs text-center text-white bg-gray-900 rounded-md">
                                                ₹{p.cumulative.toFixed(2)}
                                            </div>
                                        </foreignObject>
                                    </g>
                                );
                            })}
                        </svg>
                        <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                           {cumulativeSavings.map(d => <span key={d.dayLabel}>{d.dayLabel}</span>)}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-40 mt-4 text-center text-gray-500 dark:text-gray-400">
                    <p>No savings activity in the last 7 days. Make a payment to start saving!</p>
                </div>
            )}

            <div className="mt-4">
                <button 
                    onClick={handleAnalyze} 
                    disabled={loadingAnalysis}
                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md bg-primary-dark hover:bg-primary disabled:opacity-50 disabled:cursor-wait"
                >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {loadingAnalysis ? 'Analyzing...' : 'Analyze Savings with Granite AI'}
                </button>
            </div>

            {loadingAnalysis && (
                 <div className="flex justify-center items-center h-20">
                    <div className="w-6 h-6 border-2 rounded-full border-primary border-t-transparent animate-spin"></div>
                </div>
            )}

            {analysis && (
                <div className="p-3 mt-4 text-sm text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-300">
                    <p>{analysis}</p>
                    <p className="mt-2 text-xs text-right text-gray-500 dark:text-gray-400">Powered by IBM Granite</p>
                </div>
            )}
        </div>
    );
};

export default SavingsChart;