import React, { useState } from 'react';
import { Bell, TrendingUp, PieChart } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import styles from './Overview.module.css';

const Overview: React.FC = () => {
  const [timeframe, setTimeframe] = useState('7d');
  const [dataType, setDataType] = useState('daily');

  const stats = [
    { title: 'Total Uploads', value: 5 },
    { title: 'Uploads Today', value: 2 },
    { title: 'File Size Limit', value: '100MB' },
    { title: 'Used Space', value: '73.46MB' },
    { title: 'Free Space', value: '950.54MB' }
  ];

  const uploadData = [
    { date: 'Apr 04', uploads: 3 },
    { date: 'Apr 05', uploads: 1 },
    { date: 'Apr 06', uploads: 2 },
    { date: 'Apr 07', uploads: 0 },
    { date: 'Apr 08', uploads: 1 },
    { date: 'Apr 09', uploads: 4 },
    { date: 'Apr 10', uploads: 2 }
  ];

  const fileTypeData = [
    { type: 'Videos', count: 3, color: '#ff4d8d' },
    { type: 'Images', count: 2, color: '#ff6bb5' }
  ];

  return (
    <Layout>
      <div className={styles.overviewPage}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Overview</h1>
          <button className={`btn-icon ${styles.notificationBtn}`}>
            <Bell size={20} style={{ color: '#ff4d8d' }} />
          </button>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <h3 className={styles.statTitle}>{stat.title}</h3>
              <p className={styles.statValue}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className={styles.chartsSection}>
          {/* Upload Analytics Chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitle}>
                <TrendingUp size={20} style={{ color: '#ff4d8d' }} />
                <h2>Upload Analytics</h2>
              </div>
              <div className={styles.chartControls}>
                <div className={styles.timeframeButtons}>
                  {['24h', '7d', '14d', '30d', 'All'].map((period) => (
                    <button
                      key={period}
                      className={`${styles.timeframeBtn} ${timeframe === period ? styles.active : ''}`}
                      onClick={() => setTimeframe(period)}
                    >
                      {period}
                    </button>
                  ))}
                </div>
                <div className={styles.dataTypeButtons}>
                  <button
                    className={`${styles.dataTypeBtn} ${dataType === 'daily' ? styles.active : ''}`}
                    onClick={() => setDataType('daily')}
                  >
                    Daily
                  </button>
                  <button
                    className={`${styles.dataTypeBtn} ${dataType === 'cumulative' ? styles.active : ''}`}
                    onClick={() => setDataType('cumulative')}
                  >
                    Cumulative
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.chartContent}>
              <div className={styles.lineChart}>
                {uploadData.map((data, index) => (
                  <div key={index} className={styles.chartBar}>
                    <div
                      className={styles.bar}
                      style={{
                        height: `${(data.uploads / 4) * 100}%`,
                        backgroundColor: '#ff4d8d'
                      }}
                    />
                    <div className={styles.chartLabel}>{data.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* File Types Chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitle}>
                <PieChart size={20} style={{ color: '#ff4d8d' }} />
                <h2>File Types</h2>
              </div>
            </div>
            <div className={styles.chartContent}>
              <div className={styles.donutChart}>
                <div className={styles.donut}>
                  <div className={styles.donutSegment} style={{ background: '#ff4d8d', clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%, 50% 50%)' }} />
                  <div className={styles.donutSegment} style={{ background: '#ff6bb5', clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%, 50% 50%)' }} />
                </div>
                <div className={styles.chartCenter}>
                  <div className={styles.totalFiles}>Total</div>
                  <div className={styles.totalCount}>4 Files</div>
                </div>
              </div>
              <div className={styles.fileTypeLegend}>
                {fileTypeData.map((type, index) => (
                  <div key={index} className={styles.legendItem}>
                    <div
                      className={styles.legendColor}
                      style={{ backgroundColor: type.color }}
                    />
                    <span className={styles.legendLabel}>{type.type}</span>
                    <span className={styles.legendCount}>{type.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* General Customization Section */}
        <div className={styles.customizationSection}>
          <h2 className={styles.sectionTitle}>General Customization</h2>
          <div className={styles.customizationContent}>
            <p className={styles.placeholderText}>
              Customization options will be available here soon.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Overview;
