import { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/api/apiClient';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/contacts', { name, email, subject, message });
      toast.success('Your message has been sent. We will get back to you soon!');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        badge="Connect"
        title="Contact Us"
        subtitle="We'd love to hear from you"
      />

      <div className="py-section-sm bg-background">
        <div className="container-premium max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-10 leading-relaxed text-pretty">
                Have questions about the portal, donations, or scholar registration?
                Reach out to us through any of the channels below.
              </p>
              <div className="space-y-6">
                {[
                  { icon: Phone, title: 'Phone', value: '+91 98765 43210' },
                  { icon: Mail, title: 'Email', value: 'info@vedicportal.org' },
                ].map(({ icon: Icon, title, value }) => (
                  <div key={title} className="flex items-start gap-4 premium-card p-5">
                    <div className="w-12 h-12 rounded-[16px] bg-secondary/15 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                      <p className="text-sm text-muted-foreground">{value}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-start gap-4 premium-card p-5">
                  <div className="w-12 h-12 rounded-[16px] bg-secondary/15 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Address</h3>
                    <p className="text-sm text-muted-foreground">
                      Vedic Knowledge Foundation,<br />
                      Tirupati, Andhra Pradesh 517501
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="premium-card p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What is this about?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Your message..." className="rounded-2xl resize-none" />
                </div>
                <Button type="submit" disabled={submitting} className="w-full" size="lg">
                  {submitting ? (
                    <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}