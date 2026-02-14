import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // TODO: Phase 3 — 從使用者 profile 或 cookie 取得語系
  const locale = 'zh-TW';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
