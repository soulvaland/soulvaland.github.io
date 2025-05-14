// js/main.js

import '@material/web/all.js'; // Imports all MWC components
import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';

document.adoptedStyleSheets.push(typescaleStyles.styleSheet);

document.addEventListener('DOMContentLoaded', function () {
    // --- DOM Element Variables ---
    const pages = document.querySelectorAll('.page');
    const mobileMenuButton = document.getElementById('mobile-menu-button'); // <md-icon-button>
    const mobileMenuDrawer = document.getElementById('m3-mobile-menu'); // <md-navigation-drawer>
    
    // Select navigation links within the new M3 drawer
    const mobileNavLinksInDrawer = mobileMenuDrawer ? mobileMenuDrawer.querySelectorAll('md-list-item[data-page]') : [];

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
        if (isSamePage) return;

        if (currentlyActivePage) {
            animatePageOut(currentlyActivePage);
        }
        animatePageIn(targetPage, pageId, categoryTarget);
        updateNavActiveState(pageId); // Update desktop nav active state
        updateMobileDrawerNavActiveState(pageId); // Update mobile drawer nav active state
    }

    function updateNavActiveState(activePageId) {
        mwcNavElements.forEach(button => {
            const isSelected = button.dataset.page === activePageId;
            button.classList.toggle('nav-link-m3-active', isSelected);
            if (button.tagName.startsWith('MD-')) { // MWC elements
                 button.setAttribute('aria-current', isSelected ? 'page' : 'false');
            } else if (button.tagName === 'A') { 
                 button.setAttribute('aria-current', isSelected ? 'page' : 'false');
            }
        });
         if (logoLink) { 
            logoLink.classList.toggle('logo-link-m3-active', activePageId === 'home');
        }
    }

    // NEW: Function to update active state for mobile drawer items
    function updateMobileDrawerNavActiveState(activePageId) {
        if (!mobileNavLinksInDrawer) return;
        mobileNavLinksInDrawer.forEach(item => {
            const isSelected = item.dataset.page === activePageId;
            // md-list-item uses the 'selected' attribute and 'activated' for visual styling
            item.selected = isSelected;
            item.activated = isSelected; // Often used for visual indication
            item.setAttribute('aria-current', isSelected ? 'page' : 'false');
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

    // Mobile Menu Button (md-icon-button) toggles the M3 Navigation Drawer
    if (mobileMenuButton && mobileMenuDrawer) {
        mobileMenuButton.addEventListener('click', function () {
            mobileMenuDrawer.opened = !mobileMenuDrawer.opened;
            mobileMenuButton.selected = mobileMenuDrawer.opened; // Toggle selected state of icon button
            mobileMenuButton.setAttribute('aria-expanded', mobileMenuDrawer.opened.toString());
        });
    }

    // Navigation links within the M3 Mobile Drawer
    if (mobileNavLinksInDrawer) {
        mobileNavLinksInDrawer.forEach(item => {
            item.addEventListener('click', function(e) {
                // For md-list-item with type="button" or if it's a link
                if (this.dataset.page) {
                    e.preventDefault(); // Prevent default if it's a link type also handled by JS
                    const pageId = this.dataset.page;
                    showPage(pageId);
                    if (mobileMenuDrawer) {
                        mobileMenuDrawer.opened = false; // Close drawer after selection
                        if(mobileMenuButton) mobileMenuButton.selected = false;
                    }
                }
                // If type="link" and has href, it will navigate automatically.
                // But if we want to close drawer, we might need to handle it.
                // For simplicity, data-page driven items will close the drawer.
                else if (this.type === 'link' && this.href) {
                     if (mobileMenuDrawer) {
                        mobileMenuDrawer.opened = false; 
                        if(mobileMenuButton) mobileMenuButton.selected = false;
                    }
                }
            });
        });
    }
    
    // Call initial active state for mobile drawer as well
    updateMobileDrawerNavActiveState(initialPageId);

    // Menu Tabs, Card/List view buttons - to be refactored
    // if (menuTabButtons.length > 0) { ... }
    // if (cardViewBtn && listViewBtn) { ... }
});
