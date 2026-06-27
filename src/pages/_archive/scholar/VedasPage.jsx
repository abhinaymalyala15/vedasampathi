export default function VedasPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-heading text-4xl font-bold text-primary mb-4">The Four Vedas</h1>
      <p className="text-muted-foreground text-lg leading-relaxed mb-6">
        The Vedas are the oldest sacred scriptures of Hinduism, composed in Vedic Sanskrit. They form the foundation of Vedic tradition and are considered apauruṣeya — not of human origin.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { name: 'Rigveda', desc: 'The oldest of the four Vedas, consisting of 1,028 hymns (suktas) composed in praise of the gods.' },
          { name: 'Samaveda', desc: 'A liturgical text derived from the Rigveda, used as a source of melodies for chanting.' },
          { name: 'Yajurveda', desc: 'Contains prose mantras for use in sacrificial rites and religious ceremonies.' },
          { name: 'Atharvaveda', desc: 'A collection of spells, incantations, and philosophical speculations.' },
        ].map((v) => (
          <div key={v.name} className="bg-card rounded-2xl p-6 shadow-vedic border border-border">
            <h2 className="font-heading text-xl font-bold text-primary mb-2">{v.name}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}