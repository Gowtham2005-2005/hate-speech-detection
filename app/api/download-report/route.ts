import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { DetectionResult } from '@/components/hate-speech-dashboard';

export async function POST(request: NextRequest) {
  try {
    const data: DetectionResult = await request.json();
    
    // Create a browser instance
    const browser = await puppeteer.launch({
      headless: 'new',
    });
    
    // Create a new page
    const page = await browser.newPage();
    
    // Generate HTML for the PDF
    const html = generateReportHTML(data);
    
    // Set the HTML content
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });
    
    // Close the browser
    await browser.close();
    
    // Return the PDF
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="hate-speech-analysis-report.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

// Helper function to generate HTML for the PDF report
function generateReportHTML(result: DetectionResult) {
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  
  // Generate data for category breakdown chart
  const generateCategoryData = () => {
    // Generate category data based on the detection result
    const baseCategories = [
      { name: "Hate Speech", value: result.scores.hateSpeech * 100 },
      { name: "Offensive", value: result.scores.offensive * 100 },
    ];

    // Add additional categories based on the detection result
    if (result.isHateSpeech) {
      return [
        ...baseCategories,
        { name: "Threat", value: result.metrics.severity * 80 },
        { name: "Harassment", value: result.metrics.severity * 70 },
        { name: "Discrimination", value: result.metrics.severity * 90 },
      ];
    }

    return [
      ...baseCategories,
      { name: "Neutral", value: result.scores.neutral * 100 },
      { name: "Informative", value: result.scores.neutral * 90 },
      { name: "Positive", value: result.scores.neutral * 70 },
    ];
  };

  // Generate data for time trend analysis chart (simulated data)
  const generateTimeSeriesData = () => {
    const timePoints = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const hateSpeechTrend = timePoints.map(() => Math.random() * 30);
    const offensiveTrend = timePoints.map(() => Math.random() * 40 + 10);
    const neutralTrend = timePoints.map(() => Math.random() * 50 + 30);
    
    // Make the last point match the current analysis
    hateSpeechTrend[5] = result.scores.hateSpeech * 100;
    offensiveTrend[5] = result.scores.offensive * 100;
    neutralTrend[5] = result.scores.neutral * 100;
    
    return {
      labels: timePoints,
      hateSpeech: hateSpeechTrend,
      offensive: offensiveTrend,
      neutral: neutralTrend
    };
  };
  
  // Generate sentiment analysis data
  const generateSentimentData = () => {
    // Use the inverse of hate speech as positive sentiment base
    const positive = (1 - result.scores.hateSpeech) * 0.8;
    const negative = result.scores.hateSpeech * 0.9;
    const neutral = 1 - positive - negative;
    
    return [
      { name: "Positive", value: positive * 100 },
      { name: "Negative", value: negative * 100 },
      { name: "Neutral", value: neutral * 100 }
    ];
  };
  
  const categoryData = generateCategoryData();
  const timeSeriesData = generateTimeSeriesData();
  const sentimentData = generateSentimentData();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Hate Speech Analysis Report</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
      <style>
        * {
          box-sizing: border-box;
        }
        html, body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          color: #333;
          line-height: 1.5;
        }
        body {
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 10px;
          border-bottom: 1px solid #ddd;
        }
        .report-id {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid; /* Prevents charts from breaking across pages */
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #1a1a1a;
          padding-bottom: 5px;
          border-bottom: 1px solid #eee;
        }
        .result-box {
          padding: 15px;
          background-color: ${result.isHateSpeech ? '#fff2f2' : '#f2f9f2'};
          border: 1px solid ${result.isHateSpeech ? '#ffcccc' : '#ccf2cc'};
          border-radius: 4px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .result-label {
          font-weight: bold;
          font-size: 16px;
          color: ${result.isHateSpeech ? '#cc0000' : '#00cc00'};
          margin: 0 0 10px 0;
        }
        .metrics {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 20px;
        }
        .metric {
          flex: 1;
          min-width: 150px;
          background-color: #f8f8f8;
          padding: 12px;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .metric-label {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 5px;
          color: #555;
        }
        .metric-value {
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }
        .progress-container {
          height: 8px;
          background-color: #f0f0f0;
          border-radius: 4px;
          margin-top: 5px;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          border-radius: 4px;
          background-color: ${result.isHateSpeech ? '#cc0000' : '#00cc00'};
        }
        .message-box {
          background-color: #f8f8f8;
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          margin-right: 8px;
          background-color: ${result.isHateSpeech ? '#ffcccc' : '#ccf2cc'};
          color: ${result.isHateSpeech ? '#cc0000' : '#00cc00'};
        }
        .charts-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }
        .chart-container {
          flex: 1;
          min-width: 300px;
          height: 300px;
          padding: 15px;
          background-color: #f8f8f8;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          page-break-inside: avoid; /* Prevents a single chart from breaking across pages */
        }
        .chart-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          text-align: center;
          color: #444;
        }
        /* CSS-based charts */
        .css-bar-chart {
          display: flex;
          flex-direction: column;
          gap: 10px;
          height: 200px;
        }
        .css-bar-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .css-bar-label {
          width: 100px;
          font-size: 12px;
          text-align: right;
        }
        .css-bar-outer {
          flex: 1;
          height: 20px;
          background-color: #f0f0f0;
          border-radius: 4px;
        }
        .css-bar-inner {
          height: 100%;
          border-radius: 4px;
          background-color: ${result.isHateSpeech ? '#cc0000' : '#00cc00'};
          position: relative;
        }
        .css-bar-value {
          position: absolute;
          right: 5px;
          font-size: 11px;
          color: white;
          line-height: 20px;
        }
        /* CSS-based pie chart (for non-JS environments) */
        .pie-chart-container {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          margin-top: 20px;
        }
        .pie-chart-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 15px;
          justify-content: center;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
        }
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }
        .summary-box {
          background-color: #f8f8fa;
          border-left: 4px solid ${result.isHateSpeech ? '#cc0000' : '#00cc00'};
          padding: 15px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .summary-title {
          font-weight: bold;
          margin-bottom: 8px;
          font-size: 16px;
          color: #333;
        }
        .chart-row {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 20px;
          page-break-inside: avoid; /* Prevents a row of charts from breaking across pages */
        }
        .full-width-chart {
          width: 100%;
          height: 250px;
          padding: 15px;
          background-color: #f8f8f8;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          margin-bottom: 20px;
          page-break-inside: avoid; /* Prevents this chart from breaking across pages */
        }
        /* Last section should stick to the bottom of the last page */
        .footer {
          text-align: center;
          font-size: 12px;
          color: #666;
          padding-top: 10px;
          border-top: 1px solid #ddd;
          page-break-before: auto; /* Allow page break before footer if needed */
          /* The CSS below helps place the footer on the last page */
          position: running(footer);
        }
        
        @page {
          @bottom-center {
            content: element(footer);
          }
        }
        
        /* Hide fallback charts when JS is enabled */
        .js-enabled #fallbackScoreChart {
          display: none;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Hate Speech Analysis Report</h1>
        <p>Analysis completed on ${date} at ${time}</p>
        <p class="report-id">Analysis ID: HSA-${Math.floor(Math.random() * 1000000)}</p>
      </div>
      
      <div class="section">
        <div class="section-title">Detection Result</div>
        <div class="result-box">
          <p class="result-label">
            ${result.isHateSpeech ? '⚠️ Hate Speech Detected' : '✓ No Hate Speech Detected'}
          </p>
          <p>
            ${result.isHateSpeech 
              ? `This message was classified as hate speech with ${(result.metrics.confidence * 100).toFixed(1)}% confidence. The content contains language that targets specific groups or individuals in a harmful way.` 
              : `This message was classified as safe content with ${(result.metrics.confidence * 100).toFixed(1)}% confidence. No harmful or offensive content was detected.`}
          </p>
          ${result.metrics.targetGroup ? `<div class="badge">Target: ${result.metrics.targetGroup}</div>` : ''}
          ${result.metrics.category ? `<div class="badge">Category: ${result.metrics.category}</div>` : ''}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Analysis Metrics</div>
        <div class="metrics">
          <div class="metric">
            <div class="metric-label">Hate Speech Score</div>
            <div class="metric-value">${(result.scores.hateSpeech * 100).toFixed(1)}%</div>
            <div class="progress-container">
              <div class="progress-bar" style="width: ${result.scores.hateSpeech * 100}%"></div>
            </div>
          </div>
          
          <div class="metric">
            <div class="metric-label">Offensive Content</div>
            <div class="metric-value">${(result.scores.offensive * 100).toFixed(1)}%</div>
            <div class="progress-container">
              <div class="progress-bar" style="width: ${result.scores.offensive * 100}%"></div>
            </div>
          </div>
          
          <div class="metric">
            <div class="metric-label">Neutral Content</div>
            <div class="metric-value">${(result.scores.neutral * 100).toFixed(1)}%</div>
            <div class="progress-container">
              <div class="progress-bar" style="width: ${result.scores.neutral * 100}%"></div>
            </div>
          </div>
        </div>

        <div class="metrics">
          <div class="metric">
            <div class="metric-label">Confidence Score</div>
            <div class="metric-value">${(result.metrics.confidence * 100).toFixed(1)}%</div>
            <div class="progress-container">
              <div class="progress-bar" style="width: ${result.metrics.confidence * 100}%"></div>
            </div>
          </div>
          
          <div class="metric">
            <div class="metric-label">Severity Level</div>
            <div class="metric-value">${(result.metrics.severity * 100).toFixed(1)}%</div>
            <div class="progress-container">
              <div class="progress-bar" style="width: ${result.metrics.severity * 100}%"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Charts Section -->
      <div class="section">
        <div class="section-title">Analysis Charts</div>
        
        <!-- First row of charts -->
        <div class="chart-row">
          <!-- Chart 1: Score Distribution -->
          <div class="chart-container">
            <div class="chart-title">Score Distribution</div>
            <div style="position: relative; height: 220px;">
              <canvas id="scoreChart"></canvas>
            </div>
            
            <!-- Fallback CSS chart if JavaScript is disabled -->
            <div class="css-bar-chart" id="fallbackScoreChart">
              <div class="css-bar-item">
                <div class="css-bar-label">Hate Speech</div>
                <div class="css-bar-outer">
                  <div class="css-bar-inner" style="width: ${result.scores.hateSpeech * 100}%">
                    <div class="css-bar-value">${(result.scores.hateSpeech * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
              <div class="css-bar-item">
                <div class="css-bar-label">Offensive</div>
                <div class="css-bar-outer">
                  <div class="css-bar-inner" style="width: ${result.scores.offensive * 100}%">
                    <div class="css-bar-value">${(result.scores.offensive * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
              <div class="css-bar-item">
                <div class="css-bar-label">Neutral</div>
                <div class="css-bar-outer">
                  <div class="css-bar-inner" style="width: ${result.scores.neutral * 100}%">
                    <div class="css-bar-value">${(result.scores.neutral * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Chart 2: Category Breakdown -->
          <div class="chart-container">
            <div class="chart-title">Category Breakdown</div>
            <div style="position: relative; height: 220px;">
              <canvas id="categoryChart"></canvas>
            </div>
            
            <!-- Category Legend (for both JS and non-JS views) -->
            <div class="pie-chart-legend">
              ${categoryData.map((category, index) => {
                const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
                return `
                  <div class="legend-item">
                    <div class="legend-color" style="background-color: ${colors[index % colors.length]}"></div>
                    <div>${category.name}: ${category.value.toFixed(1)}%</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
        
        <!-- Second row of charts -->
        <div class="chart-row">
          <!-- Chart 3: Sentiment Analysis -->
          <div class="chart-container">
            <div class="chart-title">Sentiment Analysis</div>
            <div style="position: relative; height: 220px;">
              <canvas id="sentimentChart"></canvas>
            </div>
            
            <!-- Sentiment Legend -->
            <div class="pie-chart-legend">
              ${sentimentData.map((sentiment, index) => {
                const colors = ['#4BC0C0', '#FF6384', '#FFCE56'];
                return `
                  <div class="legend-item">
                    <div class="legend-color" style="background-color: ${colors[index % colors.length]}"></div>
                    <div>${sentiment.name}: ${sentiment.value.toFixed(1)}%</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
          
          <!-- Chart 4: Radar Chart for Content Analysis -->
          <div class="chart-container">
            <div class="chart-title">Content Analysis</div>
            <div style="position: relative; height: 220px;">
              <canvas id="radarChart"></canvas>
            </div>
          </div>
        </div>
        
        <!-- Full width time series chart -->
        <div class="full-width-chart">
          <div class="chart-title">Content Analysis Over Time</div>
          <div style="position: relative; height: 220px;">
            <canvas id="timeSeriesChart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Analysis Summary</div>
        <div class="summary-box">
          <div class="summary-title">Key Findings</div>
          <p>
            ${result.isHateSpeech 
              ? `The content analysis indicates a significant presence of hate speech indicators (${(result.scores.hateSpeech * 100).toFixed(1)}%). 
                 The severity level is ${(result.metrics.severity * 100).toFixed(1)}%, which suggests ${result.metrics.severity > 0.7 ? 'high' : result.metrics.severity > 0.4 ? 'moderate' : 'low'} potential for harm.
                 The content should be flagged for further review and potentially removed from public platforms.` 
              : `The content analysis shows minimal hate speech indicators (${(result.scores.hateSpeech * 100).toFixed(1)}%). 
                 The content appears to be primarily ${result.scores.neutral > result.scores.offensive ? 'neutral/informative' : 'mildly offensive but not hateful'} in nature.
                 No immediate action is required, though monitoring similar content patterns may be advisable.`}
          </p>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Message Content</div>
        <div class="message-box">
          ${result.message}
        </div>
        
        <!-- Added spacer to ensure footer is at the bottom of the last page -->
        <div style="height: 40px;"></div>
      </div>
      
      <!-- Footer will only be rendered on the last page -->
      <div class="footer">
        <p>This report was automatically generated by the Hate Speech Detection System.</p>
        <p>© ${new Date().getFullYear()} Sathyabama Institute of Science and Technology</p>
      </div>
      
      <script>
        // Mark document as JS-enabled
        document.body.classList.add('js-enabled');
        
        // Chart colors
        const chartColors = {
          hateSpeech: '${result.scores.hateSpeech > 0.5 ? '#cc0000' : '#FF6384'}',
          offensive: '${result.scores.offensive > 0.7 ? '#FF9F40' : '#36A2EB'}',
          neutral: '#4BC0C0',
          positive: '#4BC0C0',
          negative: '#FF6384',
          threat: '#9966FF',
          harassment: '#FF9F40',
          discrimination: '#FF6384'
        };
        
        // Chart.js implementation for Score Distribution
        const scoreCtx = document.getElementById('scoreChart').getContext('2d');
        new Chart(scoreCtx, {
          type: 'bar',
          data: {
            labels: ['Hate Speech', 'Offensive', 'Neutral'],
            datasets: [{
              label: 'Score (%)',
              data: [
                ${(result.scores.hateSpeech * 100).toFixed(1)}, 
                ${(result.scores.offensive * 100).toFixed(1)}, 
                ${(result.scores.neutral * 100).toFixed(1)}
              ],
              backgroundColor: [
                chartColors.hateSpeech,
                chartColors.offensive,
                chartColors.neutral
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: 'Percentage'
                }
              }
            }
          }
        });
        
        // Chart.js implementation for Category Breakdown
        const categoryCtx = document.getElementById('categoryChart').getContext('2d');
        new Chart(categoryCtx, {
          type: 'pie',
          data: {
            labels: [${categoryData.map(cat => `'${cat.name}'`).join(', ')}],
            datasets: [{
              data: [${categoryData.map(cat => cat.value.toFixed(1)).join(', ')}],
              backgroundColor: [
                '#FF6384', 
                '#36A2EB', 
                '#FFCE56', 
                '#4BC0C0', 
                '#9966FF', 
                '#FF9F40'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
                position: 'bottom'
              }
            }
          }
        });
        
        // Chart.js implementation for Sentiment Analysis
        const sentimentCtx = document.getElementById('sentimentChart').getContext('2d');
        new Chart(sentimentCtx, {
          type: 'doughnut',
          data: {
            labels: [${sentimentData.map(s => `'${s.name}'`).join(', ')}],
            datasets: [{
              data: [${sentimentData.map(s => s.value.toFixed(1)).join(', ')}],
              backgroundColor: [
                chartColors.positive,
                chartColors.negative,
                '#FFCE56'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
                position: 'bottom'
              }
            }
          }
        });
        
        // Chart.js implementation for Radar Chart
        const radarCtx = document.getElementById('radarChart').getContext('2d');
        new Chart(radarCtx, {
          type: 'radar',
          data: {
            labels: ['Hate Speech', 'Offensive', 'Neutral', 'Explicit', 'Threatening', 'Discriminatory'],
            datasets: [{
              label: 'Content Analysis',
              data: [
                ${(result.scores.hateSpeech * 100).toFixed(1)},
                ${(result.scores.offensive * 100).toFixed(1)},
                ${(result.scores.neutral * 100).toFixed(1)},
                ${(result.isHateSpeech ? result.metrics.severity * 85 : result.scores.offensive * 60).toFixed(1)},
                ${(result.isHateSpeech ? result.metrics.severity * 75 : result.scores.offensive * 40).toFixed(1)},
                ${(result.isHateSpeech ? result.metrics.severity * 95 : result.scores.offensive * 30).toFixed(1)}
              ],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgb(255, 99, 132)',
              pointBackgroundColor: 'rgb(255, 99, 132)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(255, 99, 132)'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                min: 0,
                max: 100,
                beginAtZero: true,
                ticks: {
                  stepSize: 20
                }
              }
            }
          }
        });
        
        // Chart.js implementation for Time Series
        const timeSeriesCtx = document.getElementById('timeSeriesChart').getContext('2d');
        new Chart(timeSeriesCtx, {
          type: 'line',
          data: {
            labels: ${JSON.stringify(timeSeriesData.labels)},
            datasets: [
              {
                label: 'Hate Speech',
                data: ${JSON.stringify(timeSeriesData.hateSpeech)},
                borderColor: chartColors.hateSpeech,
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                tension: 0.4,
                fill: true
              },
              {
                label: 'Offensive',
                data: ${JSON.stringify(timeSeriesData.offensive)},
                borderColor: chartColors.offensive,
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                tension: 0.4,
                fill: true
              },
              {
                label: 'Neutral',
                data: ${JSON.stringify(timeSeriesData.neutral)},
                borderColor: chartColors.neutral,
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                tension: 0.4,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: 'Score (%)'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Time Period'
                }
              }
            },
            plugins: {
              legend: {
                position: 'top'
              },
              tooltip: {
                mode: 'index',
                intersect: false
              }
            },
            interaction: {
              mode: 'nearest',
              intersect: false
            }
          }
        });
      </script>
    </body>
    </html>
  `;
}