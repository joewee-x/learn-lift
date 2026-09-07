const paths = {
  search: 'M21 21l-4.3-4.3M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z',
  cart: 'M3 3h2l2.4 12.2A2 2 0 009.4 17h7.3a2 2 0 002-1.6L21 7H6',
  bell: 'M15 17v1a3 3 0 11-6 0v-1m6-10a3 3 0 10-6 0c0 3-1.5 4-3 5h12c-1.5-1-3-2-3-5z',
  user: 'M20 21a8 8 0 10-16 0m8-10a4 4 0 100-8 4 4 0 000 8z',
  play: 'M6 4l14 8-14 8V4z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  x: 'M6 6l12 12M18 6L6 18',
  check: 'M20 6L9 17l-5-5',
  checkCircle: 'M9 12.5l2 2 4.5-4.5M12 21a9 9 0 100-18 9 9 0 000 18z',
  star: 'M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z',
  heart: 'M12 21C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4 8 4c1.6 0 3.1.8 4 2 0.9-1.2 2.4-2 4-2 2.8 0 5 2.4 5 5.3 0 4-4 7.2-9 11.7z',
  bookmark: 'M6 3h12v18l-6-4-6 4V3z',
  clock: 'M12 7v5l3 2m1-9a9 9 0 11-18 0 9 9 0 0118 0z',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  list: 'M4 6h16M4 12h16M4 18h16',
  chevronDown: 'M6 9l6 6 6-6',
  chevronRight: 'M9 6l6 6-6 6',
  barChart: 'M4 20V10m6 10V4m6 16v-8m4 8H2',
  dollar: 'M12 1v22m5-16.5c0 2.5-2.2 4.5-5 4.5s-5-1.8-5-4.3c0-2.1 2.1-3.9 5-3.9s5 1.7 5 3.7z',
  users: 'M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1m7-9a4 4 0 100-8 4 4 0 000 8zm8 4a4 4 0 103 0 8 8 0 017 7v2',
  message: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z',
  bellOn: 'M10 5a2 2 0 114 0m-2 14a3 3 0 003-3v-6a3 3 0 10-6 0v6a3 3 0 003 3z',
  settings: 'M10.3 4.3a2 2 0 013.4 0l.8 1.4a2 2 0 001.8 1h1.6a2 2 0 012 2v1.6c0 .7.4 1.5 1 1.8l1.4.8a2 2 0 010 3.4l-1.4.8a2 2 0 00-1 1.8v1.6a2 2 0 01-2 2h-1.6a2 2 0 00-2 1l-.7 1.3a2 2 0 01-3.4 0l-1-1.4a2 2 0 00-1.7-1H4a2 2 0 01-2-2v-1.6a2 2 0 001-1.8l.5-.9a2 2 0 000-2.8l-.5-.8a2 2 0 011.6-3h1.6a2 2 0 001.8-1l.8-1.4z',
  trash: 'M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m3 0l-.9 13a2 2 0 01-2 1.9H8.9a2 2 0 01-2-1.9L6 7',
  edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7m-16-3l5 1 7-7a2.8 2.8 0 114 4l-7 7-1 5z',
  upload: 'M12 16V4m0 0l-4 4m4-4l4 4M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3',
  download: 'M12 4v12m0 0l-4-4m4 4l4-4M4 20h16',
  shield: 'M12 3l7 3v5c0 4.4-3.1 8.3-7 9.5-3.9-1.2-7-5.1-7-9.5V6l7-3zm0 8v4m0-6h.01',
  plus: 'M12 5v14M5 12h14',
  lock: 'M5 11h14v9H5zM8 11V7a4 4 0 118 0v4',
  file: 'M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6zm0 0v6h6',
  arrowLeft: 'M15 19l-7-7 7-7',
  searchX: 'M9 3a6 6 0 016 6c0 1.4-.5 2.8-1.3 3.8l5.5 5.5-1.4 1.4-5.5-5.5A6 6 0 1114 9 6 6 0 019 3zM6 6l6 6m0-6L6 12',
  info: 'M12 8h.01M11 12h1v5h1m-3-5h1',
};

export default function Icon({ name, size = 20, className = '', strokeWidth = 2 }) {
  if (!paths[name]) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}