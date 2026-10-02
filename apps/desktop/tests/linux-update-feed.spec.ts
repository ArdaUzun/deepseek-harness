import { describe, expect, it } from 'vitest'
import { resolveLinuxUpdateFeed } from '../scripts/linux-update-feed.mjs'

describe('Linux update feed', () => {
  it('ships no update source without a feed and normalizes the directory URL', () => {
    expect(resolveLinuxUpdateFeed({})).toBeUndefined()
    expect(resolveLinuxUpdateFeed({ DSH_DESKTOP_LINUX_UPDATE_URL: '  ' })).toBeUndefined()
    expect(resolveLinuxUpdateFeed({ DSH_DESKTOP_LINUX_UPDATE_URL: 'https://github.com/o/r/releases/latest/download' }))
      .toBe('https://github.com/o/r/releases/latest/download/')
  })

  it('rejects feeds that are not plain HTTPS directories', () => {
    for (const value of ['http://example.com/', 'https://user:pass@example.com/', 'https://example.com/?a=1', 'https://example.com/#x', 'feed']) {
      expect(() => resolveLinuxUpdateFeed({ DSH_DESKTOP_LINUX_UPDATE_URL: value })).toThrow(/DSH_DESKTOP_LINUX_UPDATE_URL/u)
    }
  })
})
