import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { Heart, GraduationCap, School, IndianRupee, CheckCircle2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const presetAmounts = [500, 1000, 2500, 5000];

export default function Donate() {
  const [donationType, setDonationType] = useState('general');
  const [recipientScholar, setRecipientScholar] = useState('');
  const [recipientPathasala, setRecipientPathasala] = useState('');
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorMobile, setDonorMobile] = useState('');
  const [donorPan, setDonorPan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: scholarData } = useQuery({
    queryKey: ['scholars', 'donate'],
    queryFn: () => api.get('/scholars?per_page=100'),
  });
  const scholars = scholarData?.data ?? [];

  const { data: pathasalaData } = useQuery({
    queryKey: ['pathasalas', 'donate'],
    queryFn: () => api.get('/pathasalas?per_page=100'),
  });
  const pathasalas = pathasalaData?.data ?? [];

  const finalAmount = customAmount ? parseInt(customAmount) : amount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!donorName || !donorEmail || !donorMobile || !finalAmount) {
      toast.error('Please fill all required fields');
      return;
    }
    if (donationType === 'scholar_sponsorship' && !recipientScholar) {
      toast.error('Please select a scholar to sponsor');
      return;
    }
    if (donationType === 'pathasala_sponsorship' && !recipientPathasala) {
      toast.error('Please select a pathasala to sponsor');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/donations', {
        donor_name:    donorName,
        donor_email:   donorEmail,
        donor_phone:   donorMobile,
        donation_type: donationType,
        scholar_id:    donationType === 'scholar_sponsorship' ? recipientScholar : undefined,
        pathasala_id:  donationType === 'pathasala_sponsorship' ? recipientPathasala : undefined,
        amount:        finalAmount,
        notes:         donorPan ? `PAN: ${donorPan}` : undefined,
      });
      setSuccess(true);
      toast.success('Donation request received! Thank you for your generosity.');
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-background py-20 px-4">
        <div className="max-w-md text-center premium-card p-10 md:p-14">
          <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-secondary" />
          </div>
          <h2 className="font-heading text-3xl font-semibold text-foreground mb-4">Thank You!</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Your donation request has been received. You will receive a UPI payment link at {donorEmail} shortly.
          </p>
          <Button
            onClick={() => {
              setSuccess(false);
              setDonorName('');
              setDonorEmail('');
              setDonorMobile('');
              setDonorPan('');
              setCustomAmount('');
            }}
            size="lg"
          >
            Make Another Donation
          </Button>
        </div>
      </div>
    );
  }

  const tiles = [
    { key: 'general', icon: Heart, title: 'General Donation', desc: 'Support the overall mission' },
    { key: 'scholar_sponsorship', icon: GraduationCap, title: 'Scholar Sponsorship', desc: 'Sponsor a Vedic scholar' },
    { key: 'pathasala_sponsorship', icon: School, title: 'Pathasala Sponsorship', desc: 'Support a pathasala' },
  ];

  return (
    <div>
      <PageHeader
        badge="Seva"
        title="Donate"
        subtitle="Your generosity keeps the Vedic flame alive"
      />

      <div className="py-section-sm bg-background">
        <div className="container-premium max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {tiles.map((tile) => {
              const Icon = tile.icon;
              const active = donationType === tile.key;
              return (
                <button
                  key={tile.key}
                  type="button"
                  onClick={() => setDonationType(tile.key)}
                  className={`p-6 rounded-[20px] text-center transition-all duration-300 border-2 ${
                    active
                      ? 'bg-primary text-primary-foreground border-primary shadow-premium-lg scale-[1.02]'
                      : 'premium-card border-border/60 hover:border-primary/30 hover:shadow-premium'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center mx-auto mb-3 ${
                    active ? 'bg-secondary/25' : 'bg-muted'
                  }`}>
                    <Icon className={`w-6 h-6 ${active ? 'text-secondary' : 'text-primary'}`} />
                  </div>
                  <h3 className="font-heading text-base font-semibold mb-1">{tile.title}</h3>
                  <p className={`text-xs ${active ? 'text-primary-foreground/65' : 'text-muted-foreground'}`}>
                    {tile.desc}
                  </p>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="premium-card p-8 md:p-10 space-y-6">
            {/* Recipient Selection */}
            {donationType === 'scholar_sponsorship' && (
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Select Scholar *</label>
                <select
                  value={recipientScholar}
                  onChange={(e) => setRecipientScholar(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Choose a scholar...</option>
                  {scholars.map((s) => (
                    <option key={s.id} value={s.id}>{s.full_name} — {s.city}</option>
                  ))}
                </select>
              </div>
            )}
            {donationType === 'pathasala_sponsorship' && (
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Select Pathasala *</label>
                <select
                  value={recipientPathasala}
                  onChange={(e) => setRecipientPathasala(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Choose a pathasala...</option>
                  {pathasalas.map((p) => (
                    <option key={p.id} value={p.id}>{p.institution_name} — {p.city}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Amount Selection */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-3">Select Amount (₹) *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => { setAmount(amt); setCustomAmount(''); }}
                    className={`py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                      amount === amt && !customAmount
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:border-primary/30'
                    }`}
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Or enter custom amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Donor Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Full Name *</label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Mobile Number *</label>
                <input
                  type="tel"
                  value={donorMobile}
                  onChange={(e) => setDonorMobile(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Email *</label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">PAN (optional)</label>
                <input
                  type="text"
                  value={donorPan}
                  onChange={(e) => setDonorPan(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="For 80G receipt"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button type="submit" disabled={submitting} variant="secondary" size="lg" className="w-full text-lg h-14">
                {submitting ? (
                  <span className="w-6 h-6 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <IndianRupee className="w-5 h-5" />
                    Pay ₹{finalAmount.toLocaleString()} with UPI
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Secure UPI payment via Razorpay. You will receive a payment link after submission.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}