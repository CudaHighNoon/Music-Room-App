// tailwind.config.js
module.exports = {
    // ...
    theme: {
      extend: {
        keyframes: {
          slideInLeft: {
            '0%': { transform: 'translateX(-100%)', opacity: '0' },
            '100%': { transform: 'translateX(0)', opacity: '1' },
          },
          slideInRight: {
            '0%': { transform: 'translateX(100%)', opacity: '0' },
            '100%': { transform: 'translateX(0)', opacity: '1' },
          },
        },
        animation: {
          slideInLeft: 'slideInLeft 1s ease-out forwards',
          slideInRight: 'slideInRight 1s ease-out forwards',
        },
      },
    },
    // ...
  };
  