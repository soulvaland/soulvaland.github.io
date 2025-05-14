// js/main.js

import '@material/web/all.js'; // Imports all MWC components
import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';

document.adoptedStyleSheets.push(typescaleStyles.styleSheet);

document.addEventListener('DOMContentLoaded', function () {
    // --- DOM Element Variables ---
    const pages = document.querySelectorAll('.page');
    const mobileMenuButton = document.getElementById('mobile-menu-button'); 
    const mobileMenuDrawer = document.getElementById('m3-mobile-menu'); 
    
    const mobileNavLinksInDrawer = mobileMenuDrawer ? Array.from(mobileMenuDrawer.querySelectorAll('md-list-item')) : [];

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
    // const INITIAL_HOME_CARD_ANIMATION_DELAY = 250; // Will re-evaluate animations later
    // const MENU_CARD_ANIMATION_DELAY = 50;
    // const MENU_FILTER_DEBOUNCE_DELAY = 50;

    // --- Initialization ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Ensure drawer is closed on initial load
    if (mobileMenuDrawer) {
        mobileMenuDrawer.opened = false; // Explicitly set to closed
    }
    if (mobileMenuButton) {
        mobileMenuButton.selected = false; // Ensure button state matches drawer
        mobileMenuButton.setAttribute('aria-expanded', 'false');
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
    updateMobileDrawerNavActiveState(initialPageId);


    if (document.getElementById('menu')?.classList.contains('active')) {
        // filterAndAnimateMenu('all'); 
    }
    // updateViewToggleButtons(); 

    // --- Core Functions ---
    function animateCardsOnLoad() { /* ... placeholder ... */ }
    function updateViewToggleButtons() { /* ... placeholder ... */ }
    function setMenuView(viewType) { /* ... placeholder ... */ }
    function filterAndAnimateMenu(categoryToShow) { /* ... placeholder ... */ }
    
    function animatePageOut(pageElement) { 
        if (!pageElement) return;
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

    function animatePageIn(targetPageElement, pageId, categoryTarget) { 
        if (!targetPageElement) return;
        targetPageElement.classList.remove('hidden', 'page-transition-exit', 'page-transition-exit-active', 'page-transition-enter');
        void targetPageElement.offsetWidth; 
        targetPageElement.classList.add('active', 'page-transition-enter', 'page-transition-enter-active');

        let entryHandlerRun = false;
        const entryHandler = () => {
            if (entryHandlerRun) return;
            entryHandlerRun = true;

            // if (pageId === 'menu') { // Logic for menu page can be added later
            //     // filterAndAnimateMenu(categoryTarget || 'all');
            // } else {
            //     // animateCardsOnLoad(); 
            // }
            targetPageElement.removeEventListener('transitionend', entryHandler);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const newHeading = targetPageElement.querySelector('h1');
            if (newHeading && newHeading.focus) {
                newHeading.setAttribute('tabindex', '-1');
                newHeading.focus({ preventScroll: true });
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
        // if (isSamePage && pageId === 'menu' && categoryTarget) { // Menu logic later
        //     // filterAndAnimateMenu(categoryTarget);
        //     return;
        // }
        if (isSamePage && !categoryTarget) return; 

        if (currentlyActivePage) {
            animatePageOut(currentlyActivePage);
        }
        animatePageIn(targetPage, pageId, categoryTarget);
        updateNavActiveState(pageId); 
        updateMobileDrawerNavActiveState(pageId); 
    }

    function updateNavActiveState(activePageId) {
        mwcNavElements.forEach(button => {
            const isSelected = button.dataset.page === activePageId;
            button.classList.toggle('nav-link-m3-active', isSelected);
            if (button.tagName.startsWith('MD-')) { 
                 button.setAttribute('aria-current', isSelected ? 'page' : 'false');
            } else if (button.tagName === 'A') { 
                 button.setAttribute('aria-current', isSelected ? 'page' : 'false');
            }
        });
         if (logoLink) { 
            logoLink.classList.toggle('logo-link-m3-active', activePageId === 'home');
        }
    }

    function updateMobileDrawerNavActiveState(activePageId) {
        if (!mobileNavLinksInDrawer || mobileNavLinksInDrawer.length === 0) return;
        mobileNavLinksInDrawer.forEach(item => {
            if (item.dataset.page) { 
                const isSelected = item.dataset.page === activePageId;
                item.selected = isSelected; // For MWC md-list-item
                item.activated = isSelected; // For visual styling in MWC
                item.setAttribute('aria-current', isSelected ? 'page' : 'false');
            } else {
                item.selected = false;
                item.activated = false;
                item.removeAttribute('aria-current');
            }
        });
    }

    // --- Event Listeners Setup ---
    mwcNavElements.forEach(navElement => {
        navElement.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default for both <a> and <md-text-button>
            const pageId = this.dataset.page;
            if (pageId) {
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

    if (mobileMenuButton && mobileMenuDrawer) {
        mobileMenuButton.addEventListener('click', function () {
            mobileMenuDrawer.opened = !mobileMenuDrawer.opened;
            mobileMenuButton.selected = mobileMenuDrawer.opened; 
            mobileMenuButton.setAttribute('aria-expanded', mobileMenuDrawer.opened.toString());
        });
    }

    if (mobileNavLinksInDrawer) {
        mobileNavLinksInDrawer.forEach(item => {
            item.addEventListener('click', function(e) {
                const pageId = this.dataset.page;
                if (pageId) {
                    // md-list-item with type="button" doesn't navigate by default
                    showPage(pageId);
                }
                // For md-list-item type="link", it will navigate via href.
                // We always close the drawer.
                if (mobileMenuDrawer) {
                    mobileMenuDrawer.opened = false; 
                    if(mobileMenuButton) {
                        mobileMenuButton.selected = false;
                        mobileMenuButton.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        });
    }
});
