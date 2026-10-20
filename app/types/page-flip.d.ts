// `page-flip` ships TypeScript sources but no declaration files. This covers
// the subset of its API the catalogue flipbook uses.
declare module "page-flip" {
  export interface FlipSetting {
    width: number;
    height: number;
    size?: "fixed" | "stretch";
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    startPage?: number;
    drawShadow?: boolean;
    maxShadowOpacity?: number;
    flippingTime?: number;
    usePortrait?: boolean;
    autoSize?: boolean;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    showPageCorners?: boolean;
  }

  export interface WidgetEvent {
    data: number | string | boolean | object;
  }

  export class PageFlip {
    constructor(element: HTMLElement, setting: FlipSetting);
    loadFromHTML(items: HTMLElement[]): void;
    on(event: "flip" | "init" | "changeOrientation", callback: (e: WidgetEvent) => void): this;
    flipNext(): void;
    flipPrev(): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    getOrientation(): "portrait" | "landscape";
    update(): void;
    destroy(): void;
  }
}
