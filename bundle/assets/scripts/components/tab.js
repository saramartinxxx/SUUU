import { define } from '../utils.js';

define('tab-button', {
    /** @this HTMLElement */
    mount() {
        const labelText = this.textContent.trim() || 'Tab';

        const defaultClasses = "my-1 flex flex-none transition hover:cursor-pointer px-3 py-1 h-7 lg:h-8 rounded-lg items-center gap-2 text-[13px] lg:text-[14px] bg-gray-800 text-gray-300 select-none";
        this.className = `${this.className.length ? this.className : defaultClasses}`;

        this.innerHTML = /* html */ `
            <span class="check-icon flex items-center justify-center transition-all duration-200 opacity-0 scale-50 w-0">
                <i class="fa-solid fa-check text-xs"></i>
            </span>
            <span class="tab-label pr-2">${labelText}</span>
        `;

        const style = document.createElement('style');
        style.innerHTML = `
            tab-button[selected] {
                background-color: #e40014 !important; /* Tailwind bg-red-600 */
                color: #ffffff !important;
                box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
            }
            tab-button[selected] .check-icon {
                opacity: 1 !important;
                scale: 1 !important;
                width: 14px !important;
                margin-right: 2px;
            }
        `;
        this.appendChild(style);
    }
});