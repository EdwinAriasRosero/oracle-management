import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  OnInit,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: '[appResizable]',
  standalone: true,
})
export class ResizableDirective implements OnInit, OnDestroy {
  @Input('appResizable') resizableDirection: 'horizontal' | 'vertical' | 'both' = 'both';
  @Input() minWidth = 50;
  @Input() maxWidth = 5000;
  @Input() minHeight = 50;
  @Input() maxHeight = 5000;

  private isResizing = false;
  private resizeHandle: HTMLDivElement | null = null;
  private readonly resizeHandleSize = 5;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.setupResizeHandle();
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
  }

  ngOnDestroy() {
    if (this.resizeHandle) {
      this.renderer.removeChild(this.el.nativeElement, this.resizeHandle);
    }
  }

  private setupResizeHandle() {
    const handle = this.renderer.createElement('div');
    this.renderer.addClass(handle, 'resize-handle');
    this.renderer.setStyle(handle, 'position', 'absolute');
    this.renderer.setStyle(handle, 'background', '#333333');
    this.renderer.setStyle(handle, 'z-index', '10');

    if (this.resizableDirection === 'both') {
      this.renderer.setStyle(handle, 'bottom', '0');
      this.renderer.setStyle(handle, 'right', '0');
      this.renderer.setStyle(handle, 'width', `${this.resizeHandleSize}px`);
      this.renderer.setStyle(handle, 'height', `${this.resizeHandleSize}px`);
      this.renderer.setStyle(handle, 'cursor', 'nwse-resize');
    } else if (this.resizableDirection === 'horizontal') {
      this.renderer.setStyle(handle, 'top', '0');
      this.renderer.setStyle(handle, 'right', '0');
      this.renderer.setStyle(handle, 'width', `${this.resizeHandleSize}px`);
      this.renderer.setStyle(handle, 'height', '100%');
      this.renderer.setStyle(handle, 'cursor', 'ew-resize');
    } else if (this.resizableDirection === 'vertical') {
      this.renderer.setStyle(handle, 'bottom', '0');
      this.renderer.setStyle(handle, 'left', '0');
      this.renderer.setStyle(handle, 'width', '100%');
      this.renderer.setStyle(handle, 'height', `${this.resizeHandleSize}px`);
      this.renderer.setStyle(handle, 'cursor', 'ns-resize');
    }

    this.renderer.appendChild(this.el.nativeElement, handle);
    this.resizeHandle = handle;
  }

  // --- Mouse Listeners ---
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.target === this.resizeHandle) {
      this.isResizing = true;
      this.renderer.addClass(this.el.nativeElement, 'is-resizing');
      event.preventDefault();
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) {
      return;
    }

    const element = this.el.nativeElement;
    let newWidth: number;
    let newHeight: number;

    if (this.isResizableHorizontal()) {
      newWidth = event.clientX - element.getBoundingClientRect().left;
      this.updateWidth(newWidth);
    }

    if (this.isResizableVertical()) {
      newHeight = event.clientY - element.getBoundingClientRect().top;
      this.updateHeight(newHeight);
    }
  }

  @HostListener('document:mouseup', [])
  onMouseUp() {
    this.isResizing = false;
    this.renderer.removeClass(this.el.nativeElement, 'is-resizing');
  }

  // --- Touch Listeners ---
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    if (event.target === this.resizeHandle) {
      this.isResizing = true;
      this.renderer.addClass(this.el.nativeElement, 'is-resizing');
      event.preventDefault();
    }
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (!this.isResizing || event.touches.length === 0) {
      return;
    }

    const element = this.el.nativeElement;
    const touch = event.touches[0];
    let newWidth: number;
    let newHeight: number;

    if (this.isResizableHorizontal()) {
      newWidth = touch.clientX - element.getBoundingClientRect().left;
      this.updateWidth(newWidth);
    }

    if (this.isResizableVertical()) {
      newHeight = touch.clientY - element.getBoundingClientRect().top;
      this.updateHeight(newHeight);
    }
  }

  @HostListener('document:touchend', [])
  onTouchEnd() {
    this.isResizing = false;
    this.renderer.removeClass(this.el.nativeElement, 'is-resizing');
  }

  private isResizableHorizontal(): boolean {
    return this.resizableDirection === 'both' || this.resizableDirection === 'horizontal';
  }

  private isResizableVertical(): boolean {
    return this.resizableDirection === 'both' || this.resizableDirection === 'vertical';
  }

  private updateWidth(newWidth: number) {
    if (newWidth < this.minWidth) newWidth = this.minWidth;
    if (newWidth > this.maxWidth) newWidth = this.maxWidth;
    this.renderer.setStyle(this.el.nativeElement, 'width', `${newWidth}px`);
  }

  private updateHeight(newHeight: number) {
    if (newHeight < this.minHeight) newHeight = this.minHeight;
    if (newHeight > this.maxHeight) newHeight = this.maxHeight;
    this.renderer.setStyle(this.el.nativeElement, 'height', `${newHeight}px`);
  }
}
