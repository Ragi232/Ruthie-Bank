/**
 * Cookie-authenticated browser mutations should originate from this application.
 * Requests without Origin are allowed for non-browser clients; production API
 * clients must authenticate independently and must not rely on browser cookies.
 */
export function isSameOriginMutation(request: Request) {
  const originHeader = request.headers.get('origin');
  if (!originHeader) return true;

  try {
    const origin = new URL(originHeader).origin;
    const configuredAppUrl = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL;
    if (configuredAppUrl) return origin === new URL(configuredAppUrl).origin;

    const requestHost = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
    return Boolean(requestHost && new URL(origin).host === requestHost);
  } catch {
    return false;
  }
}
