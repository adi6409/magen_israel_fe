import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ZoneSelectorModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (zone: string) => void;
  selectedZone: string;
}

export const ZoneSelectorModal: React.FC<ZoneSelectorModalProps> = ({ open, onClose, onSelect, selectedZone }) => {
  const [zones, setZones] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      axios.get('/zones')
        .then(res => {
          let data = res.data;
          // If the data is an array of objects, extract the name property
          if (Array.isArray(data) && typeof data[0] === 'object' && data[0] !== null) {
            data = data.map((z: any) => z.name || z.label || String(z));
          }
          setZones(data);
        })
        .catch(() => setZones([]))
        .finally(() => setLoading(false));
    }
  }, [open]);

  const filteredZones = zones.filter(z =>
    typeof z === 'string' && z.toLowerCase().includes(search.toLowerCase())
  );

  return open ? (
    <div className="zone-modal-overlay" onClick={onClose}>
      <div className="zone-modal" onClick={e => e.stopPropagation()}>
        <h2>Select Zone</h2>
        <input
          type="text"
          placeholder="Search zones..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="zone-modal-search"
        />
        {loading ? (
          <div className="zone-modal-loading">Loading...</div>
        ) : (
          <ul className="zone-modal-list">
            {filteredZones.map(zone => (
              <li
                key={zone}
                className={zone === selectedZone ? 'selected' : ''}
                onClick={() => { onSelect(zone); onClose(); }}
              >
                {zone}
              </li>
            ))}
          </ul>
        )}
        <button className="zone-modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  ) : null;
}; 