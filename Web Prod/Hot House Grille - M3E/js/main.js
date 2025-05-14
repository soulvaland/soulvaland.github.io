// js/main.js

import '@material/web/all.js'; // Imports all MWC components
import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';

document.adoptedStyleSheets.push(typescaleStyles.styleSheet);

document.addEventListener('DOMContentLoaded', function () {
    // --- DOM Element Variables ---
    const pages = document.querySelectorAll('.page');
    const mobileMenuButton = document.getElementById('mobile-menu-button'); 
    const mobileMenuDrawer = document.getElementById('m3-mobile-menu'); 
    
    const mobileNavLinksInDrawer = mobileMenuDrawer ? Array.from(mobileMenuDrawer.querySelectorAll('md-list-item')) : []; // Get all list items

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

    // --- Initialization ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Ensure drawer is closed on initial load (JS can also enforce this)
    if (mobileMenuDrawer) {
        mobileMenuDrawer.opened = false;
    }
    if (mobileMenuButton) {
        mobileMenuButton.selected = false;
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
    updateMobileDrawerNavActiveState(initialPageId); // Initialize drawer active state


    if (document.getElementById('menu')?.classList.contains('active')) {
        // filterAndAnimateMenu('all'); 
    }
    // updateViewToggleButtons(); 

    // --- Core Functions ---
    function animateCardsOnLoad() { /* ... existing ... */ }
    function updateViewToggleButtons() { /* ... existing ... */ }
    function setMenuView(viewType) { /* ... existing ... */ }
    function filterAndAnimateMenu(categoryToShow) { /* ... existing ... */ }
    function animatePageOut(pageElement) { /* ... existing ... */ }
    function animatePageIn(targetPageElement, pageId, categoryTarget) { /* ... existing ... */ }

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
        if (isSamePage && !categoryTarget) return; // Avoid re-animating if already on the page

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
            // Only apply to items that are for page navigation
            if (item.dataset.page) { 
                const isSelected = item.dataset.page === activePageId;
                item.selected = isSelected;
                item.activated = isSelected; 
                item.setAttribute('aria-current', isSelected ? 'page' : 'false');
            } else {
                // For non-page links like tel, ensure they are not marked selected
                item.selected = false;
                item.activated = false;
                item.removeAttribute('aria-current');
            }
        });
    }


    // --- Event Listeners Setup ---
    mwcNavElements.forEach(navElement => {
        navElement.addEventListener('click', function (e) {
            e.preventDefault();
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
            // MWC icon button 'selected' state can be used for toggle visual
            mobileMenuButton.selected = mobileMenuDrawer.opened; 
            mobileMenuButton.setAttribute('aria-expanded', mobileMenuDrawer.opened.toString());
        });
    }

    if (mobileNavLinksInDrawer) {
        mobileNavLinksInDrawer.forEach(item => {
            item.addEventListener('click', function(e) {
                const pageId = this.dataset.page;
                if (pageId) {
                    // e.preventDefault(); // Already type="button", so default is not navigation
                    showPage(pageId);
                    if (mobileMenuDrawer) {
                        mobileMenuDrawer.opened = false; 
                        if(mobileMenuButton) {
                            mobileMenuButton.selected = false;
                            mobileMenuButton.setAttribute('aria-expanded', 'false');
                        }
                    }
                } else if (this.type === 'link' && this.href) {
                    // For md-list-item type="link", it navigates automatically.
                    // We just need to close the drawer.
                    if (mobileMenuDrawer) {
                        mobileMenuDrawer.opened = false; 
                        if(mobileMenuButton) {
                            mobileMenuButton.selected = false;
                            mobileMenuButton.setAttribute('aria-expanded', 'false');
                        }
                    }
                    // Allow default link behavior to proceed if not handled by showPage
                    // return true; // Not strictly needed
                }
            });
        });
    }
    
    // Menu Tabs, Card/List view buttons - to be refactored
    // if (menuTabButtons.length > 0) { ... }
    // if (cardViewBtn && listViewBtn) { ... }
});
