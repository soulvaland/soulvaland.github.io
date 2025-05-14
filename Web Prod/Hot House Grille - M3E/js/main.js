// js/main.js

import '@material/web/all.js'; // Imports all MWC components
import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';

// This is good: applies MWC typography helper classes globally (.md-typescale-body-large etc.)
document.adoptedStyleSheets.push(typescaleStyles.styleSheet);

document.addEventListener('DOMContentLoaded', function () {
    // --- DOM Element Variables ---
    const pages = document.querySelectorAll('.page');
    const mobileMenuButton = document.getElementById('mobile-menu-button'); // <md-icon-button slot="navigationIcon">
    const mobileMenuDrawer = document.getElementById('mobileDrawer');     // <md-navigation-drawer id="mobileDrawer">
    
    // Get all <md-list-item> elements from the new drawer that have a data-page attribute
    const mobileNavLinksInDrawer = mobileMenuDrawer ? Array.from(mobileMenuDrawer.querySelectorAll('md-list-item[data-page]')) : [];
    const allNavLinksInDrawer = mobileMenuDrawer ? Array.from(mobileMenuDrawer.querySelectorAll('md-list-item')) : []; // All items for click handling

    const menuTabButtons = document.querySelectorAll('.menu-tab-button');
    const menuCategories = document.querySelectorAll('.menu-category');
    const homePageMenuButtons = document.querySelectorAll('[data-page-target="menu"]');
    const heroMenuButton = document.getElementById('heroMenuButton');
    const menuItemsContainer = document.getElementById('menu-items-container');
    const cardViewBtn = document.getElementById('card-view-btn');
    const listViewBtn = document.getElementById('list-view-btn');
    const currentYearSpan = document.getElementById('currentYear');
    const logoLink = document.getElementById('logoLink'); // <a slot="headline" id="logoLink">

    // Query for all navigable items in the top app bar (logo and md-text-buttons with data-page)
    // Note: Your patch puts md-text-buttons directly as slot="actionItems"
    const topBarNavElements = document.querySelectorAll(
        'md-top-app-bar-fixed a#logoLink[data-page], md-top-app-bar-fixed md-text-button[slot="actionItems"][data-page]'
    );


    // --- State Variables ---
    let menuFilterTimeout;
    let currentMenuView = 'card';

    // --- Constants ---
    const PAGE_TRANSITION_DURATION = 500;
    const PAGE_TRANSITION_FALLBACK_BUFFER = 100;

    // --- Initialization ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Ensure drawer is closed on initial load
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
    } else {
        console.error(`Initial page '${initialPageId}' not found.`);
    }
    updateTopBarNavActiveState(initialPageId); // For desktop/top-bar links
    updateMobileDrawerNavActiveState(initialPageId); // For drawer links


    // --- Core Functions (Page Transitions, Menu Logic - Keep for now, will be refined later) ---
    function animatePageOut(pageElement) { 
        if (!pageElement) return;
        // Your existing page out animation logic
        pageElement.classList.remove('page-transition-enter', 'page-transition-enter-active');
        pageElement.classList.add('page-transition-exit', 'page-transition-exit-active');
        const exitHandler = () => {
            pageElement.classList.remove('active', 'page-transition-exit', 'page-transition-exit-active');
            pageElement.classList.add('hidden');
            pageElement.removeEventListener('transitionend', exitHandler);
        };
        pageElement.addEventListener('transitionend', exitHandler, { once: true });
        setTimeout(() => { if (pageElement.classList.contains('active')) { exitHandler(); } }, PAGE_TRANSITION_DURATION + PAGE_TRANSITION_FALLBACK_BUFFER);
    }

    function animatePageIn(targetPageElement, pageId, categoryTarget) { 
        if (!targetPageElement) return;
        // Your existing page in animation logic
        targetPageElement.classList.remove('hidden', 'page-transition-exit', 'page-transition-exit-active', 'page-transition-enter');
        void targetPageElement.offsetWidth; 
        targetPageElement.classList.add('active', 'page-transition-enter', 'page-transition-enter-active');
        let entryHandlerRun = false;
        const entryHandler = () => {
            if (entryHandlerRun) return;
            entryHandlerRun = true;
            targetPageElement.removeEventListener('transitionend', entryHandler);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const newHeading = targetPageElement.querySelector('h1');
            if (newHeading && newHeading.focus) {
                newHeading.setAttribute('tabindex', '-1');
                newHeading.focus({ preventScroll: true });
            }
        };
        targetPageElement.addEventListener('transitionend', entryHandler, { once: true });
        setTimeout(() => { if (!entryHandlerRun && targetPageElement.classList.contains('active') && targetPageElement.classList.contains('page-transition-enter-active')) { entryHandler(); } }, PAGE_TRANSITION_DURATION + PAGE_TRANSITION_FALLBACK_BUFFER);
    }

    function showPage(pageId, categoryTarget = null) {
        const currentlyActivePage = document.querySelector('.page.active');
        const targetPage = document.getElementById(pageId);

        if (!targetPage) {
            console.error('Target page not found:', pageId);
            return;
        }
        const isSamePage = currentlyActivePage === targetPage;
        if (isSamePage && !categoryTarget) return; 

        if (currentlyActivePage) {
            animatePageOut(currentlyActivePage);
        }
        animatePageIn(targetPage, pageId, categoryTarget);
        updateTopBarNavActiveState(pageId); 
        updateMobileDrawerNavActiveState(pageId); 
    }

    // Updated for top bar elements
    function updateTopBarNavActiveState(activePageId) {
        topBarNavElements.forEach(button => { // Use the new selector for top bar items
            const isSelected = button.dataset.page === activePageId;
            button.classList.toggle('nav-link-m3-active', isSelected); // Custom class for MWC text buttons
            if (button.tagName === 'A') { // For the logo link
                button.classList.toggle('logo-link-m3-active', isSelected && button.id === 'logoLink');
            }
            button.setAttribute('aria-current', isSelected ? 'page' : 'false');
        });
    }

    function updateMobileDrawerNavActiveState(activePageId) {
        if (!mobileNavLinksInDrawer || mobileNavLinksInDrawer.length === 0) return;
        mobileNavLinksInDrawer.forEach(item => {
            if (item.dataset.page) { 
                const isSelected = item.dataset.page === activePageId;
                item.selected = isSelected; 
                item.activated = isSelected; 
                item.setAttribute('aria-current', isSelected ? 'page' : 'false');
            } else {
                item.selected = false;
                item.activated = false;
                item.removeAttribute('aria-current');
            }
        });
    }


    // --- Event Listeners Setup ---

    // Top Bar Navigation (Desktop links + Logo)
    topBarNavElements.forEach(navElement => {
        navElement.addEventListener('click', function (e) {
            e.preventDefault(); 
            const pageId = this.dataset.page;
            if (pageId) {
                showPage(pageId);
            }
        });
    });
    
    // Home page buttons that navigate to menu (will be MWC later)
    homePageMenuButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showPage(this.dataset.pageTarget, this.dataset.categoryTarget || null);
        });
    });

    // Hamburger button to toggle M3 Navigation Drawer
    if (mobileMenuButton && mobileMenuDrawer) {
        mobileMenuButton.addEventListener('click', function () {
            mobileMenuDrawer.opened = !mobileMenuDrawer.opened;
            mobileMenuButton.selected = mobileMenuDrawer.opened; // Visual toggle for icon button
            mobileMenuButton.setAttribute('aria-expanded', mobileMenuDrawer.opened.toString());
        });
    }

    // Links within the M3 Navigation Drawer
    if (allNavLinksInDrawer) { // Iterate over ALL items to handle clicks
        allNavLinksInDrawer.forEach(item => {
            item.addEventListener('click', function(e) {
                const pageId = this.dataset.page;
                if (pageId) { // If it's a page navigation item
                    // md-list-item type="button" doesn't navigate by default
                    showPage(pageId);
                }
                // For both type="button" (page nav) and type="link" (external/tel), close drawer
                if (mobileMenuDrawer) {
                    mobileMenuDrawer.opened = false; 
                    if(mobileMenuButton) {
                        mobileMenuButton.selected = false;
                        mobileMenuButton.setAttribute('aria-expanded', 'false');
                    }
                }
                // If it was type="link" with an href, default action will proceed after this.
                // If type="button", we've handled it.
            });
        });
    }
});
