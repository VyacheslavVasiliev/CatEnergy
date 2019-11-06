// Мне лень создавать несколько js файлов и париться со сброщиком

;(()=>{
  class CreateHorizontalSlider {
    constructor(body, lever) {
      this._body = body;
      this._lever = lever;
  
      this._onMouseDown = this._onMouseDown.bind(this)
      this._onTouchStart = this._onTouchStart.bind(this);
      this._drag = this._drag.bind(this);
      this._drop = this._drop.bind(this);
  
      this._preperSlider();

      this._lever.addEventListener("mousedown", this._onMouseDown);
      this._lever.addEventListener("touchstart", this._onTouchStart);
  
      this._lever.addEventListener("dragstart", (event)=>{
        event.preventDefault();
      });
      this.listeners = new Set();
    }

    _preperSlider(){
      this._lever.style.zIndex = "1000";
      this._lever.style.transform = "none";
  
      const leverCenterYPosition = this._body.offsetHeight / 2 - this._lever.offsetHeight / 2; // ставит рычажок на цент слайдера
      const leverCenterXPosition = this._body.offsetWidth / 2 - this._lever.offsetWidth / 2;

      this._lever.style.top = leverCenterYPosition + "px";
      this._lever.style.left = leverCenterXPosition + "px";
    }
  
    _onMouseDown(event) {
      this._preperDrag(event)
  
      document.addEventListener("mousemove", this._drag);
  
      document.addEventListener("mouseup", this._drop);
    }
  
    _onTouchStart(event){
      this._preperDrag(event);
  
      document.addEventListener("touchmove", this._drag);
  
      document.addEventListener("touchend", this._drop);
    }
  
    _preperDrag(event) {
      const cursorCoord = event.clientX || event.targetTouches[0].clientX;

      this._shiftX = cursorCoord - this._lever.getBoundingClientRect().left; // кооринаты курсора относительно рычажка

      const leverBodyCoord = cursorCoord - this._shiftX  - this._body.getBoundingClientRect().left;

      this._moveAt(leverBodyCoord);
    }

    _drag(event) {
      const cursorCoord = event.clientX || event.targetTouches[0].clientX;
      const leverBodyCoord = cursorCoord - this._shiftX  - this._body.getBoundingClientRect().left;
  
      this._moveAt(leverBodyCoord);
    }
  
    _drop() {
      document.removeEventListener("mousemove", this._drag);
      document.removeEventListener("mouseup", this._drop);
      
      document.removeEventListener("touchmove", this._drag);
      document.removeEventListener("touchend", this._drop);
    }
  
    _moveAt(coord) {
      if (coord < 0){
        coord = 0;
      };
      const workAreaWidth = this._body.offsetWidth - this._lever.offsetWidth;
      if(coord > workAreaWidth){
        coord = workAreaWidth;
      };
      this._lever.style.left = coord + "px";
  
      const shiftProcent = +(coord / workAreaWidth * 100).toFixed(3)
  
      // добавь возможность не слушать нули и сотню
      // реализуй "тротлинг"
      this._listenersIteraction(shiftProcent);
    }
  
    _listenersIteraction(procent){
      this.listeners.forEach((listener) => listener(procent));
    }
  
    addShiftProcentListener(listener){
      this.listeners.add(listener);
    }
  
    removeShiftProcentListener(listener){
      this.listeners.delete(listener);
    }
  }

  window.CreateHorizontalSlider = CreateHorizontalSlider;
})();

;(()=>{
  const {CreateHorizontalSlider} = window;

  class ButtonsHorizontalSlider extends CreateHorizontalSlider{
    constructor(body, lever){
      super(body, lever);

      this._step = 2;
      this._timeout = 10

      this._onButtonRightMouseDown = this._onButtonRightMouseDown.bind(this);
      this._onButtonLeftMouseDown = this._onButtonLeftMouseDown.bind(this);
      this._onButtonMouseUp = this._onButtonMouseUp.bind(this);
    }

    _onButtonRightMouseDown(){
      document.addEventListener("mouseup", this._onButtonMouseUp);
      document.addEventListener("touchend", this._onButtonMouseUp);

      this._leverShiftRight();
    }

    _onButtonLeftMouseDown(){
      document.addEventListener("mouseup", this._onButtonMouseUp);
      document.addEventListener("touchend", this._onButtonMouseUp);

      this._leverShiftLeft();
    }

    _onButtonMouseUp(){
      clearTimeout(this._timerId);
      document.removeEventListener("mouseup", this._onButtonMouseUp);
      document.removeEventListener("touchend", this._onButtonMouseUp);
    }

    _getLeverBodyCoord(){
      const leverLeft = this._lever.offsetLeft; // при вычисленни по относительным координатам выдает погрешность в 1 пиксель хз почему
      return leverLeft;
    }

    _leverShiftRight(){
      const leverLeft = this._getLeverBodyCoord() + this._step;
      this._moveAt(leverLeft);
      this._timerId = setTimeout(() => {
        this._leverShiftRight();
      }, this._timeout);
    }

    _leverShiftLeft(){
      const leverLeft = this._getLeverBodyCoord() - this._step;
      this._moveAt(leverLeft);
      this._timerId = setTimeout(() => {
        this._leverShiftLeft();
      }, this._timeout);
    }

    get timeout(){
      return this._timeout;
    }

    set timeout(timeout){
      if(isNaN(parseFloat(timeout)) && !isFinite(timeout)){
        throw new Error("timeout Требуется числовое значение")
      };
      this._timeout = +timeout;
    }
    
    get step(){
      return this._step;
    }

    set step(step){
      if(isNaN(parseFloat(step)) && !isFinite(step)){
        throw new Error("step Требуется числовое значение")
      };
      this._step = +step;
    }

    setButtonLeft(buttonLeft){
      this._buttonLeft = buttonLeft;
      this._buttonLeft.addEventListener("mousedown", this._onButtonLeftMouseDown);
      this._buttonLeft.addEventListener("touchstart", this._onButtonLeftMouseDown);
    }

    setButtonRight(buttonRight){
      this._buttonRight = buttonRight;
      this._buttonRight.addEventListener("mousedown", this._onButtonRightMouseDown);
      this._buttonRight.addEventListener("touchstart", this._onButtonRightMouseDown);
    }
  };

  window.ButtonsHorizontalSlider = ButtonsHorizontalSlider;
})();

;(()=>{
  class CutImage {
    setImgLeft(cutWrapper, img){
      this._cutWrapperLeft = cutWrapper;
      this._imgLeft = img;
    }

    setImgRight(cutWrapper, img){
      this._cutWrapperRight = cutWrapper;
      this._imgRight = img;
    }
  
    cutImgLeft(procent){
      this._imgLeft.style.left = procent  + 50 + "%";
      this._cutWrapperLeft.style.left = - procent + "%";
    }
  
    cutImgRight(procent){
      this._imgRight.style.left = procent - 50 + "%";
      this._cutWrapperRight.style.left = 100 - procent  + "%";
    }
  };

  window.CutImage = CutImage;
})();

;(()=>{
  const viewportWidth = document.documentElement.clientWidth;

  if(viewportWidth <= 768){
    const buttonBefore = document.querySelector(".slider__button--before");
    const buttonAfter = document.querySelector(".slider__button--after");
    const representation = document.querySelector(".representation");

    buttonBefore.addEventListener("click", ()=>{
      representation.classList.remove("representation__show--after");
    })

    buttonAfter.addEventListener("click", ()=>{
      representation.classList.add("representation__show--after");
    })
  }
})();

;(()=>{
  const viewportWidth = document.documentElement.clientWidth;

  if(viewportWidth >= 768){
    const {ButtonsHorizontalSlider} = window;

    const body = document.querySelector(".silder__body");
    const lever = document.querySelector(".slider__lever");
    const buttonBefore = document.querySelector(".slider__button--before");
    const buttonAfter = document.querySelector(".slider__button--after");
    
    const slider = new ButtonsHorizontalSlider(body, lever);
    slider.setButtonLeft(buttonBefore);
    slider.setButtonRight(buttonAfter);
    window.slider = slider;
  }

})();

;(()=>{
  const viewportWidth = document.documentElement.clientWidth;

  if(viewportWidth >= 768){
    const {slider, CutImage} = window;

    const cutImgBeforeWrapper = document.querySelector(".representation__cut--before");
    const imgBefore = document.querySelector(".representation__image--before");

    const cutImgAfterWrapper = document.querySelector(".representation__cut--after");
    const imgAfter = document.querySelector(".representation__image--after");

    const cutImg = new CutImage;

    cutImg.setImgLeft(cutImgBeforeWrapper, imgBefore);
    cutImg.setImgRight(cutImgAfterWrapper, imgAfter);

    slider.addShiftProcentListener((proc)=>cutImg.cutImgLeft(proc));
    slider.addShiftProcentListener((proc)=>cutImg.cutImgRight(proc));
  }
})();
