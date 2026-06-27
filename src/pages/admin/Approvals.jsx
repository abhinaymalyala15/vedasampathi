import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { CheckCircle2, XCircle, MapPin, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminApprovals() {
  const [tab, setTab]                       = useState('scholars');
  const [rejecting, setRejecting]           = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const queryClient                         = useQueryClient();

  const { data: pendingScholars = [], isLoading: loadingScholars } = useQuery({
    queryKey: ['admin', 'scholars', 'pending'],
    queryFn:  () => api.get('/admin/scholars/pending').then(r => r),
  });

  const { data: pendingPathasalas = [], isLoading: loadingPathasalas } = useQuery({
    queryKey: ['admin', 'pathasalas', 'pending'],
    queryFn:  () => api.get('/admin/pathasalas/pending').then(r => r),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'scholars', 'pending'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'pathasalas', 'pending'] });
  };

  const approveMutation = useMutation({
    mutationFn: ({ type, id }) => api.put(`/admin/${type}/${id}/approve`),
    onSuccess:  () => { invalidate(); toast.success('Application approved'); },
    onError:    () => toast.error('Failed to approve'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ type, id, reason }) => api.put(`/admin/${type}/${id}/reject`, { reason }),
    onSuccess:  () => { invalidate(); setRejecting(null); setRejectionReason(''); toast.success('Application rejected'); },
    onError:    () => toast.error('Failed to reject'),
  });

  const handleApprove = (type, id) => approveMutation.mutate({ type, id });

  const handleReject = (type, id) => {
    if (!rejectionReason.trim()) { toast.error('Please provide a rejection reason'); return; }
    rejectMutation.mutate({ type, id, reason: rejectionReason });
  };

  const type    = tab === 'scholars' ? 'scholars' : 'pathasalas';
  const isLoading = tab === 'scholars' ? loadingScholars : loadingPathasalas;
  const items   = tab === 'scholars' ? pendingScholars : pendingPathasalas;

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-primary mb-2">Pending Approvals</h1>
      <p className="text-muted-foreground mb-8">Review and approve scholar &amp; pathasala registrations</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['scholars', 'pathasalas'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all capitalize ${
              tab === t ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground border border-border'
            }`}>
            {t} ({(t === 'scholars' ? pendingScholars : pendingPathasalas).length})
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-card rounded-2xl shadow-vedic p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-secondary mx-auto mb-4" />
          <p className="text-lg font-semibold text-primary">All caught up!</p>
          <p className="text-muted-foreground">No pending {tab} to review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-card rounded-2xl shadow-vedic p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                  {(item.profile_photo_url || item.photo)
                    ? <img src={item.profile_photo_url || item.photo} alt={item.full_name || item.institution_name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No photo</div>}
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-bold text-primary mb-1">
                    {item.full_name || item.institution_name}
                  </h3>
                  {tab === 'scholars' ? (
                    <div className="space-y-4">
                      {/* Subtitle / Basics */}
                      <div>
                        <p className="text-sm text-secondary font-semibold">
                          {item.primary_veda || 'Vedic Scholar'} {item.current_level && `(${item.current_level})`}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" /> {item.city}, {item.state}
                          {item.date_of_birth && ` • DOB: ${new Date(item.date_of_birth).toLocaleDateString()}`}
                          {item.gender && ` • ${item.gender}`}
                        </p>
                      </div>

                      {/* Detail Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-xl text-xs border border-border/50">
                        {/* Veda details */}
                        <div>
                          <p className="font-bold text-primary mb-1 border-b pb-0.5 border-border/50">Veda & Study</p>
                          <p><span className="text-muted-foreground">Veda:</span> {item.primary_veda || 'N/A'}</p>
                          <p><span className="text-muted-foreground">Shakha:</span> {item.shakha || 'N/A'}</p>
                          <p><span className="text-muted-foreground">Years:</span> {item.years_of_study || 'N/A'}</p>
                        </div>
                        {/* Pathasala details */}
                        <div>
                          <p className="font-bold text-primary mb-1 border-b pb-0.5 border-border/50">Pathasala</p>
                          <p className="font-medium text-primary/90 truncate" title={item.pathasala_name}>{item.pathasala_name || 'N/A'}</p>
                          <p><span className="text-muted-foreground">Loc:</span> {item.pathasala_location || 'N/A'}</p>
                          <p><span className="text-muted-foreground">Status:</span> {item.study_status || 'N/A'}</p>
                        </div>
                        {/* Guru details */}
                        <div>
                          <p className="font-bold text-primary mb-1 border-b pb-0.5 border-border/50">Guru Lineage</p>
                          <p className="font-medium text-primary/90 truncate" title={item.guru_name}>{item.guru_name || 'N/A'}</p>
                          <p><span className="text-muted-foreground">Param-Guru:</span> {item.param_guru || 'N/A'}</p>
                          <p><span className="text-muted-foreground">Tradition:</span> {item.sampradaya || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Documents / Certificates */}
                      {item.certificate_urls && item.certificate_urls.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-primary mb-1.5">Attached Certificates:</p>
                          <div className="flex flex-wrap gap-2">
                            {item.certificate_urls.map((url, idx) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 rounded-full px-3 py-1 font-semibold transition-all"
                              >
                                📄 Certificate {idx + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {item.address}, {item.city}, {item.state}
                      </p>
                      {item.contact_email && <p className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {item.contact_email}</p>}
                      {item.contact_phone && <p className="text-sm text-muted-foreground flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {item.contact_phone}</p>}
                    </>
                  )}
                  {item.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>}
                </div>
                <div className="flex sm:flex-col gap-3 shrink-0">
                  <button onClick={() => handleApprove(type, item.id)} disabled={approveMutation.isPending}
                    className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-secondary/90 transition-all disabled:opacity-50">
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => setRejecting(item.id)}
                    className="inline-flex items-center gap-2 bg-destructive/10 text-destructive font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-destructive/20 transition-all">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>

              {rejecting === item.id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <label className="block text-sm font-semibold text-primary mb-2">Rejection Reason</label>
                  <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3} placeholder="Explain why this application is being rejected..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none mb-3" />
                  <div className="flex gap-3">
                    <button onClick={() => handleReject(type, item.id)} disabled={rejectMutation.isPending}
                      className="bg-destructive text-destructive-foreground font-semibold text-sm px-5 py-2 rounded-full hover:bg-destructive/90 transition-all disabled:opacity-50">
                      Confirm Reject
                    </button>
                    <button onClick={() => { setRejecting(null); setRejectionReason(''); }}
                      className="bg-muted text-foreground font-semibold text-sm px-5 py-2 rounded-full hover:bg-muted/70 transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}