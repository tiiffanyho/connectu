export function ConnectULogo({ 
    size = 'medium', 
    variant = 'color',
    iconOnly = false 
  }) {
    const dimensions = {
      small: { height: 32, textSize: 24, iconSize: 28 },
      medium: { height: 48, textSize: 36, iconSize: 42 },
      large: { height: 80, textSize: 60, iconSize: 70 }
    };
  
    const { height, textSize, iconSize } = dimensions[size];
    
    const colors = {
      color: {
        gradient1: '#3B82F6', // blue-500
        gradient2: '#8B5CF6', // purple-500
        text: '#1E293B', // slate-800
        accent: '#3B82F6'
      },
      white: {
        gradient1: '#FFFFFF',
        gradient2: '#FFFFFF',
        text: '#FFFFFF',
        accent: '#FFFFFF'
      }
    };
  
    const { gradient1, gradient2, text, accent } = colors[variant];
  
    if (iconOnly) {
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`logo-gradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradient1} />
              <stop offset="100%" stopColor={gradient2} />
            </linearGradient>
          </defs>
          
          {/* Main circle background */}
          <circle cx="50" cy="50" r="45" fill={`url(#logo-gradient-${variant})`} />
          
          {/* Connection nodes */}
          <circle cx="30" cy="35" r="8" fill="white" opacity="0.9" />
          <circle cx="70" cy="35" r="8" fill="white" opacity="0.9" />
          <circle cx="50" cy="60" r="8" fill="white" opacity="0.9" />
          
          {/* Connection lines */}
          <line x1="30" y1="35" x2="50" y2="60" stroke="white" strokeWidth="3" opacity="0.7" />
          <line x1="70" y1="35" x2="50" y2="60" stroke="white" strokeWidth="3" opacity="0.7" />
          <line x1="30" y1="35" x2="70" y2="35" stroke="white" strokeWidth="3" opacity="0.7" />
        </svg>
      );
    }
  
    return (
      <div className="flex items-center gap-3" style={{ height }}>
        {/* Icon */}
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`logo-gradient-${variant}-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradient1} />
              <stop offset="100%" stopColor={gradient2} />
            </linearGradient>
          </defs>
          
          {/* Main circle background */}
          <circle cx="50" cy="50" r="45" fill={`url(#logo-gradient-${variant}-${size})`} />
          
          {/* Connection nodes */}
          <circle cx="30" cy="35" r="8" fill="white" opacity="0.9" />
          <circle cx="70" cy="35" r="8" fill="white" opacity="0.9" />
          <circle cx="50" cy="60" r="8" fill="white" opacity="0.9" />
          
          {/* Connection lines */}
          <line x1="30" y1="35" x2="50" y2="60" stroke="white" strokeWidth="3" opacity="0.7" />
          <line x1="70" y1="35" x2="50" y2="60" stroke="white" strokeWidth="3" opacity="0.7" />
          <line x1="30" y1="35" x2="70" y2="35" stroke="white" strokeWidth="3" opacity="0.7" />
        </svg>
  
        {/* Text */}
        <div className="flex items-baseline" style={{ fontSize: textSize, lineHeight: 1 }}>
          <span style={{ color: text }}>connect</span>
          <span 
            style={{ 
              background: `linear-gradient(135deg, ${gradient1}, ${gradient2})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            U
          </span>
        </div>
      </div>
    );
  }
  