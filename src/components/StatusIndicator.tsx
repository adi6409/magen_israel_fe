import React from 'react';

export type StatusType = 'ok' | 'warning' | 'danger';

interface StatusIndicatorProps {
  status: StatusType;
}

const statusConfig = {
  ok: {
    className: 'status-circle safe',
    icon: '✅',
    text: 'הכל בסדר\nאין התראות פעילות',
  },
  warning: {
    className: 'status-circle warning',
    icon: '⚠️',
    text: 'שהו ליד\nמרחב מוגן',
  },
  danger: {
    className: 'status-circle danger',
    icon: '🚨',
    text: 'שהו במרחב\nמוגן מיידית!',
  },
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const { className, icon, text } = statusConfig[status];
  return (
    <div className={className} style={{ marginBottom: 0 }}>
      <div className="status-icon" style={{ fontSize: 48, marginBottom: 10 }}>{icon}</div>
      <div className="status-text" style={{ fontSize: 16, fontWeight: 700, color: 'white', textAlign: 'center', lineHeight: 1.3, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
        {text.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < text.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}; 