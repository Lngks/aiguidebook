
## Tilpasset header og ingen footer for /interactive

### Oversikt
Den interaktive siden skal ha et eget, minimalistisk header-design med transparent bakgrunn, og footeren skal fjernes helt. Dette gir en mer immersiv 3D-opplevelse.

### Endringer

**1. Oppdater Layout.tsx** -- Gjør navbar og footer betinget basert på rute
- Bruk `useLocation()` for å sjekke om vi er på `/interactive`
- Skjul standard Navbar og Footer på denne ruten
- Vis en egen `InteractiveHeader`-komponent i stedet

**2. Opprett ny komponent: `InteractiveHeader.tsx`**
- Transparent bakgrunn (absolute posisjonert over 3D-scenen)
- Venstre side: Pil-ikon (ArrowLeft fra lucide-react) som lenker tilbake til forsiden (`/`)
- Hoyre side: Favicon-bildet (`/favicon.svg`) vist i liten storrelse (ca. h-6/h-8)
- Ingen nav-linker, ingen logo, ingen "Kom i gang"-knapp
- Hvit/lys farge pa tekst/ikoner for synlighet mot mork bakgrunn

### Tekniske detaljer

**Layout.tsx:**
```tsx
const location = useLocation();
const isInteractive = location.pathname === "/interactive";

// Vis InteractiveHeader i stedet for Navbar pa /interactive
// Skjul Footer helt pa /interactive
```

**InteractiveHeader.tsx:**
```tsx
// Transparent, absolutt posisjonert header
// ArrowLeft-ikon til venstre -> Link to="/"
// favicon.svg bilde til hoyre, lite format
// z-index hoyere enn 3D-scenen
```
