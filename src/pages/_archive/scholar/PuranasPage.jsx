export default function PuranasPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-heading text-4xl font-bold text-primary mb-4">Puranas</h1>
      <p className="text-muted-foreground text-lg leading-relaxed mb-6">
        The Puranas are a genre of ancient and medieval texts in Hinduism, Jainism and Buddhism. They typically cover cosmology, mythology, legend, and ritual.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {['Vishnu Purana','Bhagavata Purana','Shiva Purana','Brahma Purana','Markandeya Purana','Skanda Purana'].map((p) => (
          <div key={p} className="bg-card rounded-2xl p-5 shadow-vedic border border-border text-center">
            <h2 className="font-heading text-base font-bold text-primary">{p}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}