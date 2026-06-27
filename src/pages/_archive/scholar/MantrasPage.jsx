export default function MantrasPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-heading text-4xl font-bold text-primary mb-4">Sacred Mantras</h1>
      <p className="text-muted-foreground text-lg leading-relaxed mb-6">
        Mantras are sacred syllables, words, or phrases in Sanskrit with spiritual power. Regular chanting of mantras purifies the mind and elevates consciousness.
      </p>
      <div className="space-y-5">
        {[
          { name: 'Gayatri Mantra', mantra: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्', desc: 'The most sacred mantra from the Rigveda, invoking the divine light of the sun.' },
          { name: 'Mahamrityunjaya Mantra', mantra: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्', desc: 'A life-giving mantra dedicated to Lord Shiva for healing and liberation.' },
          { name: 'Pranava Mantra', mantra: 'ॐ', desc: 'The primordial sound, the most fundamental mantra representing the universe.' },
        ].map((m) => (
          <div key={m.name} className="bg-card rounded-2xl p-6 shadow-vedic border border-border">
            <h2 className="font-heading text-lg font-bold text-primary mb-2">{m.name}</h2>
            <p className="font-sanskrit text-xl text-secondary mb-3 leading-relaxed">{m.mantra}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}