// js/main.js (or m3-setup.js) - make sure it's loaded as type="module" in HTML
import '@material/web/topappbar/top-app-bar-fixed.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/icon/icon.js';
// Import other MWC as you need them for other chunks (e.g., list, card, tabs)

document.addEventListener('DOMContentLoaded', function () {
    // --- DOM Element Variables ---
    const pages = document.querySelectorAll('.page');
    const mobileMenuButton = document.getElementById('mobile-menu-button'); // This is now an <md-icon-button>
    const mobileMenu = document.getElementById('mobile-menu'); // This will be refactored in Chunk 3
    // const mobileNavLinksInMenu = mobileMenu ? mobileMenu.querySelectorAll('md-text-button[data-page]') : []; // For Chunk 3

    const menuTabButtons = document.querySelectorAll('.menu-tab-button'); // Will be MWC tabs later
    const menuCategories = document.querySelectorAll('.menu-category');
    const homePageMenuButtons = document.querySelectorAll('[data-page-target="menu"]'); // These are likely standard buttons, will become MWC
    const heroMenuButton = document.getElementById('heroMenuButton'); // Will become MWC
    const menuItemsContainer = document.getElementById('menu-items-container');
    const cardViewBtn = document.getElementById('card-view-btn'); // Will become MWC segmented button
    const listViewBtn = document.getElementById('list-view-btn'); // Will become MWC segmented button
    const currentYearSpan = document.getElementById('currentYear');
    const logoLink = document.getElementById('logoLink'); // This is an <a> tag

    // Corrected selectors for MWC navigation elements in the top app bar
    const mwcNavElements = document.querySelectorAll('md-top-app-bar-fixed md-text-button[data-page], md-top-app-bar-fixed a#logoLink[data-page]');


    // --- State Variables ---
    let menuFilterTimeout;
    // let tapHintPlayed = false; // tap-hint-animation removed, MWC has own feedback
    let currentMenuView = 'card';

    // --- Constants for Durations & Delays (in milliseconds) ---
    // These will be updated with M3 motion tokens/principles later
    const PAGE_TRANSITION_DURATION = 500;
    const PAGE_TRANSITION_FALLBACK_BUFFER = 100;
    // const HERO_BUTTON_SHIMMER_DELAY = 500; // Shimmer removed
    const INITIAL_HOME_CARD_ANIMATION_DELAY = 250;
    const MENU_CARD_ANIMATION_DELAY = 50;
    const MENU_FILTER_DEBOUNCE_DELAY = 50;

    // --- Helper function to get all focusable elements within a parent ---
    // This might still be useful for the old mobile menu, but MWC often handle their own focus.
    function getFocusableElements(parentElement) {
        if (!parentElement) return [];
        return Array.from(
            parentElement.querySelectorAll(
                'a[href]:not([tabindex="-1"]):not([disabled]), button:not([disabled]):not([tabindex="-1"]), md-icon-button:not([disabled]), md-text-button:not([disabled]), md-filled-button:not([disabled]), textarea:not([disabled]):not([tabindex="-1"]), input[type="text"]:not([disabled]):not([tabindex="-1"]), input[type="radio"]:not([disabled]):not([tabindex="-1"]), input[type="checkbox"]:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"])'
            )
        ).filter(el => el.offsetParent !== null); // Ensure element is visible
    }

    // --- Mobile Menu Focus Management (Old - will be heavily refactored in Chunk 3) ---
    let focusableElementsInMobileMenu = [];
    let firstFocusableElementInMobileMenu;
    let lastFocusableElementInMobileMenu;

    function openMobileMenu() { // This function will change for MWC mobile menu/drawer
        if (!mobileMenu || !mobileMenuButton) return;
        mobileMenu.classList.remove('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'true');
        // mobileMenuButton.selected = true; // For MWC Icon Button toggle state if supported

        focusableElementsInMobileMenu = getFocusableElements(mobileMenu);
        if (focusableElementsInMobileMenu.length > 0) {
            firstFocusableElementInMobileMenu = focusableElementsInMobileMenu[0];
            lastFocusableElementInMobileMenu = focusableElementsInMobileMenu[focusableElementsInMobileMenu.length - 1];
            firstFocusableElementInMobileMenu.focus();
        }
        document.addEventListener('keydown', handleMobileMenuFocusTrap);
    }

    function closeMobileMenu() { // This function will change for MWC mobile menu/drawer
        if (!mobileMenu || !mobileMenuButton) return;
        mobileMenu.classList.add('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        // mobileMenuButton.selected = false; // For MWC Icon Button toggle state

        document.removeEventListener('keydown', handleMobileMenuFocusTrap);
        if (mobileMenuButton.focus) mobileMenuButton.focus();
    }

    function handleMobileMenuFocusTrap(e) { // This might become obsolete with MWC drawer
        if (!mobileMenu || mobileMenu.classList.contains('hidden')) {
            document.removeEventListener('keydown', handleMobileMenuFocusTrap);
            return;
        }
        const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
        if (!isTabPressed) return;

        focusableElementsInMobileMenu = getFocusableElements(mobileMenu); // Re-query in case content changed
        if (focusableElementsInMobileMenu.length === 0) return;
        firstFocusableElementInMobileMenu = focusableElementsInMobileMenu[0];
        lastFocusableElementInMobileMenu = focusableElementsInMobileMenu[focusableElementsInMobileMenu.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElementInMobileMenu) {
                lastFocusableElementInMobileMenu.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableElementInMobileMenu) {
                firstFocusableElementInMobileMenu.focus();
                e.preventDefault();
            }
        }
    }

    // --- Initialization ---
    // if (heroMenuButton) { // Shimmer animation removed
    //     setTimeout(() => heroMenuButton.classList.add('animate-shimmer'), HERO_BUTTON_SHIMMER_DELAY);
    // }
    // Tap hint animation for mobile menu button removed, MWC icon buttons have built-in feedback
    // if (mobileMenuButton && window.innerWidth < 768 && !tapHintPlayed) { ... }

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    pages.forEach(p => p.classList.add('hidden')); // Keep pages hidden initially
    const initialPageId = 'home'; // Default to home
    const initialPage = document.getElementById(initialPageId);

    if (initialPage) {
        initialPage.classList.remove('hidden');
        initialPage.classList.add('active'); // Ensure .active is added for CSS transitions
        // setTimeout(animateCardsOnLoad, INITIAL_HOME_CARD_ANIMATION_DELAY); // Keep for now
    } else {
        console.error(`Initial page '${initialPageId}' not found. Site may not display correctly.`);
    }
    updateNavActiveState(initialPageId); // Set initial active nav state

    if (document.getElementById('menu')?.classList.contains('active')) {
         filterAndAnimateMenu('all'); // Keep for now
    }
    // updateViewToggleButtons(); // Keep for now, will be refactored with MWC segmented buttons


    // --- Core Functions ---
    function animateCardsOnLoad() { // Keep for now, motion will be updated later
        const activePage = document.querySelector('.page.active');
        if (!activePage) return;
        let cardsToAnimate;
        if (activePage.id === 'menu') {
             cardsToAnimate = activePage.querySelectorAll('.menu-category:not(.hidden) .menu-card, .menu-category:not(.hidden) .stagger-animate > div');
        } else {
             cardsToAnimate = activePage.querySelectorAll('.menu-card, .hotspot-card, .stagger-animate > div');
        }
        if (cardsToAnimate.length > 0) {
            cardsToAnimate.forEach((card) => {
                card.classList.remove('visible'); // Assuming 'visible' class handles animation
                void card.offsetHeight; // Trigger reflow
                card.classList.add('visible');
            });
        }
    }

			function updateViewToggleButtons() {
				if (!cardViewBtn || !listViewBtn) return;
				const isActive = (view) => currentMenuView === view;

				const activeClasses = ['bg-[#B03C23]', 'text-white', 'border-[#011640]', 'hover:bg-[#912f1b]'];
				const inactiveClasses = ['bg-gray-200', 'text-[#073A59]', 'border-transparent', 'hover:bg-gray-300'];

				// Helper to apply classes
				const applyClasses = (element, add, remove) => {
					element.classList.remove(...remove);
					element.classList.add(...add);
				};

				// Card View Button
				cardViewBtn.setAttribute('aria-pressed', String(isActive('card')));
				if (isActive('card')) {
					applyClasses(cardViewBtn, activeClasses, inactiveClasses);
				} else {
					applyClasses(cardViewBtn, inactiveClasses, activeClasses);
				}

				// List View Button
				listViewBtn.setAttribute('aria-pressed', String(isActive('list')));
				if (isActive('list')) {
					applyClasses(listViewBtn, activeClasses, inactiveClasses);
				} else {
					applyClasses(listViewBtn, inactiveClasses, activeClasses);
				}
			}

			function setMenuView(viewType) {
				if (currentMenuView === viewType || !menuItemsContainer) return;
				currentMenuView = viewType;
				updateViewToggleButtons();
				menuItemsContainer.classList.toggle('list-view', viewType === 'list');
				const activeFilterButton = document.querySelector('.menu-tab-button.tab-active') || document.getElementById('menu-tab-all');
				const currentCategory = activeFilterButton ? activeFilterButton.dataset.category : 'all';
				filterAndAnimateMenu(currentCategory);
			}

			function filterAndAnimateMenu(categoryToShow) {
				const targetButton = document.querySelector(`.menu-tab-button[data-category="${categoryToShow}"]`);
				menuTabButtons.forEach(btn => {
					const isSelected = btn === targetButton;
					btn.classList.toggle('tab-active', isSelected);
					btn.setAttribute('aria-selected', String(isSelected));
				});
				menuCategories.forEach(categoryDiv => {
					const categoryGroups = categoryDiv.dataset.categoryGroup.split(' ');
					const shouldShow = categoryGroups.includes(categoryToShow) || categoryToShow === 'all';
					categoryDiv.classList.toggle('hidden', !shouldShow);
					const cardsInCat = categoryDiv.querySelectorAll('.menu-card, .stagger-animate > div');
					Array.from(cardsInCat).forEach(el => el.classList.remove('visible'));
				});
				setTimeout(animateCardsOnLoad, MENU_CARD_ANIMATION_DELAY);
			}

			// --- NEW: Helper function for page-out animation ---
			/**
			 * Handles the animation and cleanup for the page that is transitioning out.
			 * @param {HTMLElement} pageElement - The page element to animate out.
			 */
			function animatePageOut(pageElement) {
				if (!pageElement) return;

				// Reset visibility of cards on the outgoing page
				pageElement.querySelectorAll('.menu-card, .hotspot-card, .stagger-animate > div').forEach(el => el.classList.remove('visible'));
				// Apply exit animation classes
				pageElement.classList.remove('page-transition-enter', 'page-transition-enter-active');
				pageElement.classList.add('page-transition-exit', 'page-transition-exit-active');

				const exitHandler = () => {
					pageElement.classList.remove('active', 'page-transition-exit', 'page-transition-exit-active');
					pageElement.classList.add('hidden');
					pageElement.removeEventListener('transitionend', exitHandler);
				};
				pageElement.addEventListener('transitionend', exitHandler, { once: true });
				// Fallback timeout in case transitionend event doesn't fire
				setTimeout(() => {
					if (pageElement.classList.contains('active')) { // Check if still active (i.e., handler didn't run)
						exitHandler();
					}
				}, PAGE_TRANSITION_DURATION + PAGE_TRANSITION_FALLBACK_BUFFER);
			}

			// --- NEW: Helper function for page-in animation and post-transition actions ---
			/**
			 * Handles the animation for the page that is transitioning in and subsequent actions.
			 * @param {HTMLElement} targetPageElement - The page element to animate in.
			 * @param {string} pageId - The ID of the target page.
			 * @param {string|null} categoryTarget - Optional category for menu page.
			 */
			function animatePageIn(targetPageElement, pageId, categoryTarget) {
				if (!targetPageElement) return;

				// Prepare for entry animation
				targetPageElement.classList.remove('hidden', 'page-transition-exit', 'page-transition-exit-active', 'page-transition-enter');
				void targetPageElement.offsetWidth; // Force reflow
				targetPageElement.classList.add('active', 'page-transition-enter', 'page-transition-enter-active');

				let entryHandlerRun = false;
				const entryHandler = () => {
					if (entryHandlerRun) return;
					entryHandlerRun = true;

					// Perform actions after the page has transitioned in
					if (pageId === 'menu') {
						filterAndAnimateMenu(categoryTarget || 'all');
					} else {
						animateCardsOnLoad();
					}

					targetPageElement.removeEventListener('transitionend', entryHandler);

					// Scroll to top and set focus for accessibility
					window.scrollTo({ top: 0, behavior: 'smooth' });
					const newHeading = targetPageElement.querySelector('h1');
					if (newHeading) {
						newHeading.setAttribute('tabindex', '-1');
						newHeading.focus({ preventScroll: true });
					}
				};
				targetPageElement.addEventListener('transitionend', entryHandler, { once: true });
				// Fallback timeout
				setTimeout(() => {
					if (!entryHandlerRun && targetPageElement.classList.contains('active') && targetPageElement.classList.contains('page-transition-enter-active')) {
						entryHandler();
					}
				}, PAGE_TRANSITION_DURATION + PAGE_TRANSITION_FALLBACK_BUFFER);
			}

			// --- REFACTORED: showPage function ---
			/**
			 * Handles the display and transition of pages.
			 * @param {string} pageId - The ID of the page to show.
			 * @param {string|null} categoryTarget - Optional: If navigating to the menu, a specific category to filter by.
			 */
			    function showPage(pageId, categoryTarget = null) {
					const currentlyActivePage = document.querySelector('.page.active');
					const targetPage = document.getElementById(pageId);

					if (!targetPage) {
						console.error('Target page not found:', pageId);
						return;
					}
					const isSamePage = currentlyActivePage === targetPage;
					if (isSamePage && pageId === 'menu' && categoryTarget) {
						filterAndAnimateMenu(categoryTarget);
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
						// For accessibility, indicate the current page
						if (button.tagName === 'MD-TEXT-BUTTON' || button.tagName === 'MD-FILLED-BUTTON' || button.tagName === 'MD-ICON-BUTTON') {
							 button.setAttribute('aria-current', isSelected ? 'page' : 'false');
						} else if (button.tagName === 'A') { // For the logo link
							 button.setAttribute('aria-current', isSelected ? 'page' : 'false');
						}
					});
					 if (logoLink) { // Specific class for logo if needed, though covered by mwcNavElements
						logoLink.classList.toggle('logo-link-m3-active', activePageId === 'home');
					}
				}

				// --- Event Listeners Setup ---

				// For MWC navigation elements in the top app bar
				mwcNavElements.forEach(navElement => {
					navElement.addEventListener('click', function (e) {
						e.preventDefault();
						const pageId = this.dataset.page;
						if (pageId) {
							// If mobile menu is open, close it (this logic will be updated in Chunk 3)
							if (mobileMenu && !mobileMenu.classList.contains('hidden') && mobileMenuButton.contains(e.target)) {
								// Don't close if a nav link *inside* the mobile menu is clicked.
								// This check is more relevant when mobileNavLinksInMenu are handled.
							} else if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
								// closeMobileMenu(); // This will be MWC specific
							}
							showPage(pageId);
						}
					});
				});
				
				// Home page buttons that navigate to menu (will become MWC)
				homePageMenuButtons.forEach(button => {
					button.addEventListener('click', function(e) {
						e.preventDefault();
						showPage(this.dataset.pageTarget, this.dataset.categoryTarget || null);
					});
				});


				// Mobile Menu Button (now an md-icon-button)
				// The actual opening/closing of the MWC mobile menu/drawer will be handled in Chunk 3.
				// For now, this can toggle the old menu if it's still in the DOM for testing.
				if (mobileMenuButton) { // mobileMenu will be replaced by MWC drawer
					mobileMenuButton.addEventListener('click', function () {
						if (mobileMenu) { // Check if old mobile menu div still exists
							const isHidden = mobileMenu.classList.contains('hidden');
							if (isHidden) {
								openMobileMenu(); // Old function, will be replaced
							} else {
								closeMobileMenu(); // Old function, will be replaced
							}
						} else {
							console.log("Mobile menu MWC not yet implemented.");
						}
					});
				}

			if (menuTabButtons.length > 0) {
				menuTabButtons.forEach(button => {
					button.addEventListener('click', function() {
						clearTimeout(menuFilterTimeout);
						const categoryToShow = this.dataset.category;
						menuFilterTimeout = setTimeout(() => filterAndAnimateMenu(categoryToShow), MENU_FILTER_DEBOUNCE_DELAY);
					});
				});
			}

			if (cardViewBtn && listViewBtn) {
				cardViewBtn.addEventListener('click', () => setMenuView('card'));
				listViewBtn.addEventListener('click', () => setMenuView('list'));
			}
		});