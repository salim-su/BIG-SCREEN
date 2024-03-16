import { trigger, state, style, animate, transition } from '@angular/animations';

export const salimAnimation = [
  trigger('openClose', [
    // ...
    state(
      'open',
      style({
        width: '300px',
        // opacity: 1,
        backgroundColor: 'white'
      })
    ),
    state(
      'closed',
      style({
        width: '0px',
        // opacity: 0,
        backgroundColor: 'white'
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
        right: '-435px'
        // display: 'none'
      })
    ),
    transition('left => right', [animate('0.3s')]),
    transition('right => left', [animate('0.3s')])
  ])
];
