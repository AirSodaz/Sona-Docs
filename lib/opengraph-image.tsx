import { ImageResponse } from 'next/og';

export const ogImageAlt = 'Sona | Offline Transcript Editor';
export const ogImageSize = {
  width: 1200,
  height: 630,
};
export const ogImageContentType = 'image/png';

export function createOpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#F7F5F2',
          backgroundImage:
            'radial-gradient(circle at top right, rgba(212, 203, 194, 0.92), transparent 30%), radial-gradient(circle at bottom left, rgba(212, 203, 194, 0.78), transparent 38%)',
          color: '#2D2D2D',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            padding: '56px 64px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                  background: '#F1EAE2',
                  border: '2px solid rgba(92, 77, 67, 0.14)',
                  color: '#5C4D43',
                  fontSize: 44,
                  fontStyle: 'italic',
                  fontWeight: 700,
                }}
              >
                S
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    fontSize: 56,
                    lineHeight: 1,
                    fontStyle: 'italic',
                    fontFamily: 'Georgia, serif',
                    color: '#5C4D43',
                  }}
                >
                  Sona
                </div>
                <div
                  style={{
                    fontSize: 18,
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: '#7B6B61',
                  }}
                >
                  Offline Transcript Editor
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: 56,
                maxWidth: 860,
                gap: 20,
              }}
            >
              <div
                style={{
                  fontSize: 74,
                  lineHeight: 1.08,
                  fontFamily: 'Georgia, serif',
                }}
              >
                Fast, accurate, private transcription for the quiet spaces.
              </div>
              <div
                style={{
                  fontSize: 26,
                  lineHeight: 1.5,
                  color: '#5C4D43',
                  maxWidth: 820,
                }}
              >
                Built with Tauri and Sherpa-onnx to keep speech-to-text local,
                readable, and ready for polish or translation.
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 16,
            }}
          >
            {['100% local', 'AI polish', 'Timestamped transcripts'].map(
              (label) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px 20px',
                    borderRadius: 999,
                    background: 'rgba(255, 255, 255, 0.74)',
                    border: '1px solid rgba(92, 77, 67, 0.12)',
                    fontSize: 22,
                    color: '#5C4D43',
                  }}
                >
                  {label}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    ),
    ogImageSize,
  );
}
