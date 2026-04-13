import React, { useState } from 'react';
import { TrendingUp, PieChart, Upload, Calendar, File, HardDrive, Circle, Video, ImageIcon } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import styles from './Overview.module.css';

const Overview: React.FC = () => {
  const [timeframe, setTimeframe] = useState('7d');
  const [dataType, setDataType] = useState('daily');

  const stats = [
    { title: 'Vídeos', value: 3 },
    { title: 'Imagens', value: 2 },
    { title: 'Envios Hoje', value: 0 },
    { title: 'Limite de Tamanho', value: '100MB' },
    { title: 'Espaço Usado', value: '73.46MB' }
  ];

  const getStatIcon = (title: string) => {
    if (title === 'Vídeos') return <Video size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Imagens') return <ImageIcon size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Envios Hoje') return <Calendar size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Limite de Tamanho') return <File size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Espaço Usado') return <HardDrive size={16} style={{ color: '#ff4d8d' }} />;
    return <Circle size={16} style={{ color: '#ff4d8d' }} />;
  };

  const uploadData = [
    { date: '04 Abr', uploads: 3 },
    { date: '05 Abr', uploads: 1 },
    { date: '06 Abr', uploads: 2 },
    { date: '07 Abr', uploads: 0 },
    { date: '08 Abr', uploads: 1 },
    { date: '09 Abr', uploads: 4 },
    { date: '10 Abr', uploads: 2 }
  ];

  const fileTypeData = [
    { type: 'Vídeos', count: 3, color: '#ff4d8d' },
    { type: 'Imagens', count: 2, color: '#ff6bb5' }
  ];

  return (
    <Layout>
      <div className={styles.overviewPage}>
        {/* Header */}
        {false && (
          <div className={styles.header}>
            <h1 className={styles.pageTitle}>Overview</h1>
          </div>
        )}

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statIcon}>{getStatIcon(stat.title)}</span>
                <h3 className={styles.statTitle}>{stat.title}</h3>
              </div>
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
                <h2>Análise de Envios</h2>
              </div>
              <div className={styles.chartControls}>
                <div className={styles.timeframeButtons}>
                  {['24h', '7d', '14d', '30d', 'Tudo'].map((period) => (
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
                    Diário
                  </button>
                  <button
                    className={`${styles.dataTypeBtn} ${dataType === 'cumulative' ? styles.active : ''}`}
                    onClick={() => setDataType('cumulative')}
                  >
                    Acumulado
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
                <h2>Tipos de Arquivo</h2>
              </div>
            </div>
            <div className={styles.chartContent}>
              <div className={styles.donutChart}>
                <div className={styles.donut}>
                  <div className={styles.donutSegment} style={{ background: '#ff4d8d', clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%, 50% 50%)' }} />
                  <div className={styles.donutSegment} style={{ background: '#ff6bb5', clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%, 50% 50%)' }} />
                  <div className={styles.chartCenter}>
                    <div className={styles.totalFiles}>Arquivos</div>
                    <div className={styles.totalCount}>5</div>
                  </div>
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
          <h2 className={styles.sectionTitle}>Personalização Geral</h2>
          <div className={styles.customizationContent}>
            <p className={styles.placeholderText}>
              Opções de personalização estarão disponíveis em breve.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Overview;
