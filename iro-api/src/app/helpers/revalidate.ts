import config from '../config'
import logger from '../utils/logger'

/** Tell the public website to refresh its cache after content changes (fire-and-forget). */
export const notifyFrontend = () => {
  if (!config.revalidate_url || !config.revalidate_secret) return
  fetch(config.revalidate_url, {
    method: 'POST',
    headers: { 'x-revalidate-secret': config.revalidate_secret },
    signal: AbortSignal.timeout(3000),
  }).catch(err =>
    logger.warn({ err: String(err) }, 'frontend revalidate failed'),
  )
}
