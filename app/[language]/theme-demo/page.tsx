import { ThemeButton, ThemeCard } from 'components/theme';

export default function ThemeDemoPage() {
  const currentTheme = process.env.NEXT_PUBLIC_THEME || 'active';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">Theme Demo: {currentTheme}</h1>
            <p className="text-lg text-gray-600">
              Current theme: <span className="font-semibold text-primary-600">{currentTheme}</span>
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Set NEXT_PUBLIC_THEME environment variable to change themes
            </p>
          </div>

          {/* Color Palette */}
          <ThemeCard className="mb-8">
            <h2 className="mb-6 text-2xl font-bold">Color Palette</h2>
            <div className="grid grid-cols-5 gap-4">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
                <div key={shade} className="text-center">
                  <div
                    className={`rounded-theme mx-auto mb-2 h-16 w-16 border border-gray-200 bg-primary-${shade}`}
                  />
                  <p className="font-mono text-xs text-gray-600">{shade}</p>
                  <p className="font-mono text-xs text-gray-500">primary-{shade}</p>
                </div>
              ))}
            </div>
          </ThemeCard>

          {/* Typography */}
          <ThemeCard className="mb-8">
            <h2 className="mb-6 text-2xl font-bold">Typography</h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold">English Font</h3>
                <p className="font-theme-en text-lg">The quick brown fox jumps over the lazy dog</p>
                <p className="mt-1 text-sm text-gray-500">Using font-theme-en class</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">Arabic Font</h3>
                <p className="font-theme-ar text-lg">النص العربي للعرض</p>
                <p className="mt-1 text-sm text-gray-500">Using font-theme-ar class</p>
              </div>
            </div>
          </ThemeCard>

          {/* Border Radius */}
          <ThemeCard className="mb-8">
            <h2 className="mb-6 text-2xl font-bold">Border Radius</h2>
            <div className="flex items-center space-x-4">
              <div className="rounded-theme h-20 w-20 bg-primary-500" />
              <div>
                <p className="font-semibold">Current border radius:</p>
                <p className="font-mono text-sm text-gray-600">Using rounded-theme class</p>
              </div>
            </div>
          </ThemeCard>

          {/* Buttons */}
          <ThemeCard className="mb-8">
            <h2 className="mb-6 text-2xl font-bold">Buttons</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <ThemeButton variant="primary">Primary Button</ThemeButton>
                <ThemeButton variant="secondary">Secondary Button</ThemeButton>
                <ThemeButton variant="outline">Outline Button</ThemeButton>
                <ThemeButton variant="ghost">Ghost Button</ThemeButton>
              </div>
              <div className="flex flex-wrap gap-4">
                <ThemeButton variant="primary" size="sm">
                  Small
                </ThemeButton>
                <ThemeButton variant="primary" size="md">
                  Medium
                </ThemeButton>
                <ThemeButton variant="primary" size="lg">
                  Large
                </ThemeButton>
              </div>
            </div>
          </ThemeCard>

          {/* Cards */}
          <ThemeCard className="mb-8">
            <h2 className="mb-6 text-2xl font-bold">Cards</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <ThemeCard variant="default">
                <h3 className="mb-2 text-lg font-semibold">Default Card</h3>
                <p className="text-gray-600">This is a default card with subtle styling.</p>
              </ThemeCard>
              <ThemeCard variant="elevated">
                <h3 className="mb-2 text-lg font-semibold">Elevated Card</h3>
                <p className="text-gray-600">This card has a stronger shadow for elevation.</p>
              </ThemeCard>
              <ThemeCard variant="outlined">
                <h3 className="mb-2 text-lg font-semibold">Outlined Card</h3>
                <p className="text-gray-600">This card has a colored border using theme colors.</p>
              </ThemeCard>
            </div>
          </ThemeCard>

          {/* Available Themes */}
          <ThemeCard>
            <h2 className="mb-6 text-2xl font-bold">Available Themes</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {['active', 'minimal', 'classic'].map((themeName) => (
                <div
                  key={themeName}
                  className={`rounded-theme border-2 p-4 ${
                    themeName === currentTheme
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <h3 className="font-semibold capitalize">{themeName}</h3>
                  <p className="mt-1 text-sm text-gray-600">Set NEXT_PUBLIC_THEME={themeName}</p>
                </div>
              ))}
            </div>
          </ThemeCard>
        </div>
      </div>
    </div>
  );
}
