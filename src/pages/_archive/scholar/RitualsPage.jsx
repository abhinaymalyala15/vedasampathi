export default function RitualsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-heading text-4xl font-bold text-primary mb-4">Vedic Rituals</h1>
      <p className="text-muted-foreground text-lg leading-relaxed mb-6">
        Vedic rituals (Yajna) are sacred fire ceremonies performed according to the injunctions of the Vedas. They serve as a bridge between the human world and the divine.
      </p>
      <div className="space-y-4">
        {[
          { name: 'Agnihotra', desc: 'A daily fire ritual performed at sunrise and sunset, considered the foundation of Vedic practice.' },
          { name: 'Soma Yajna', desc: 'An elaborate ritual involving the pressing and offering of the Soma plant juice.' },
          { name: 'Ashvamedha', desc: 'A grand horse sacrifice performed by kings to assert their sovereignty.' },
          { name: 'Sandhyavandanam', desc: 'Tri-daily prayer ritual performed by initiated Hindus at dawn, noon, and dusk.' },
        ].map((r) => (
          <div key={r.name} className="bg-card rounded-2xl p-6 shadow-vedic border border-border">
            <h2 className="font-heading text-lg font-bold text-primary mb-1">{r.name}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}