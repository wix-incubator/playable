import { test, expect } from '@playwright/test';

const CORE_FORMATS = [
  {
    type: 'MP4',
    url:
      'https://github.com/chthomos/video-media-samples/raw/refs/heads/master/big-buck-bunny-1080p-30sec.mp4',
    mime: 'video/mp4',
  },
  {
    type: 'WEBM',
    url:
      'https://github.com/chthomos/video-media-samples/raw/refs/heads/master/big-buck-bunny-1080p-30sec.mp4',
    mime: 'video/webm',
  },
];

const ADAPTER_FORMATS = [
  ...CORE_FORMATS,
  {
    type: 'HLS',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    mime: 'application/vnd.apple.mpegURL',
  },
  {
    type: 'DASH',
    url:
      'https://s3.amazonaws.com/_bc_dml/example-content/sintel_dash/sintel_vod.mpd',
    mime: 'application/dash+xml',
  },
  {
    type: 'DASH or HLS',
    url: [
      'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      'https://s3.amazonaws.com/_bc_dml/example-content/sintel_dash/sintel_vod.mpd',
    ],
    mime: null as string | null,
  },
];

/** Run playback scenarios in the page (no Mocha). Returns { failures, results }. */
async function runPlaybackInPage(
  page: import('@playwright/test').Page,
  formats: typeof CORE_FORMATS | typeof ADAPTER_FORMATS,
  timeoutPerFormat = 15000,
): Promise<{
  failures: number;
  results: { type: string; ok: boolean; error?: string }[];
}> {
  return page.evaluate(
    async ({ formats, timeoutPerFormat }) => {
      const Playable = (window as any).Playable;
      if (!Playable)
        return {
          failures: 1,
          results: [
            { type: 'setup', ok: false, error: 'Playable not on window' },
          ],
        };
      const video = document.createElement('video');
      const canPlay = (mime: string | null) =>
        !mime || !!video.canPlayType(mime);
      const results: { type: string; ok: boolean; error?: string }[] = [];
      const container = document.createElement('div');
      document.body.appendChild(container);

      for (const f of formats) {
        if (!canPlay((f as any).mime)) continue;
        const url = Array.isArray((f as any).url)
          ? (f as any).url[0]
          : (f as any).url;
        for (const preloadNone of [false, true]) {
          const label = `${f.type}${preloadNone ? ' preload=none' : ''}`;
          try {
            await new Promise<void>((resolve, reject) => {
              const player = (Playable as any).create(
                preloadNone
                  ? { preload: (Playable as any).PRELOAD_TYPES?.NONE }
                  : {},
              );
              player.attachToElement(container);
              const onPlaying = () => {
                player.destroy();
                resolve();
              };
              player.on((Playable as any).ENGINE_STATES.PLAYING, onPlaying);
              if (preloadNone) {
                player.on(
                  (Playable as any).VIDEO_EVENTS?.PLAY_ABORTED ??
                    'PLAY_ABORTED',
                  onPlaying,
                );
              }
              player.setSrc(url);
              player.play();
              setTimeout(() => reject(new Error('timeout')), timeoutPerFormat);
            });
            results.push({ type: label, ok: true });
          } catch (e) {
            results.push({
              type: label,
              ok: false,
              error: e?.message || String(e),
            });
          }
        }
      }
      return { failures: results.filter(r => !r.ok).length, results };
    },
    { formats, timeoutPerFormat },
  );
}

test.describe('Playback (core)', () => {
  test('playback tests pass', async ({ page }) => {
    test.setTimeout(120000);
    await page.goto('/dev-env/playback-test.html');
    const result = await runPlaybackInPage(page, CORE_FORMATS);
    expect(
      result.failures,
      result.results.map(r => `${r.type}: ${r.ok ? 'ok' : r.error}`).join('; '),
    ).toBe(0);
  });
});

test.describe('Playback (with adapters)', () => {
  test('playback tests with DASH/HLS pass', async ({ page }) => {
    test.setTimeout(180000);
    await page.goto('/dev-env/playback-test-with-adapters.html');
    const result = await runPlaybackInPage(page, ADAPTER_FORMATS, 20000);
    expect(
      result.failures,
      result.results.map(r => `${r.type}: ${r.ok ? 'ok' : r.error}`).join('; '),
    ).toBe(0);
  });
});
