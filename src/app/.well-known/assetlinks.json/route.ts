import { ANDROID_FINGERPRINTS, ANDROID_PACKAGE } from "@/lib/android";

// Plik weryfikujący, że aplikacja Android z Google Play należy do tej domeny.
// Bez niego aplikacja pokazuje pasek adresu przeglądarki zamiast pełnego ekranu.
export function GET() {
  return Response.json([
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: { namespace: "android_app", package_name: ANDROID_PACKAGE, sha256_cert_fingerprints: ANDROID_FINGERPRINTS },
    },
  ]);
}
