// ImageData-based rendering system for ant simulation
class ImageDataRenderer {
    constructor(canvas, ctx, colors) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.colors = colors;
        
        // Pre-create ImageData object and reuse it
        this.imageData = ctx.createImageData(canvas.width, canvas.height);
        this.data = this.imageData.data;
        
        // Pre-calculate color lookup table for better performance
        this.colorLUT = this.colors.map(color => this.hexToRgb(color));
        
        // Track which cells have changed this frame
        this.dirtyRegions = new Set();
        this.needsFullRedraw = true;
    }
    
    hexToRgb(hex) {
        if (hex.startsWith('#')) hex = hex.slice(1);
        return {
            r: parseInt(hex.substr(0, 2), 16),
            g: parseInt(hex.substr(2, 2), 16),
            b: parseInt(hex.substr(4, 2), 16)
        };
    }
    
    // Mark a grid cell as needing update
    markDirty(gridX, gridY) {
        this.dirtyRegions.add(`${gridX},${gridY}`);
    }
    
    // Update a single cell in the ImageData
    updateCell(gridX, gridY, colorIndex) {
        const color = this.colorLUT[colorIndex];
        const startPixelX = Math.floor(gridX * cellSize);
        const startPixelY = Math.floor(gridY * cellSize);
        const endPixelX = Math.min(startPixelX + Math.ceil(cellSize), this.canvas.width);
        const endPixelY = Math.min(startPixelY + Math.ceil(cellSize), this.canvas.height);
        
        // Fill the cell area in ImageData
        for (let pixelY = startPixelY; pixelY < endPixelY; pixelY++) {
            for (let pixelX = startPixelX; pixelX < endPixelX; pixelX++) {
                const pixelIndex = (pixelY * this.canvas.width + pixelX) * 4;
                this.data[pixelIndex] = color.r;     // Red
                this.data[pixelIndex + 1] = color.g; // Green
                this.data[pixelIndex + 2] = color.b; // Blue
                this.data[pixelIndex + 3] = 255;     // Alpha
            }
        }
    }
    
    // Render all dirty regions (incremental update)
    renderDirtyRegions() {
        for (const regionKey of this.dirtyRegions) {
            const [x, y] = regionKey.split(',').map(Number);
            this.updateCell(x, y, grid[y][x]);
        }
        this.dirtyRegions.clear();
    }
    
    // Render entire grid (full redraw)
    renderFullGrid() {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                this.updateCell(x, y, grid[y][x]);
            }
        }
        this.needsFullRedraw = false;
    }
    
    // Push ImageData to canvas
    flush() {
        this.ctx.putImageData(this.imageData, 0, 0);
    }
}