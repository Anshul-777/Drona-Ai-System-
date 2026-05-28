import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
}

// Helper for ornate background filigree
const OrnateBackground = ({ color }: { color: string }) => (
  <>
    <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="0.5" fill="none" opacity="0.1" />
    <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="1" strokeDasharray="2 4" fill="none" opacity="0.3" />
    <path d="M50 2 L50 10 M50 90 L50 98 M2 50 L10 50 M90 50 L98 50" stroke={color} strokeWidth="1.5" opacity="0.5" />
    <path d="M16 16 L22 22 M78 78 L84 84 M16 84 L22 78 M84 16 L78 22" stroke={color} strokeWidth="1" opacity="0.3" />
  </>
);

// 1. Infinity Heart (Welcome)
export const IconInfinityHeart = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <path d="M50 85 C 10 55, 10 25, 30 15 C 45 7.5, 50 25, 50 25 C 50 25, 55 7.5, 70 15 C 90 25, 90 55, 50 85 Z" strokeWidth="2.5" />
    <path d="M30 15 C 15 30, 35 60, 50 50 C 65 40, 85 30, 70 15" strokeWidth="1" opacity="0.5" />
    <circle cx="50" cy="40" r="6" fill={color} opacity="0.8" />
    <path d="M50 34 L50 46 M44 40 L56 40" stroke="#fff" strokeWidth="1.5" />
  </svg>
);

// 2. Gateway Portal (First Login)
export const IconPortal = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <path d="M30 80 L30 30 C 30 15, 70 15, 70 30 L70 80" strokeWidth="3" />
    <path d="M40 80 L40 35 C 40 25, 60 25, 60 35 L60 80" strokeWidth="1.5" opacity="0.6" />
    <circle cx="50" cy="50" r="10" fill={color} opacity="0.2" strokeWidth="1" />
    <circle cx="50" cy="50" r="4" fill={color} />
    <path d="M50 50 L50 80" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M20 80 L80 80" strokeWidth="3" />
  </svg>
);

// 3. DNA Helix / Forge (Profile)
export const IconHelix = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <path d="M35 20 Q 65 50 35 80" strokeWidth="2.5" />
    <path d="M65 20 Q 35 50 65 80" strokeWidth="2.5" />
    <line x1="38" y1="30" x2="62" y2="30" strokeWidth="1.5" opacity="0.5" />
    <line x1="45" y1="40" x2="55" y2="40" strokeWidth="1.5" opacity="0.5" />
    <line x1="45" y1="60" x2="55" y2="60" strokeWidth="1.5" opacity="0.5" />
    <line x1="38" y1="70" x2="62" y2="70" strokeWidth="1.5" opacity="0.5" />
    <circle cx="50" cy="50" r="8" fill={color} opacity="0.9" />
    <polygon points="50,45 54,55 46,55" fill="#111" />
  </svg>
);

// 4. Interlocking Rings (First Message)
export const IconRings = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <circle cx="40" cy="50" r="18" strokeWidth="2.5" />
    <circle cx="60" cy="50" r="18" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="6" fill={color} opacity="0.8" />
    <path d="M30 50 L15 50 M70 50 L85 50 M50 30 L50 15 M50 70 L50 85" strokeWidth="1.5" opacity="0.5" />
  </svg>
);

// 5. Hourglass (Ten Sessions)
export const IconHourglass = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <path d="M35 20 L65 20 L55 50 L65 80 L35 80 L45 50 Z" strokeWidth="2.5" />
    <path d="M40 20 L60 20" strokeWidth="4" />
    <path d="M40 80 L60 80" strokeWidth="4" />
    <circle cx="50" cy="65" r="5" fill={color} />
    <path d="M50 35 L50 60" strokeWidth="1" strokeDasharray="2 2" />
    <path d="M25 50 L75 50" strokeWidth="1" opacity="0.3" />
  </svg>
);

// 6. Winged Book (Speed Reader)
export const IconWingedBook = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    {/* Book */}
    <path d="M50 75 L35 70 L35 40 L50 45 Z" strokeWidth="2" fill={color} fillOpacity="0.2" />
    <path d="M50 75 L65 70 L65 40 L50 45 Z" strokeWidth="2" fill={color} fillOpacity="0.2" />
    <path d="M50 45 L50 75" strokeWidth="2" />
    {/* Wings */}
    <path d="M35 55 Q 15 40 20 20 Q 30 30 45 40" strokeWidth="1.5" fill={color} fillOpacity="0.1" />
    <path d="M65 55 Q 85 40 80 20 Q 70 30 55 40" strokeWidth="1.5" fill={color} fillOpacity="0.1" />
    <path d="M35 65 Q 10 50 15 30" strokeWidth="1" opacity="0.5" />
    <path d="M65 65 Q 90 50 85 30" strokeWidth="1" opacity="0.5" />
  </svg>
);

// 7. Third Eye / Lotus (Deep Focus)
export const IconLotusEye = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <path d="M50 75 C 20 75, 20 45, 50 25 C 80 45, 80 75, 50 75 Z" strokeWidth="2.5" />
    <path d="M50 75 C 35 75, 35 50, 50 35 C 65 50, 65 75, 50 75 Z" strokeWidth="1.5" fill={color} fillOpacity="0.2" />
    <ellipse cx="50" cy="55" rx="8" ry="4" fill={color} />
    <circle cx="50" cy="55" r="2" fill="#111" />
    <path d="M50 25 L50 10" strokeWidth="2" />
    <path d="M50 10 L45 15 M50 10 L55 15" strokeWidth="1.5" />
  </svg>
);

// 8. Crescent Moon (Night Owl)
export const IconMoon = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <path d="M60 20 A 30 30 0 0 0 60 80 A 35 35 0 0 1 60 20 Z" strokeWidth="2.5" fill={color} fillOpacity="0.2" />
    <circle cx="35" cy="40" r="2" fill={color} />
    <circle cx="45" cy="25" r="1.5" fill={color} opacity="0.6" />
    <circle cx="30" cy="60" r="1" fill={color} opacity="0.8" />
    <path d="M35 35 L35 45 M30 40 L40 40" strokeWidth="1" opacity="0.5" />
  </svg>
);

// 9. Rising Sun (Early Bird)
export const IconSun = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <path d="M20 65 L80 65" strokeWidth="3" />
    <path d="M25 70 L75 70" strokeWidth="1.5" opacity="0.5" />
    <path d="M30 65 A 20 20 0 0 1 70 65" strokeWidth="2.5" fill={color} fillOpacity="0.2" />
    {/* Sun rays */}
    <path d="M50 40 L50 20 M35 45 L20 30 M65 45 L80 30 M40 40 L30 20 M60 40 L70 20" strokeWidth="1.5" strokeDasharray="3 3" />
    <circle cx="50" cy="55" r="4" fill={color} />
  </svg>
);

// 10. Flame Shield (Seven Streak)
export const IconFlameShield = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <path d="M30 20 L70 20 L70 50 C 70 70, 50 85, 50 85 C 50 85, 30 70, 30 50 Z" strokeWidth="2.5" />
    <path d="M35 25 L65 25 L65 48 C 65 62, 50 76, 50 76 C 50 76, 35 62, 35 48 Z" strokeWidth="1" opacity="0.5" />
    <path d="M50 70 C 40 60, 45 45, 50 35 C 55 45, 60 60, 50 70 Z" fill={color} fillOpacity="0.8" />
  </svg>
);

// 11. Sword & Anvil (First Test)
export const IconSwordAnvil = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    {/* Anvil */}
    <path d="M35 70 L65 70 L70 80 L30 80 Z" fill={color} fillOpacity="0.2" strokeWidth="2" />
    <path d="M40 70 L40 60 L60 60 L60 70" strokeWidth="2" />
    {/* Sword */}
    <path d="M50 15 L45 35 L50 65 L55 35 Z" fill={color} strokeWidth="1.5" />
    <path d="M40 30 L60 30 M50 15 L50 10 M47 10 L53 10" strokeWidth="2" />
  </svg>
);

// 12. Crown / Wreath (Perfect Score)
export const IconCrown = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <path d="M25 65 L30 35 L40 50 L50 25 L60 50 L70 35 L75 65 Z" strokeWidth="2.5" fill={color} fillOpacity="0.2" />
    <path d="M25 70 L75 70" strokeWidth="3" />
    <circle cx="30" cy="30" r="2" fill={color} />
    <circle cx="50" cy="20" r="3" fill={color} />
    <circle cx="70" cy="30" r="2" fill={color} />
    {/* Wreath leaves */}
    <path d="M20 50 C 10 30, 30 20, 20 50 M80 50 C 90 30, 70 20, 80 50" strokeWidth="1.5" opacity="0.6" />
  </svg>
);

// 13. Phoenix (Comeback)
export const IconPhoenix = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    {/* Body/Head */}
    <path d="M50 60 C 45 40, 55 30, 50 15 C 45 30, 55 40, 50 60" fill={color} />
    <circle cx="50" cy="22" r="2" fill="#111" />
    {/* Wings */}
    <path d="M48 45 C 20 40, 15 15, 15 15 C 25 30, 40 35, 48 55" strokeWidth="2" fill={color} fillOpacity="0.2" />
    <path d="M52 45 C 80 40, 85 15, 85 15 C 75 30, 60 35, 52 55" strokeWidth="2" fill={color} fillOpacity="0.2" />
    {/* Tail */}
    <path d="M45 65 L30 85 M50 65 L50 90 M55 65 L70 85" strokeWidth="1.5" opacity="0.6" />
  </svg>
);

// 14. Lightning Gear (Speed Demon)
export const IconLightningGear = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    {/* Gear */}
    <circle cx="50" cy="50" r="20" strokeWidth="2.5" strokeDasharray="8 4" />
    <circle cx="50" cy="50" r="14" strokeWidth="1" opacity="0.5" />
    {/* Lightning */}
    <path d="M55 15 L35 55 L50 55 L45 85 L65 45 L50 45 Z" fill={color} strokeWidth="1.5" />
  </svg>
);

// 15. Crossed Swords (Gladiator)
export const IconCrossedSwords = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    {/* Sword 1 */}
    <path d="M20 80 L80 20" strokeWidth="2.5" />
    <path d="M25 85 L15 75 M20 80 L15 85" strokeWidth="2" />
    <polygon points="75,25 80,20 85,25" fill={color} />
    {/* Sword 2 */}
    <path d="M80 80 L20 20" strokeWidth="2.5" />
    <path d="M75 85 L85 75 M80 80 L85 85" strokeWidth="2" />
    <polygon points="25,25 20,20 15,25" fill={color} />
    {/* Shield Center */}
    <path d="M40 40 L60 40 L60 55 C 60 65, 50 70, 50 70 C 50 70, 40 65, 40 55 Z" fill={color} fillOpacity="0.9" />
  </svg>
);

// 16. Crystal Ball / Robot (Agent Whisperer)
export const IconCrystalBall = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <circle cx="50" cy="45" r="22" strokeWidth="2.5" fill={color} fillOpacity="0.1" />
    <path d="M35 45 A 15 15 0 0 1 65 45" strokeWidth="1.5" opacity="0.5" />
    <path d="M40 75 L60 75 L65 85 L35 85 Z" strokeWidth="2" fill={color} fillOpacity="0.3" />
    <circle cx="43" cy="40" r="2" fill={color} />
    <circle cx="57" cy="40" r="2" fill={color} />
    <path d="M45 55 L55 55" strokeWidth="1.5" />
  </svg>
);

// 17. Magnifying Labyrinth (Deep Search)
export const IconLabyrinth = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <circle cx="45" cy="45" r="15" strokeWidth="2.5" fill={color} fillOpacity="0.1" />
    <path d="M56 56 L75 75" strokeWidth="3" />
    <path d="M70 70 L75 65 M65 75 L70 80" strokeWidth="1.5" />
    {/* Labyrinth rings */}
    <circle cx="45" cy="45" r="8" strokeWidth="1" opacity="0.4" strokeDasharray="4 2" />
    <circle cx="45" cy="45" r="4" fill={color} />
  </svg>
);

// 18. Palette / Star Eye (Image Gen)
export const IconStarEye = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <path d="M20 50 Q 50 20 80 50 Q 50 80 20 50" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="12" strokeWidth="1.5" />
    <path d="M50 42 L52 48 L58 50 L52 52 L50 58 L48 52 L42 50 L48 48 Z" fill={color} />
    <circle cx="30" cy="50" r="1.5" fill={color} opacity="0.5" />
    <circle cx="70" cy="50" r="1.5" fill={color} opacity="0.5" />
  </svg>
);

// 19. Scroll (Thousand Messages)
export const IconScroll = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <path d="M30 25 L70 25 L70 75 L30 75 Z" strokeWidth="2" fill={color} fillOpacity="0.1" />
    <path d="M30 25 C 30 15, 20 15, 20 25 C 20 35, 30 35, 30 25" strokeWidth="2" />
    <path d="M70 75 C 70 85, 80 85, 80 75 C 80 65, 70 65, 70 75" strokeWidth="2" />
    <path d="M40 40 L60 40 M40 50 L60 50 M40 60 L50 60" strokeWidth="1.5" opacity="0.7" />
    <circle cx="50" cy="50" r="4" fill={color} opacity="0.3" />
  </svg>
);

// 20. Wand / Terminal (Slash Master)
export const IconWand = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <path d="M25 75 L65 35" strokeWidth="3" />
    <path d="M60 40 L70 30" strokeWidth="1.5" />
    <path d="M70 20 L75 15 M80 30 L85 25 M65 15 L70 10" strokeWidth="1.5" strokeDasharray="2 2" />
    <polygon points="65,35 75,25 80,30 70,40" fill={color} />
    <circle cx="75" cy="25" r="4" fill={color} />
    <path d="M30 80 L20 70" strokeWidth="2" />
  </svg>
);

// 21. Single Star (Level 10)
export const IconOneStar = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <path d="M50 20 L58 40 L80 40 L62 55 L68 75 L50 63 L32 75 L38 55 L20 40 L42 40 Z" fill={color} fillOpacity="0.8" strokeWidth="1" />
    <circle cx="50" cy="50" r="30" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
  </svg>
);

// 22. Three Stars (Level 50)
export const IconThreeStars = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <path d="M50 15 L55 30 L70 30 L58 40 L62 55 L50 45 L38 55 L42 40 L30 30 L45 30 Z" fill={color} fillOpacity="0.9" />
    <path d="M25 45 L28 55 L38 55 L30 65 L33 75 L25 68 L17 75 L20 65 L12 55 L22 55 Z" fill={color} fillOpacity="0.6" />
    <path d="M75 45 L78 55 L88 55 L80 65 L83 75 L75 68 L67 75 L70 65 L62 55 L72 55 Z" fill={color} fillOpacity="0.6" />
    <path d="M25 80 Q 50 95 75 80" strokeWidth="1.5" opacity="0.4" />
  </svg>
);

// 23. Solar Emblem (Level 99)
export const IconSolar = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <circle cx="50" cy="50" r="15" fill={color} fillOpacity="0.9" />
    <circle cx="50" cy="50" r="22" strokeWidth="2" strokeDasharray="4 4" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
      <path key={deg} d="M50 22 L53 10 L50 2 L47 10 Z" fill={color} transform={`rotate(${deg} 50 50)`} />
    ))}
    <circle cx="50" cy="50" r="8" fill="#111" />
  </svg>
);

// 24. Dragon/Boss (Boss Slayer)
export const IconDragon = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <path d="M50 80 L30 40 L40 25 L50 35 L60 25 L70 40 Z" strokeWidth="2.5" fill={color} fillOpacity="0.2" />
    <path d="M50 35 L50 60" strokeWidth="2" />
    <circle cx="42" cy="45" r="2" fill={color} />
    <circle cx="58" cy="45" r="2" fill={color} />
    <path d="M35 20 L40 30 M65 20 L60 30" strokeWidth="2" />
    <path d="M45 70 L55 70" strokeWidth="1.5" />
  </svg>
);

// 25. Chest/Gems (Hoarder)
export const IconChest = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <path d="M25 45 L75 45 L75 75 L25 75 Z" strokeWidth="2" fill={color} fillOpacity="0.1" />
    <path d="M25 45 C 25 25, 75 25, 75 45" strokeWidth="2" fill={color} fillOpacity="0.3" />
    <path d="M25 55 L75 55" strokeWidth="1.5" opacity="0.5" />
    <rect x="45" y="42" width="10" height="10" fill={color} />
    <circle cx="50" cy="47" r="2" fill="#111" />
    <polygon points="50,20 55,30 45,30" fill={color} />
    <polygon points="35,25 40,32 30,32" fill={color} opacity="0.7" />
    <polygon points="65,25 70,32 60,32" fill={color} opacity="0.7" />
  </svg>
);

// 26. Network Nodes (Share First)
export const IconNetwork = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <circle cx="50" cy="50" r="8" fill={color} />
    <circle cx="30" cy="30" r="5" fill={color} opacity="0.7" />
    <circle cx="70" cy="30" r="5" fill={color} opacity="0.7" />
    <circle cx="30" cy="70" r="5" fill={color} opacity="0.7" />
    <circle cx="70" cy="70" r="5" fill={color} opacity="0.7" />
    <path d="M34 34 L45 45 M66 34 L55 45 M34 66 L45 55 M66 66 L55 55" strokeWidth="2" />
    <circle cx="50" cy="50" r="25" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
  </svg>
);

// 27. Envelope Seal (Notification)
export const IconEnvelope = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <path d="M20 35 L80 35 L80 75 L20 75 Z" strokeWidth="2" fill={color} fillOpacity="0.1" />
    <path d="M20 35 L50 55 L80 35" strokeWidth="2" />
    <path d="M20 75 L40 60 M80 75 L60 60" strokeWidth="1.5" opacity="0.5" />
    <circle cx="50" cy="55" r="8" fill={color} />
    <path d="M47 55 L50 58 L55 52" stroke="#111" strokeWidth="1.5" />
  </svg>
);

// 28. Storefront / Coin (Shop Visitor)
export const IconCoinStore = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <circle cx="50" cy="50" r="18" strokeWidth="3" fill={color} fillOpacity="0.2" />
    <circle cx="50" cy="50" r="12" strokeWidth="1" strokeDasharray="2 2" />
    <path d="M45 40 L55 40 M45 60 L55 60 M50 35 L50 65" strokeWidth="2" />
    <path d="M30 80 L70 80 M40 80 L40 70 M60 80 L60 70" strokeWidth="2" />
    <path d="M35 30 L65 30 L50 15 Z" fill={color} fillOpacity="0.5" />
  </svg>
);

// 29. Inferno (Thirty Streak)
export const IconInferno = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <path d="M50 10 C 60 30, 80 40, 80 60 C 80 80, 65 90, 50 90 C 35 90, 20 80, 20 60 C 20 40, 40 30, 50 10 Z" strokeWidth="2" fill={color} fillOpacity="0.2" />
    <path d="M50 30 C 55 45, 65 55, 65 70 C 65 80, 55 85, 50 85 C 45 85, 35 80, 35 70 C 35 55, 45 45, 50 30 Z" fill={color} fillOpacity="0.6" />
    <path d="M50 50 C 52 60, 55 65, 55 75 C 55 80, 52 82, 50 82 C 48 82, 45 80, 45 75 C 45 65, 48 60, 50 50 Z" fill="#fff" />
  </svg>
);

// 30. Compass (Explorer)
export const IconCompass = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <circle cx="50" cy="50" r="25" strokeWidth="2" />
    <circle cx="50" cy="50" r="20" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
    <path d="M50 15 L55 45 L85 50 L55 55 L50 85 L45 55 L15 50 L45 45 Z" fill={color} fillOpacity="0.8" />
    <path d="M50 15 L50 85 M15 50 L85 50" stroke="#111" strokeWidth="1" />
    <circle cx="50" cy="50" r="3" fill="#111" />
    <path d="M30 30 L35 35 M70 30 L65 35 M30 70 L35 65 M70 70 L65 65" strokeWidth="2" />
  </svg>
);

// 31. Spark (Infinite Tester)
export const IconSpark = ({ color = "currentColor", ...props }: IconProps) => (
  <svg viewBox="0 0 100 100" fill="none" stroke={color} {...props}>
    <OrnateBackground color={color} />
    <path d="M50 20 Q 50 50 80 50 Q 50 50 50 80 Q 50 50 20 50 Q 50 50 50 20 Z" fill={color} strokeWidth="1" />
    <circle cx="50" cy="50" r="6" fill="#fff" />
    <circle cx="50" cy="50" r="15" strokeWidth="1" strokeDasharray="2 4" />
    <path d="M35 35 L25 25 M65 35 L75 25 M35 65 L25 75 M65 65 L75 75" strokeWidth="1.5" opacity="0.6" />
  </svg>
);

// --- Mapping Function ---

export const getAchievementIcon = (id: string, color: string, className?: string) => {
  const props = { color, className };
  switch (id) {
    case "welcome-to-drona": return <IconInfinityHeart {...props} />;
    case "test-infinite-claim": return <IconSpark {...props} />;
    case "first-login": return <IconPortal {...props} />;
    case "profile-complete": return <IconHelix {...props} />;
    case "first-message": return <IconRings {...props} />;
    case "ten-sessions": return <IconHourglass {...props} />;
    case "speed-reader": return <IconWingedBook {...props} />;
    case "deep-focus": return <IconLotusEye {...props} />;
    case "night-owl": return <IconMoon {...props} />;
    case "early-bird": return <IconSun {...props} />;
    case "seven-streak": return <IconFlameShield {...props} />;
    case "first-test": return <IconSwordAnvil {...props} />;
    case "perfect-score": return <IconCrown {...props} />;
    case "comeback": return <IconPhoenix {...props} />;
    case "speed-demon": return <IconLightningGear {...props} />;
    case "arena-gladiator": return <IconCrossedSwords {...props} />;
    case "agent-whisperer": return <IconCrystalBall {...props} />;
    case "deep-search": return <IconLabyrinth {...props} />;
    case "image-gen": return <IconStarEye {...props} />;
    case "thousand-messages": return <IconScroll {...props} />;
    case "slash-master": return <IconWand {...props} />;
    case "level-10": return <IconOneStar {...props} />;
    case "level-50": return <IconThreeStars {...props} />;
    case "level-99": return <IconSolar {...props} />;
    case "boss-slayer": return <IconDragon {...props} />;
    case "hoarder": return <IconChest {...props} />;
    case "share-first": return <IconNetwork {...props} />;
    case "notification-reader": return <IconEnvelope {...props} />;
    case "shop-visitor": return <IconCoinStore {...props} />;
    case "thirty-streak": return <IconInferno {...props} />;
    case "explorer": return <IconCompass {...props} />;
    default: return <IconSpark {...props} />;
  }
};
