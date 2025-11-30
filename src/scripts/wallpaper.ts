interface BingImageResponse {
  images: Array<{
    startdate: string;
    fullstartdate: string;
    enddate: string;
    url: string;
    urlbase: string;
    copyright: string;
    copyrightlink: string;
    title: string;
    quiz: string;
    wp: boolean;
    hsh: string;
    drk: number;
    top: number;
    bot: number;
    hs: any[];
  }>;
  tooltips: {
    loading: string;
    previous: string;
    next: string;
    walle: string;
    walls: string;
  };
}

interface CachedWallpaper {
  date: string;
  imageUrl: string;
  copyright: string;
  title: string;
}


class Wallpaper {
  private wallpaperElement: HTMLElement | null;
  private cacheKey: string = 'bing-wallpaper-cache';
  private apiUrl: string = '/api/wallpaper';
  private bingBaseUrl: string = 'https://www.bing.com';

  constructor() {
    this.wallpaperElement = document.getElementById('wallpaper');

    if (this.wallpaperElement) {
      this.init();
    } else {
      console.error('Wallpaper element not found');
    }
  }

  private async init() {
    try {
      const wallpaperData = await this.getWallpaper();
      this.applyWallpaper(wallpaperData);
    } catch (error) {
      console.error('Failed to initialize wallpaper:', error);
      this.showError();
    }
  }

  private getTodayDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  private getCachedWallpaper(): CachedWallpaper | null {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;

      const data: CachedWallpaper = JSON.parse(cached);
      return data;
    } catch (error) {
      console.error('Error reading wallpaper cache:', error);
      return null;
    }
  }

  private setCachedWallpaper(data: CachedWallpaper): void {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving wallpaper cache:', error);
    }
  }

  private async fetchBingWallpaper(): Promise<CachedWallpaper> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch wallpaper: ${response.statusText}`);
      }

      const data: BingImageResponse = await response.json();

      if (!data.images || data.images.length === 0) {
        throw new Error('No images found in response');
      }

      const image = data.images[0];
      const imageUrl = this.bingBaseUrl + image.url;

      const wallpaperData: CachedWallpaper = {
        date: this.getTodayDate(),
        imageUrl: imageUrl,
        copyright: image.copyright,
        title: image.title
      };

      // Cache the data
      this.setCachedWallpaper(wallpaperData);

      return wallpaperData;
    } catch (error) {
      console.error('Error fetching Bing wallpaper:', error);
      throw error;
    }
  }

  private async getWallpaper(): Promise<CachedWallpaper> {
    const today = this.getTodayDate();
    const cached = this.getCachedWallpaper();

    // Use cached data if it's from today
    if (cached && cached.date === today) {
      console.log('Using cached wallpaper from:', cached.date);
      return cached;
    }

    // Fetch fresh data
    console.log('Fetching fresh wallpaper for:', today);
    return await this.fetchBingWallpaper();
  }

  private applyWallpaper(wallpaperData: CachedWallpaper): void {
    if (!this.wallpaperElement) {
      console.error('Wallpaper element not found');
      return;
    }

    // Clear existing content
    this.wallpaperElement.innerHTML = '';

    // Create the image element
    const img = document.createElement('img');
    img.src = wallpaperData.imageUrl;
    img.alt = wallpaperData.title;
    img.className = 'w-full h-full object-cover';

    // Append elements
    this.wallpaperElement.appendChild(img);
  }

  private showError(): void {
    if (!this.wallpaperElement) return;

    this.wallpaperElement.innerHTML = `
      <div class="absolute inset-0 bg-error/10 flex items-center justify-center text-error">
        <span class="text-sm">Failed to load wallpaper</span>
      </div>
    `;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new Wallpaper());
} else {
  new Wallpaper();
}
