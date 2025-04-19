import type { GridOptions } from "./grid";

export const createContainer = (opts: GridOptions) => {
  const container = document.createElement('div');
  container.className = 'container';
  container.style = `--size ${opts.cellSize}px;`;
  
  container.innerHTML = /* html */`
    <div class="GridHover__container" style="--size: ${opts.cellSize}px;">
      <div class="GridHover__corner GridHover__corner--top-left">
        <div class="GridHover__left"></div>
        <div class="GridHover__right"></div>
        <div class="GridHover__inner-corner"></div>
      </div>
      
      <div class="GridHover__corner GridHover__corner--top-right">
        <div class="GridHover__left"></div>
        <div class="GridHover__right"></div>
        <div class="GridHover__inner-corner"></div>
      </div>
      
      <div class="GridHover__corner GridHover__corner--bottom-right">
        <div class="GridHover__left"></div>
        <div class="GridHover__right"></div>
        <div class="GridHover__inner-corner"></div>
      </div>
      
      <div class="GridHover__corner GridHover__corner--bottom-left">
        <div class="GridHover__left"></div>
        <div class="GridHover__right"></div>
        <div class="GridHover__inner-corner"></div>
      </div>
    </div>
  `;

  return container;
}