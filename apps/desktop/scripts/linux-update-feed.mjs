/** Resolve the self-hosted electron-updater feed a Linux AppImage checks. */

/** Environment variable naming the Linux update feed directory. */
export const LINUX_UPDATE_URL_ENV = 'DSH_DESKTOP_LINUX_UPDATE_URL'

/**
 * Resolve the HTTPS directory holding `nightly-linux*.yml` and its AppImage, such as a GitHub
 * `releases/latest/download/` URL. Builds without a feed ship no update source.
 * @param {NodeJS.ProcessEnv} env - Packaging environment.
 * @returns {string | undefined} Feed directory URL ending in `/`, or undefined when unset.
 */
export function resolveLinuxUpdateFeed(env) {
  const value = env[LINUX_UPDATE_URL_ENV]?.trim()
  if (value === undefined || value === '') return undefined
  let url
  try { url = new URL(value) }
  catch { throw new Error(`desktop package: ${LINUX_UPDATE_URL_ENV} must be an absolute HTTPS URL`) }
  if (url.protocol !== 'https:' || url.username !== '' || url.password !== '' || url.search !== '' || url.hash !== '') {
    throw new Error(`desktop package: ${LINUX_UPDATE_URL_ENV} must be an HTTPS URL without credentials, query, or fragment`)
  }
  return url.href.endsWith('/') ? url.href : `${url.href}/`
}
