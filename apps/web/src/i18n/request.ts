import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

// Touch file to force Next.js dev server reload of translated JSON modules
export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
