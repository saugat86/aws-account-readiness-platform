import React from 'react';
import { ReadinessScore as IReadinessScore } from '@aws-readiness/shared';

interface Props {
    score: IReadinessScore;
}

export const ReadinessScore: React.FC<Props> = ({ score }) => {
    const getScoreColor = (value: number) => {
        if (value >= 0.8) return 'text-green-600';
        if (value >= 0.6) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreLabel = (value: number) => {
        if (value >= 0.9) return 'Excellent';
        if (value >= 0.8) return 'Good';
        if (value >= 0.6) return 'Fair';
        return 'Needs Improvement';
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">AWS Account Readiness Score</h2>

            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-medium">Overall Score</span>
                    <span className={`text-2xl font-bold ${getScoreColor(score.overall)}`}>
                        {Math.round(score.overall * 100)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full ${score.overall >= 0.8 ? 'bg-green-500' :
                                score.overall >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                        style={{ width: `${score.overall * 100}%` }}
                    />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    {getScoreLabel(score.overall)}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {Object.entries(score.categories).map(([category, value]) => (
                    <div key={category} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium capitalize">
                                {category.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className={`font-bold ${getScoreColor(value)}`}>
                                {Math.round(value * 100)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${value >= 0.8 ? 'bg-green-500' :
                                        value >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${value * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {score.recommendations.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                    <ul className="space-y-2">
                        {score.recommendations.map((recommendation, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                <span className="text-gray-700">{recommendation}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};