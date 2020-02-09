/*
 * @component SSwipe
 * @description This component is used to determine the swiping order on element
 */

import { Component, h, Prop, EventEmitter, Event, Watch } from '@stencil/core';

import { ISwipeEvent } from "../../utils/interface";

@Component({
  tag: 's-swipe',
  styleUrl: 's-swipe.scss'
})
export class SSwipe {

  @Prop() timeThreshold: number = 100

  @Watch('timeThreshold')
  validateTimeThreshold(newValue: number) {
    const isUndefined = typeof newValue === 'undefined' || newValue === null;
    if (isUndefined) { throw new Error('Invalid time threshold') };
  }

  @Prop() thresholdX: number = 30

  @Watch('thresholdX')
  validateThresholdX(newValue: number) {
    const isUndefined = typeof newValue === 'undefined' || newValue === null;
    if (isUndefined) { throw new Error('Invalid threshold X') };
  }

  @Prop() thresholdY: number = 30

  @Watch('thresholdY')
  validateThresholdY(newValue: number) {
    const isUndefined = typeof newValue === 'undefined' || newValue === null;
    if (isUndefined) { throw new Error('Invalid threshold Y') };
  }

  /*
  * @name handleTouchStart
  * @e {Event} TouchStart
  * @description Handle the touch start event, store the coordinates and set the timer for touch event
  * @return none
  */
  @Event() sSwipe: EventEmitter<ISwipeEvent>;

  // Local Methods

  /*
  * @name handleTouchStart
  * @e {Event} TouchStart
  * @description Handle the touch start event, store the coordinates and set the timer for touch event
  * @return none
  */
  handleTouchStart = (e) => {
    this.startX = e.touches[0].clientX; //This is where touchstart coordinates are stored
    this.startY = e.touches[0].clientY;;

    this.time = setInterval(() => { //Let's see how long the swipe lasts.
      this.totalTime += 10;
    }, 10);
  }

  /*
  * @name handleTouchEnd
  * @e {Event} TouchEnd
  * @description
  * Handle the touch end event, store the coordinates
  * Clear the timer for touch event
  * Fire the SSwipe event
  * @return none
  */
  handleTouchEnd = (e) => {
    this.endX = e.changedTouches[0].clientX;
    this.endY = e.changedTouches[0].clientY;
    // Let's stop calculating time and free up resources.
    clearInterval(this.time);
    if (this.totalTime >= this.timeThreshold) {
      let res = this.calculateSwipeDirection(this.startX, this.startY, this.endX, this.endY, 30, 30)
      this.sSwipe.emit(res);
    }
    this.totalTime = 0;
  }

  /*
  * @name calculateSwipeDirection
  * @Params
  * startX {Number} Touch event start  x-axis
  * startY {Number} Touch event start y-axis
  * endX {Number} Touch event end x-axis
  * endY {Number} Touch event end y-axis
  * thresholdX {Number}
  * thresholdY {Number}
  * @Description Calculate the swipe direction and determine the swipe events
  * @return {Object}
  * up {boolean} false
  * right {boolean} false
  * down {boolean} false
  * left {boolean} false
  */
  calculateSwipeDirection = (startX, startY, endX, endY, thresholdX, thresholdY): ISwipeEvent => {
    var swipeDirection: ISwipeEvent = { up: false, right: false, down: false, left: false };
    if (startX > endX && startX - endX >= thresholdX)
      swipeDirection.left = true;
    else if (startX < endX && endX - startX >= thresholdX)
      swipeDirection.right = true;

    if (startY < endY && endY - startY >= thresholdY)
      swipeDirection.down = true
    else if (startY > endY && startY - endY >= thresholdY)
      swipeDirection.up = true;

    return swipeDirection;
  }


  // Store Position when touch begins
  startX: number;
  startY: number;

  // Store Position when touch ends
  endX: number;
  endY: number;

  // Store time
  time: number;
  // Total time that the swipe took
  totalTime: number = 0;


  render() {
    return (
      <div class="height" onTouchStart={(e) => this.handleTouchStart(e)} onTouchEnd={(e) => this.handleTouchEnd(e)}>
        <slot />
      </div>
    );
  }
}
