export function EmptyState() {
  return (
    <div className="glass flex flex-col items-center gap-4 rounded-2xl border border-dashed p-10 text-center">
      {/* Aurora: moon with three stars */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        aria-hidden
        className="hidden [[data-look=aurora]_&]:block"
      >
        <path d="M70 25a35 35 0 1 0 25 60A30 30 0 0 1 70 25z" className="fill-accent" />
        <circle cx="30" cy="30" r="3" className="animate-pulse fill-primary" />
        <circle cx="95" cy="25" r="2.5" className="animate-pulse fill-primary" />
        <circle cx="100" cy="55" r="2" className="animate-pulse fill-primary" />
      </svg>
      {/* Candy: smiling cloud */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        aria-hidden
        className="hidden [[data-look=candy]_&]:block"
      >
        <path
          d="M30 85a18 18 0 0 1 2-36 24 24 0 0 1 45-8 20 20 0 0 1 13 44z"
          strokeWidth="4"
          className="fill-accent stroke-success"
        />
        <circle cx="50" cy="62" r="3.5" className="fill-foreground" />
        <circle cx="72" cy="62" r="3.5" className="fill-foreground" />
        <path
          d="M52 72q9 8 18 0"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          className="stroke-foreground"
        />
      </svg>
      {/* Neon: lightning bolt in a circle */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        aria-hidden
        className="hidden glow rounded-full [[data-look=neon]_&]:block"
      >
        <circle cx="60" cy="60" r="50" strokeWidth="3" fill="none" className="stroke-primary" />
        <polygon points="66,20 36,66 58,66 52,100 84,52 62,52" className="fill-accent" />
      </svg>
      <p className="font-heading text-xl">Alles erledigt. Zeit für Kaffee.</p>
      <p className="text-muted-foreground">Tippe oben eine neue Aufgabe ein oder drücke N.</p>
    </div>
  )
}
