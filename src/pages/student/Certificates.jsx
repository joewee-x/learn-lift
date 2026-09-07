import { useEffect, useState } from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';
import './certificates.css';

export default function Certificates() {
  const { user } = useAuth();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    api.getCertificates(user.id).then((c) => { setCerts(c); setLoading(false); });
  }, [user.id]);

  const handlePrint = () => window.print();

  return (
    <div className="page">
      <h1 className="page-title">Certificates</h1>
      <p className="page-sub">Your earned certificates of completion.</p>

      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-52" />)}
          </div>
        ) : certs.length === 0 ? (
          <EmptyState
            icon="🏆"
            title="No certificates yet"
            description="Complete a course with a passing grade to earn your certificate."
            action={<Button variant="primary" onClick={() => window.location = '/courses'}>Explore courses</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certs.map((c) => (
              <div key={c.courseId} className="cert-card">
                <div className="cert-card__ribbon">Certificate of Completion</div>
                <h3 className="cert-card__title">{c.courseTitle}</h3>
                <p className="cert-card__meta">Awarded to <strong>{user.name}</strong></p>
                <p className="cert-card__date">{formatDate(c.completionDate)}</p>
                <div className="cert-card__actions">
                  <Button size="sm" onClick={() => setPreview(c)}><Icon name="search" size={14} /> View</Button>
                  <Button size="sm" variant="secondary" onClick={handlePrint}><Icon name="download" size={14} /> Download</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!preview} onClose={() => setPreview(null)} title="Certificate preview" size="lg">
        {preview && (
          <div className="cert-preview" id="cert-print">
            <div className="cert-preview__badge">🏆</div>
            <p className="cert-preview__title">Certificate of Completion</p>
            <p className="cert-preview__this">This certifies that</p>
            <p className="cert-preview__name">{user.name}</p>
            <p className="cert-preview__this">has successfully completed</p>
            <p className="cert-preview__course">{preview.courseTitle}</p>
            <p className="cert-preview__date">Awarded on {formatDate(preview.completionDate)}</p>
            <div className="cert-preview__footer">
              <div>
                <p className="cert-preview__sig">{user.name}</p>
                <p className="cert-preview__role">Student</p>
              </div>
              <div className="cert-preview__seal">LH</div>
            </div>
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <Button onClick={handlePrint}><Icon name="download" size={16} /> Print / Save as PDF</Button>
        </div>
      </Modal>
    </div>
  );
}