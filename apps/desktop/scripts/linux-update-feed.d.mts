/** Environment variable naming the Linux update feed directory. */
export const LINUX_UPDATE_URL_ENV: 'DSH_DESKTOP_LINUX_UPDATE_URL'

/**
 * Resolve the HTTPS directory holding `nightly-linux*.yml` and its AppImage, such as a GitHub
 * `releases/latest/download/` URL. Builds without a feed ship no update source.
 * @param env - Packaging environment.
 * @returns Feed directory URL ending in `/`, or undefined when unset.
 */
export function resolveLinuxUpdateFeed(env: NodeJS.ProcessEnv): string | undefined
