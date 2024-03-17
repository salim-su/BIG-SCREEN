import { trigger, state, style, animate, transition } from '@angular/animations';

export const salimAnimation = [
  trigger('openClose', [
    // ...
    state(
      'open',
      style({
        width: `${parseFloat('490') / 192.0}rem`,
        // opacity: 1,
        // backgroundColor: 'transport'
      })
    ),
    state(
      'closed',
      style({
        width: '0px',
        // opacity: 0,
        // backgroundColor: 'transport'
      })
    ),
    transition('open => closed', [animate('0.3s')]),
    transition('closed => open', [animate('0.3s')])
  ]),
  trigger('leftToRight', [
    // ...
    state(
      'left',
      style({
        right: '0px'
      })
    ),
    state(
      'right',
      style({
        right: `${parseFloat('490') / -192.0}rem`,
        // display: 'none'
      })
    ),
    transition('left => right', [animate('0.3s')]),
    transition('right => left', [animate('0.3s')])
  ]),
  trigger('rightToLeft', [
    // ...
    state(
      'right',
      style({
        left: '0px'
      })
    ),
    state(
      'left',
      style({
        left: `${parseFloat('490') / -192.0}rem`,
        // display: 'none'
      })
    ),
    transition('left => right', [animate('0.3s')]),
    transition('right => left', [animate('0.3s')])
  ])
];
