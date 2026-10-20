// Plik weryfikujący, że aplikacja Android z Google Play należy do tej domeny.
// Bez niego aplikacja pokazuje pasek adresu przeglądarki zamiast pełnego ekranu.
export const dynamic = "force-dynamic";

export function GET() {
  const pkg = process.env.ANDROID_PACKAGE_NAME;
  const fingerprints = (process.env.ANDROID_SHA256_FINGERPRINTS ?? "")
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);
  const body =
    pkg && fingerprints.length
      ? [{
          relation: ["delegate_permission/common.handle_all_urls"],
          target: { namespace: "android_app", package_name: pkg, sha256_cert_fingerprints: fingerprints },
        }]
      : [];
  return Response.json(body);
}
