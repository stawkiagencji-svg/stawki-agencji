// Aplikacja Android (Trusted Web Activity) połączona z tą domeną.
// Odciski SHA-256 nie są tajne – to publiczne „odciski” certyfikatów podpisu.
export const ANDROID_PACKAGE = process.env.ANDROID_PACKAGE_NAME || "pl.stawkiagencji.app";

const FINGERPRINTS = [
  // Klucz przesyłania z PWABuilder (22.10.2026)
  "3E:50:9B:31:CB:A0:CE:D4:F5:66:6B:F5:D2:DC:FF:CF:53:F8:19:6F:5E:0D:14:6D:44:7C:04:23:B0:B8:3A:A4",
  // Tu dopisz odcisk „klucza podpisywania aplikacji” z Play Console (Integralność aplikacji), gdy się pojawi.
];

export const ANDROID_FINGERPRINTS = [
  ...FINGERPRINTS,
  ...(process.env.ANDROID_SHA256_FINGERPRINTS ?? "").split(",").map((f) => f.trim()).filter(Boolean),
].filter((f, i, all) => all.indexOf(f) === i);
