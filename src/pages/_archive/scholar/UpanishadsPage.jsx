export default function UpanishadsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-heading text-4xl font-bold text-primary mb-4">Upanishads</h1>
      <p className="text-muted-foreground text-lg leading-relaxed mb-6">
        The Upanishads are late Vedic Sanskrit texts that form the philosophical basis of Hinduism. They explore the nature of the self (Atman) and the ultimate reality (Brahman).
      </p>
      <div className="space-y-4">
        {[
          { name: 'Brihadaranyaka Upanishad', desc: 'One of the oldest Upanishads, dealing with the nature of Brahman and Atman.' },
          { name: 'Chandogya Upanishad', desc: 'Among the oldest Upanishads, it includes the famous teaching "Tat Tvam Asi" (That thou art).' },
          { name: 'Taittiriya Upanishad', desc: 'Discusses the concept of Brahman and the five sheaths of the self.' },
          { name: 'Mandukya Upanishad', desc: 'A short text about the syllable Om and the four states of consciousness.' },
        ].map((u) => (
          <div key={u.name} className="bg-card rounded-2xl p-6 shadow-vedic border border-border">
            <h2 className="font-heading text-lg font-bold text-primary mb-1">{u.name}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{u.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}