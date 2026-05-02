import { Branding } from "@/lib/api";

interface ThemeProviderProps {
  branding: Branding | null;
  children: React.ReactNode;
}

// Convert hex to oklch (simplified - using hex for compatibility)
function hexToOklch(hex: string): string {
  // For simplicity, we'll use the hex value directly with opacity support
  // In production, you might want to use a proper color conversion library
  return hex;
}

export function ThemeProvider({ branding, children }: ThemeProviderProps) {
  if (!branding) {
    return <>{children}</>;
  }

  // Generate CSS variables from branding settings
  const cssVariables = `
    :root {
      --brand-primary: ${branding.primaryColor};
      --brand-secondary: ${branding.secondaryColor};
      --brand-accent: ${branding.accentColor};
      --font-family: "${branding.fontFamily}", sans-serif;
      --font-heading: "${branding.fontHeading}", sans-serif;
    }
    
    .dark {
      --primary: ${branding.primaryColor};
      --secondary: ${branding.secondaryColor};
      --accent: ${branding.accentColor};
    }
    
    /* Dynamic primary color classes */
    .text-gradient {
      background: linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.secondaryColor} 50%, ${branding.accentColor} 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .bg-primary-gradient {
      background: linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.secondaryColor} 100%);
    }
    
    .glow {
      box-shadow: 0 0 20px ${branding.primaryColor}40, 0 0 40px ${branding.primaryColor}20;
    }
    
    .border-primary-glow {
      border-color: ${branding.primaryColor}50;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      {children}
    </>
  );
}

// Analytics component
export function Analytics({ branding }: { branding: Branding | null }) {
  if (!branding) return null;

  return (
    <>
      {/* Google Analytics */}
      {branding.googleAnalyticsId && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${branding.googleAnalyticsId}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${branding.googleAnalyticsId}');
              `,
            }}
          />
        </>
      )}

      {/* Plausible Analytics */}
      {branding.plausibleDomain && (
        <script
          defer
          data-domain={branding.plausibleDomain}
          src="https://plausible.io/js/script.js"
        />
      )}
    </>
  );
}

// Dynamic font loader
export function FontLoader({ branding }: { branding: Branding | null }) {
  if (!branding) return null;

  const fonts = new Set([branding.fontFamily, branding.fontHeading]);
  const fontFamilies = Array.from(fonts)
    .map((font) => font?.replace(/ /g, "+"))
    .join("&family=");

  if (!fontFamilies) return null;

  return (
    <link
      rel="stylesheet"
      href={`https://fonts.googleapis.com/css2?family=${fontFamilies}:wght@400;500;600;700&display=swap`}
    />
  );
}

