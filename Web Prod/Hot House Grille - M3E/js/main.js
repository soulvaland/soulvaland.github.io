// js/main.js

// UPDATED: Import all Material Web Components via the single all.js bundle
// This is often easier when starting, and the import map will resolve it via CDN.
import '@material/web/all.js';

// Import MWC typescale styles to be adopted by the document
// This gives you access to classes like .md-typescale-body-medium etc.
import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';

document.adoptedStyleSheets.push(typescaleStyles.styleSheet);


document.addEventListener('DOMContentLoaded', function () {
    // --- DOM Element Variables ---
    const pages = document.querySelectorAll('.page');
    const mobileMenuButton = document.getElementById('mobile-menu-button'); 
    const mobileMenu = document.getElementById('mobile-menu'); 

    const menuTabButtons = document.querySelectorAll('.menu-tab-button'); 
    const menuCategories = document.querySelectorAll('.menu-category');
    const homePageMenuButtons = document.querySelectorAll('[data-page-target="menu"]'); 
    const heroMenuButton = document.getElementById('heroMenuButton'); 
    const menuItemsContainer = document.getElementById('menu-items-container');
    const cardViewBtn = document.getElementById('card-view-btn'); 
    const listViewBtn = document.getElementById('list-view-btn'); 
    const currentYearSpan = document.getElementById('currentYear');
    const logoLink = document.getElementById('logoLink'); 

    const mwcNavElements = document.querySelectorAll('md-top-app-bar-fixed md-text-button[data-page], md-top-app-bar-fixed a#logoLink[data-page]');

    // --- State Variables ---
    let menuFilterTimeout;
    let currentMenuView = 'card';

    // --- Constants ---
    const PAGE_TRANSITION_DURATION = 500; 
    const PAGE_TRANSITION_FALLBACK_BUFFER = 100;
    const INITIAL_HOME_CARD_ANIMATION_DELAY = 250;
    const MENU_CARD_ANIMATION_DELAY = 50;
    const MENU_FILTER_DEBOUNCE_DELAY = 50;

    // --- Helper function for focusable elements (might be less needed with MWC) ---
    function getFocusableElements(parentElement) {
        if (!parentElement) return [];
        return Array.from(
            parentElement.querySelectorAll(
                'a[href]:not([tabindex="-1"]):not([disabled]), button:not([disabled]):not([tabindex="-1"]), md-icon-button:not([disabled]), md-text-button:not([disabled]), md-filled-button:not([disabled]), textarea:not([disabled]):not([tabindex="-1"]), input[type="text"]:not([disabled]):not([tabindex="-1"]), input[type="radio"]:not([disabled]):not([tabindex="-1"]), input[type="checkbox"]:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"])'
            )
        ).filter(el => el.offsetParent !== null);
    }

    // --- Mobile Menu (Old logic - to be replaced in Chunk 3) ---
    let focusableElementsInMobileMenu = [];
    let firstFocusableElementInMobileMenu;
    let lastFocusableElementInMobileMenu;

    function openMobileMenu() { 
        if (!mobileMenu || !mobileMenuButton) return;
        mobileMenu.classList.remove('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'true');
        // For MWC icon button, you might set a 'selected' state if it's a toggle
        // mobileMenuButton.selected = true; 

        focusableElementsInMobileMenu = getFocusableElements(mobileMenu);
        if (focusableElementsInMobileMenu.length > 0) {
            firstFocusableElementInMobileMenu = focusableElementsInMobileMenu[0];
            lastFocusableElementInMobileMenu = focusableElementsInMobileMenu[focusableElementsInMobileMenu.length - 1];
            if (firstFocusableElementInMobileMenu.focus) firstFocusableElementInMobileMenu.focus();
        }
        document.addEventListener('keydown', handleMobileMenuFocusTrap);
    }

    function closeMobileMenu() { 
        if (!mobileMenu || !mobileMenuButton) return;
        mobileMenu.classList.add('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        // mobileMenuButton.selected = false;

        document.removeEventListener('keydown', handleMobileMenuFocusTrap);
        if (mobileMenuButton.focus) mobileMenuButton.focus();
    }

    function handleMobileMenuFocusTrap(e) { 
        if (!mobileMenu || mobileMenu.classList.contains('hidden')) {
            document.removeEventListener('keydown', handleMobileMenuFocusTrap);
            return;
        }
        const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
        if (!isTabPressed) return;

        focusableElementsInMobileMenu = getFocusableElements(mobileMenu); 
        if (focusableElementsInMobileMenu.length === 0) return;
        firstFocusableElementInMobileMenu = focusableElementsInMobileMenu[0];
        lastFocusableElementInMobileMenu = focusableElementsInMobileMenu[focusableElementsInMobileMenu.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElementInMobileMenu) {
                if (lastFocusableElementInMobileMenu.focus) lastFocusableElementInMobileMenu.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableElementInMobileMenu) {
                if (firstFocusableElementInMobileMenu.focus) firstFocusableElementInMobileMenu.focus();
                e.preventDefault();
            }
        }
    }

    // --- Initialization ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    pages.forEach(p => p.classList.add('hidden'));
    const initialPageId = 'home';
    const initialPage = document.getElementById(initialPageId);

    if (initialPage) {
        initialPage.classList.remove('hidden');
        initialPage.classList.add('active');
        // setTimeout(animateCardsOnLoad, INITIAL_HOME_CARD_ANIMATION_DELAY);
    } else {
        console.error(`Initial page '${initialPageId}' not found.`);
    }
    updateNavActiveState(initialPageId);

    if (document.getElementById('menu')?.classList.contains('active')) {
         // filterAndAnimateMenu('all'); 
    }
    // updateViewToggleButtons(); 


    // --- Core Functions ---
    function animateCardsOnLoad() { 
        const activePage = document.querySelector('.page.active');
        if (!activePage) return;
        let cardsToAnimate;
        if (activePage.id === 'menu') {
             cardsToAnimate = activePage.querySelectorAll('.menu-category:not(.hidden) .menu-card, .menu-category:not(.hidden) .stagger-animate > div');
        } else {
             cardsToAnimate = activePage.querySelectorAll('.menu-card, .hotspot-card, .stagger-animate > div');
        }
        if (cardsToAnimate.length > 0) {
            cardsToAnimate.forEach((card, index) => { // Added index for staggered delay
                card.classList.remove('visible'); 
                void card.offsetHeight; 
                // Example of a simple staggered animation, can be refined with M3 motion later
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 50); // 50ms delay between cards
            });
        }
    }

    function updateViewToggleButtons() { /* To be refactored with MWC Segmented Buttons */ }
    function setMenuView(viewType) { /* To be refactored */ }
    function filterAndAnimateMenu(categoryToShow) { /* To be refactored */ }
    function animatePageOut(pageElement) { /* To be refactored with M3 motion */ 
        if (!pageElement) return;
        pageElement.querySelectorAll('.menu-card, .hotspot-card, .stagger-animate > div').forEach(el => el.classList.remove('visible'));
        pageElement.classList.remove('page-transition-enter', 'page-transition-enter-active');
        pageElement.classList.add('page-transition-exit', 'page-transition-exit-active');

        const exitHandler = () => {
            pageElement.classList.remove('active', 'page-transition-exit', 'page-transition-exit-active');
            pageElement.classList.add('hidden');
            pageElement.removeEventListener('transitionend', exitHandler);
        };
        pageElement.addEventListener('transitionend', exitHandler, { once: true });
        setTimeout(() => {
            if (pageElement.classList.contains('active')) { 
                exitHandler();
            }
        }, PAGE_TRANSITION_DURATION + PAGE_TRANSITION_FALLBACK_BUFFER);
    }

    function animatePageIn(targetPageElement, pageId, categoryTarget) { /* To be refactored with M3 motion */ 
        if (!targetPageElement) return;
        targetPageElement.classList.remove('hidden', 'page-transition-exit', 'page-transition-exit-active', 'page-transition-enter');
        void targetPageElement.offsetWidth; 
        targetPageElement.classList.add('active', 'page-transition-enter', 'page-transition-enter-active');

        let entryHandlerRun = false;
        const entryHandler = () => {
            if (entryHandlerRun) return;
            entryHandlerRun = true;

            if (pageId === 'menu') {
                // filterAndAnimateMenu(categoryTarget || 'all');
            } else {
                // animateCardsOnLoad(); // Call animations for the new page
            }
            targetPageElement.removeEventListener('transitionend', entryHandler);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const newHeading = targetPageElement.querySelector('h1');
            if (newHeading) {
                newHeading.setAttribute('tabindex', '-1');
                if (newHeading.focus) newHeading.focus({ preventScroll: true });
            }
        };
        targetPageElement.addEventListener('transitionend', entryHandler, { once: true });
        setTimeout(() => {
            if (!entryHandlerRun && targetPageElement.classList.contains('active') && targetPageElement.classList.contains('page-transition-enter-active')) {
                entryHandler();
            }
        }, PAGE_TRANSITION_DURATION + PAGE_TRANSITION_FALLBACK_BUFFER);
    }

    function showPage(pageId, categoryTarget = null) {
        const currentlyActivePage = document.querySelector('.page.active');
        const targetPage = document.getElementById(pageId);

        if (!targetPage) {
            console.error('Target page not found:', pageId);
            return;
        }
        const isSamePage = currentlyActivePage === targetPage;
        if (isSamePage && pageId === 'menu' && categoryTarget) {
            // filterAndAnimateMenu(categoryTarget);
            return;
        }
        if (isSamePage) return;

        if (currentlyActivePage) {
            animatePageOut(currentlyActivePage);
        }
        animatePageIn(targetPage, pageId, categoryTarget);
        updateNavActiveState(pageId);
    }

    function updateNavActiveState(activePageId) {
        mwcNavElements.forEach(button => {
            const isSelected = button.dataset.page === activePageId;
            button.classList.toggle('nav-link-m3-active', isSelected);
            if (button.tagName === 'MD-TEXT-BUTTON' || button.tagName === 'MD-FILLED-BUTTON' || button.tagName === 'MD-ICON-BUTTON') {
                 button.setAttribute('aria-current', isSelected ? 'page' : 'false');
            } else if (button.tagName === 'A') { 
                 button.setAttribute('aria-current', isSelected ? 'page' : 'false');
            }
        });
         if (logoLink) { 
            logoLink.classList.toggle('logo-link-m3-active', activePageId === 'home');
        }
    }

    // --- Event Listeners Setup ---
    mwcNavElements.forEach(navElement => {
        navElement.addEventListener('click', function (e) {
            e.preventDefault();
            const pageId = this.dataset.page;
            if (pageId) {
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                     // closeMobileMenu(); // Old logic, will be MWC specific
                }
                showPage(pageId);
            }
        });
    });
    
    homePageMenuButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showPage(this.dataset.pageTarget, this.dataset.categoryTarget || null);
        });
    });

    if (mobileMenuButton) { 
        mobileMenuButton.addEventListener('click', function () {
            if (mobileMenu) { 
                const isHidden = mobileMenu.classList.contains('hidden');
                if (isHidden) {
                    openMobileMenu(); 
                } else {
                    closeMobileMenu(); 
                }
            } else {
                console.log("Old mobile menu div not found. MWC mobile menu not yet implemented.");
            }
        });
    }

    // Menu Tabs, Card/List view buttons - to be refactored
    // if (menuTabButtons.length > 0) { ... }
    // if (cardViewBtn && listViewBtn) { ... }
});
