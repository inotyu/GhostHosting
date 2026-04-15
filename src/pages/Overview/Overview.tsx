import React, { useState, useMemo } from 'react';
import { TrendingUp, PieChart, Calendar, File, HardDrive, Circle, Video, ImageIcon } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import { useFileSystem } from '../../hooks/useFileSystem';
import styles from './Overview.module.css';

const Overview: React.FC = () => {
  const [timeframe, setTimeframe] = useState('7d');
  const [dataType, setDataType] = useState('daily');
  const { items } = useFileSystem();

  // Calculate stats from actual data
  const videoCount = items.filter(item => item.type === 'file' && item.mimeType?.startsWith('video')).length;
  const imageCount = items.filter(item => item.type === 'file' && item.mimeType?.startsWith('image')).length;
  const totalSize = items.filter(item => item.type === 'file').reduce((acc, item) => acc + (item.size || 0), 0);
  const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);
  const sizeLimitMB = 100;
  const freeSpaceMB = (sizeLimitMB - parseFloat(sizeInMB)).toFixed(2);

  // Calculate uploads today
  const today = new Date().toDateString();
  const uploadsToday = items.filter(item => 
    item.type === 'file' && new Date(item.createdDate).toDateString() === today
  ).length;

  // Calculate total files
  const totalFiles = items.filter(item => item.type === 'file').length;

  const stats = [
    { title: 'Total de Arquivos', value: totalFiles },
    { title: 'Vídeos', value: videoCount },
    { title: 'Imagens', value: imageCount },
    { title: 'Envios Hoje', value: uploadsToday },
    { title: 'Limite de Tamanho', value: '100MB' },
    { title: 'Espaço Usado', value: `${sizeInMB}MB` },
    { title: 'Espaço Livre', value: `${freeSpaceMB}MB` }
  ];

  const getStatIcon = (title: string) => {
    if (title === 'Total de Arquivos') return <File size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Vídeos') return <Video size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Imagens') return <ImageIcon size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Envios Hoje') return <Calendar size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Limite de Tamanho') return <File size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Espaço Usado') return <HardDrive size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Espaço Livre') return <Circle size={16} style={{ color: '#ff4d8d' }} />;
    return <Circle size={16} style={{ color: '#ff4d8d' }} />;
  };

  // Generate upload data based on actual items
  const uploadData = useMemo(() => {
    const uploadsByDate: { [key: string]: number } = {};
    items.filter(item => item.type === 'file').forEach(item => {
      const date = new Date(item.createdDate);
      const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      uploadsByDate[dateStr] = (uploadsByDate[dateStr] || 0) + 1;
    });

    // Get last 7 days
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      dates.push({ date: dateStr, uploads: uploadsByDate[dateStr] || 0 });
    }

    return dates;
  }, [items]);

  const fileTypeData = [
    { type: 'Vídeos', count: videoCount, color: '#ff4d8d' },
    { type: 'Imagens', count: imageCount, color: '#ff6bb5' }
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
                {uploadData.map((data, index) => {
                  const maxUploads = Math.max(...uploadData.map(d => d.uploads), 1);
                  return (
                    <div key={index} className={styles.chartBar}>
                      <div
                        className={styles.bar}
                        style={{
                          height: `${(data.uploads / maxUploads) * 100}%`,
                          backgroundColor: '#ff4d8d'
                        }}
                      />
                      <div className={styles.chartLabel}>{data.date}</div>
                    </div>
                  );
                })}
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
                    <div className={styles.totalCount}>{totalFiles}</div>
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
