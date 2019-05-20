import { style } from 'treat';

export default style({
  marginTop: 300,
  marginLeft: 300,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 200,
  width: 200,
  backgroundColor: 'red',
  color: 'rgba(255,255,255,0)',
  '@keyframes': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
  animationTimingFunction: 'linear',
  animationDuration: '3s',
  animationFillMode: 'both',
  '@media': {
    '(min-width: 700px)': {
      ':hover': {
        '@keyframes': {
          from: {
            color: 'rgba(255,255,255,0)',
            transform: 'scale(1)',
          },
          '25%': {
            transform: 'scale(2, 3)',
          },
          '50%': {
            transform: 'scale(5, 5)',
          },
          '75%': {
            transform: 'scale(4, 0.5)',
          },
          to: {
            transform: 'scale(1)',
            color: 'rgba(255,255,255,1)',
          },
        },
        animation: '@keyframes 1.5s ease-out forwards',
      },
    },
    '(max-width: 699px)': {
      '@keyframes': {
        from: {
          transform: 'rotate(0deg)',
        },
        to: {
          transform: 'rotate(359deg)',
        },
      },
      animationTimingFunction: 'linear',
      animationDuration: '1.5s',
      animationIterationCount: 'infinite',
    },
  },
});
