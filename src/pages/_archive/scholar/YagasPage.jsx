export default function YagasPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-heading text-4xl font-bold text-primary mb-4">Yagas & Havans</h1>
      <p className="text-muted-foreground text-lg leading-relaxed mb-6">
        Yagas are elaborate fire sacrifices described in the Vedas, undertaken for specific spiritual, worldly, or cosmic purposes.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { name: 'Rudra Yaga', desc: 'Performed to invoke blessings from Lord Rudra for protection and well-being.' },
          { name: 'Sudarshana Homa', desc: 'A fire ritual dedicated to Sudarshana Chakra for removal of obstacles.' },
          { name: 'Ganapathi Homa', desc: 'Performed before major undertakings to seek the blessings of Ganesha.' },
          { name: 'Maha Mrityunjaya Homa', desc: 'A powerful ritual for health, longevity, and liberation from the cycle of death.' },
        ].map((y) => (
          <div key={y.name} className="bg-card rounded-2xl p-6 shadow-vedic border border-border">
            <h2 className="font-heading text-lg font-bold text-primary mb-2">{y.name}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{y.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}