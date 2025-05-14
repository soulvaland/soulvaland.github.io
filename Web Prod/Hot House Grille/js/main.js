document.addEventListener('DOMContentLoaded', function () {
			// --- DOM Element Variables ---
			const navLinks = document.querySelectorAll('.nav-link');
			const desktopNavLinks = document.querySelectorAll('header nav.hidden.md\\:flex .nav-link');
			const pages = document.querySelectorAll('.page');
			const mobileMenuButton = document.getElementById('mobile-menu-button');
			const mobileMenu = document.getElementById('mobile-menu');
			const mobileNavLinksInMenu = mobileMenu ? mobileMenu.querySelectorAll('.nav-link') : [];
			const menuTabButtons = document.querySelectorAll('.menu-tab-button');
			const menuCategories = document.querySelectorAll('.menu-category');
			const homePageMenuButtons = document.querySelectorAll('[data-page-target="menu"]');
			const heroMenuButton = document.getElementById('heroMenuButton');
			const menuItemsContainer = document.getElementById('menu-items-container');
			const cardViewBtn = document.getElementById('card-view-btn');
			const listViewBtn = document.getElementById('list-view-btn');
			const currentYearSpan = document.getElementById('currentYear');
			const logoLink = document.getElementById('logoLink');

			// --- State Variables ---
			let menuFilterTimeout;
			let tapHintPlayed = false;
			let currentMenuView = 'card';

			// --- Constants for Durations & Delays (in milliseconds) ---
			const PAGE_TRANSITION_DURATION = 500;
			const PAGE_TRANSITION_FALLBACK_BUFFER = 100; // Extra buffer for transitionend fallback
			const HERO_BUTTON_SHIMMER_DELAY = 500;
			const TAP_HINT_APPEAR_DELAY = 700;
			const TAP_HINT_ANIMATION_DURATION_TOTAL = (1700 * 3) + 500; // CSS: (duration * iterations) + delay
			const INITIAL_HOME_CARD_ANIMATION_DELAY = 250;
			const MENU_CARD_ANIMATION_DELAY = 50;
			const MENU_FILTER_DEBOUNCE_DELAY = 50;

			// --- Helper function to get all focusable elements within a parent ---
			function getFocusableElements(parentElement) {
				if (!parentElement) return [];
				return Array.from(
					parentElement.querySelectorAll(
						'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), input[type="text"]:not([disabled]):not([tabindex="-1"]), input[type="radio"]:not([disabled]):not([tabindex="-1"]), input[type="checkbox"]:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"])'
					)
				).filter(el => el.offsetParent !== null);
			}

			// --- Mobile Menu Focus Management Variables & Functions ---
			let focusableElementsInMobileMenu = [];
			let firstFocusableElementInMobileMenu;
			let lastFocusableElementInMobileMenu;

			function openMobileMenu() {
				if (!mobileMenu || !mobileMenuButton) return;
				mobileMenu.classList.remove('hidden');
				mobileMenuButton.setAttribute('aria-expanded', 'true');
				focusableElementsInMobileMenu = getFocusableElements(mobileMenu);
				if (focusableElementsInMobileMenu.length > 0) {
					firstFocusableElementInMobileMenu = focusableElementsInMobileMenu[0];
					lastFocusableElementInMobileMenu = focusableElementsInMobileMenu[focusableElementsInMobileMenu.length - 1];
					firstFocusableElementInMobileMenu.focus();
				}
				document.addEventListener('keydown', handleMobileMenuFocusTrap);
			}

			function closeMobileMenu() {
				if (!mobileMenu || !mobileMenuButton) return;
				mobileMenu.classList.add('hidden');
				mobileMenuButton.setAttribute('aria-expanded', 'false');
				document.removeEventListener('keydown', handleMobileMenuFocusTrap);
				mobileMenuButton.focus();
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
			if (heroMenuButton) {
				setTimeout(() => heroMenuButton.classList.add('animate-shimmer'), HERO_BUTTON_SHIMMER_DELAY);
			}
			if (mobileMenuButton && window.innerWidth < 768 && !tapHintPlayed) {
				setTimeout(() => {
					mobileMenuButton.classList.add('tap-hint-animation');
					tapHintPlayed = true;
					setTimeout(() => {
						if (mobileMenuButton) mobileMenuButton.classList.remove('tap-hint-animation');
					}, TAP_HINT_ANIMATION_DURATION_TOTAL);
				}, TAP_HINT_APPEAR_DELAY);
			}
			if (currentYearSpan) {
				currentYearSpan.textContent = new Date().getFullYear();
			}
			pages.forEach(p => p.classList.add('hidden'));
			const initialPage = document.getElementById('home');
			if (initialPage) {
				initialPage.classList.remove('hidden');
				initialPage.classList.add('active');
				setTimeout(animateCardsOnLoad, INITIAL_HOME_CARD_ANIMATION_DELAY);
			} else {
				console.error("Initial page 'home' not found. Site may not display correctly.");
			}
			updateNavActiveState('home');
			if (document.getElementById('menu')?.classList.contains('active')) {
				 filterAndAnimateMenu('all');
			}
			updateViewToggleButtons();

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
					cardsToAnimate.forEach((card) => {
						card.classList.remove('visible');
						void card.offsetHeight;
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

				// Initial checks: if target page doesn't exist, or if it's the same page (unless it's menu needing re-filter)
				if (!targetPage) {
					console.error('Target page not found:', pageId);
					return;
				}
				const isSamePage = currentlyActivePage === targetPage;
				if (isSamePage && pageId === 'menu') {
					// If it's the menu page and already active, just re-filter/animate based on categoryTarget
					filterAndAnimateMenu(categoryTarget || 'all');
					return;
				}
				if (isSamePage) return; // If same page and not menu, do nothing

				// Animate out the current page, if one is active
				if (currentlyActivePage) {
					animatePageOut(currentlyActivePage);
				}

				// Animate in the new target page and handle post-transition actions
				animatePageIn(targetPage, pageId, categoryTarget);

				// Update navigation link styles
				updateNavActiveState(pageId);
			}

			function updateNavActiveState(activePageId) {
				 navLinks.forEach(link => link.classList.toggle('active', link.dataset.page === activePageId));
				 if (logoLink) logoLink.classList.toggle('active', activePageId === 'home');
			}

			// --- Event Listeners Setup ---
			homePageMenuButtons.forEach(button => {
				button.addEventListener('click', function(e) {
					e.preventDefault();
					showPage(this.dataset.pageTarget, this.dataset.categoryTarget || null);
				});
			});

			if (logoLink) {
				logoLink.addEventListener('click', function(e) {
					e.preventDefault();
					if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
						closeMobileMenu();
					}
					showPage(this.dataset.page);
				});
			}

			desktopNavLinks.forEach(link => {
				if (link.dataset.page) { // Ensure it's a page navigation link
					link.addEventListener('click', function (e) {
						e.preventDefault();
						showPage(this.dataset.page);
					});
				}
			});

			mobileNavLinksInMenu.forEach(link => {
				if (link.dataset.page) {
					link.addEventListener('click', function (e) {
						e.preventDefault();
						const pageId = this.dataset.page;
						closeMobileMenu(); 
						showPage(pageId);
					});
				}
			});

			if (mobileMenuButton && mobileMenu) {
				mobileMenuButton.addEventListener('click', function () {
					const isHidden = mobileMenu.classList.contains('hidden');
					if (isHidden) {
						openMobileMenu();
					} else {
						closeMobileMenu();
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