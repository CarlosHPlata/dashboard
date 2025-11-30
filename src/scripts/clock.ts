import moment from 'moment';

// GMT offset in minutes for the desired timezone (e.g., Europe/Madrid is UTC+1 => 60 minutes)
const GMT_OFFSET_MINUTES = 60;

class Clock {
  private timeElement: HTMLElement | null;
  private dateElement: HTMLElement | null;
  private loaderElement: HTMLElement | null;
  private contentElement: HTMLElement | null;
  private updateInterval: number = 1000; // 1 second

  constructor() {
    this.timeElement = document.getElementById('clock-time');
    this.dateElement = document.getElementById('clock-date');
    this.loaderElement = document.getElementById('clock-loader');
    this.contentElement = document.getElementById('clock-content');

    if (this.timeElement && this.dateElement) {
      this.hideLoader();
      this.startClock();
    } else {
      console.error('Clock elements not found');
    }
  }

  private hideLoader() {
    if (this.loaderElement) {
      this.loaderElement.classList.add('hidden');
    }
    if (this.contentElement) {
      this.contentElement.classList.remove('hidden');
    }
  }

  private startClock() {
    // Update display every second using local time with GMT offset
    setInterval(() => this.updateDisplay(), this.updateInterval);
  }

  private updateDisplay() {
    if (!this.timeElement || !this.dateElement) return;

    // Use current local time, apply GMT offset, and format with moment.js
    const now = moment(new Date()).utcOffset(GMT_OFFSET_MINUTES);

    // Format time: HH:mm
    this.timeElement.textContent = now.format('HH:mm');

    // Format date: dddd, MMMM D (e.g., Monday, November 29)
    this.dateElement.textContent = now.format('dddd, MMMM D');
  }
}

// Initialize clock when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Clock();
});
