document.addEventListener('DOMContentLoaded', function () {
			// --- DOM Element Variables ---
			const navLinks = document.querySelectorAll('.nav-link');
			const desktopNavLinks = document.querySelectorAll('header nav.hidden.md\\:flex .nav-link');
			const pages = document.querySelectorAll('.page');
			const mobileMenuButton = document.getElementById('mobile-menu-button');
			const mobileMenu = document.getElementById('mobile-menu');
			const mobileNavLinksInMenu = mobileMenu ? Array.from(mobileMenu.querySelectorAll('md-list-item.nav-link')) : [];
			const menuTabsContainer = document.getElementById('menu-category-tabs');
			const menuCategories = document.querySelectorAll('.menu-category');
			const homePageMenuButtons = document.querySelectorAll('[data-page-target="menu"]');
			const heroMenuButton = document.getElementById('heroMenuButton');
			const menuItemsContainer = document.getElementById('menu-items-container');
			const cardViewBtn = document.getElementById('card-view-btn');
			const listViewBtn = document.getElementById('list-view-btn');
			const segmentedButtonSet = cardViewBtn ? cardViewBtn.parentElement : null;
			const currentYearSpan = document.getElementById('currentYear');
			const logoLink = document.getElementById('logoLink');

			// --- State Variables ---
			let menuFilterTimeout;
			let currentMenuView = 'card';

			// --- Constants for Durations & Delays (in milliseconds) ---
			const PAGE_TRANSITION_DURATION = 500;
			const PAGE_TRANSITION_FALLBACK_BUFFER = 100; // Extra buffer for transitionend fallback
			const HERO_BUTTON_SHIMMER_DELAY = 500;
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
			/*
			let focusableElementsInMobileMenu = [];
			let firstFocusableElementInMobileMenu;
			let lastFocusableElementInMobileMenu;
			*/

			function openMobileMenu() {
				if (!mobileMenu || !mobileMenuButton) return;
				mobileMenu.opened = true;
				mobileMenuButton.setAttribute('aria-expanded', 'true');
			}

			function closeMobileMenu() {
				if (!mobileMenu || !mobileMenuButton) return;
				mobileMenu.opened = false;
				mobileMenuButton.setAttribute('aria-expanded', 'false');
			}

			/* REMOVE THIS FUNCTION
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
			*/

			// --- Initialization ---
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
				let itemsToAnimate = [];

				if (activePage.id === 'menu') {
					const visibleCategories = activePage.querySelectorAll('.menu-category:not(.hidden)');
					visibleCategories.forEach(categoryDiv => {
						if (currentMenuView === 'card') {
							itemsToAnimate.push(...categoryDiv.querySelectorAll('.stagger-animate > md-elevated-card.menu-card'));
						} else { // list view
							itemsToAnimate.push(...categoryDiv.querySelectorAll('.menu-list-container md-list-item'));
						}
					});
				} else { // For other pages like Home
					itemsToAnimate = activePage.querySelectorAll('.menu-card, .hotspot-card, .stagger-animate > div');
				}

				if (itemsToAnimate.length > 0) {
					itemsToAnimate.forEach((item, index) => {
						// item.classList.remove('visible'); // Already done in filterAndAnimateMenu
						void item.offsetHeight; // Force reflow
						// Apply staggered delay if desired, or simple .visible for CSS transition
						setTimeout(() => item.classList.add('visible'), index * MENU_CARD_ANIMATION_DELAY / 2); // Stagger slightly
					});
				}
			}

			function updateViewToggleButtons() {
				if (!cardViewBtn || !listViewBtn) return;
				cardViewBtn.selected = currentMenuView === 'card';
				listViewBtn.selected = currentMenuView === 'list';
			}

			// NEW HELPER to populate list view for a single category
			function populateListViewCategory(categoryDiv) {
				const cardContainer = categoryDiv.querySelector('.stagger-animate');
				const listContainer = categoryDiv.querySelector('.menu-list-container');
				const cards = Array.from(cardContainer.querySelectorAll('md-elevated-card.menu-card'));

				if (!listContainer || cards.length === 0) return;

				listContainer.innerHTML = ''; // Clear previous list items
				const mdList = document.createElement('md-list');

				cards.forEach(card => {
					const nameElement = card.querySelector('.m3-title-medium'); // Assuming this class is on the name
					const priceElement = card.querySelector('.m3-label-large strong'); // Assuming this class is on the price
					const descriptionElement = card.querySelector('.m3-body-medium'); // Assuming this class is on the description
					const comboPriceElement = card.querySelector('.m3-body-small'); // For combo prices

					if (nameElement && priceElement && descriptionElement) {
						const listItem = document.createElement('md-list-item');
						const name = nameElement.textContent.trim();
						const price = priceElement.textContent.trim();
						let description = descriptionElement.textContent.trim();
						if (comboPriceElement) {
							description += ` (${comboPriceElement.textContent.trim()})`;
						}

						listItem.setAttribute('headline', `${name} - ${price}`);
						listItem.setAttribute('supporting-text', description);
						// listItem.setAttribute('href', '#'); // If list items should be links
						// listItem.type = 'link';
						mdList.appendChild(listItem);
					}
				});
				listContainer.appendChild(mdList);
			}

			function setMenuView(viewType) {
				if (currentMenuView === viewType && menuItemsContainer.dataset.viewInitialized === "true") return; // Avoid re-render if view hasn't changed & initialized
				currentMenuView = viewType;
				updateViewToggleButtons();
				// menuItemsContainer.classList.toggle('list-view-active', viewType === 'list'); // Old class for CSS-only switch

				const allCategories = document.querySelectorAll('.menu-category');
				allCategories.forEach(categoryDiv => {
					const cardContainer = categoryDiv.querySelector('.stagger-animate');
					const listContainer = categoryDiv.querySelector('.menu-list-container');
					if (!cardContainer || !listContainer) return;

					if (viewType === 'list') {
						cardContainer.style.display = 'none';
						populateListViewCategory(categoryDiv); // Populate the md-list
						listContainer.style.display = 'block'; 
					} else { // 'card' view
						listContainer.style.display = 'none';
						cardContainer.style.display = 'grid'; // Or 'flex' depending on its original display if not grid
					}
				});

				const activeFilterButton = document.querySelector('#menu-category-tabs md-primary-tab[selected]');
				const currentCategory = activeFilterButton ? activeFilterButton.dataset.category : 'all';
				filterAndAnimateMenu(currentCategory); // This will handle visibility of categories and then item animations
				menuItemsContainer.dataset.viewInitialized = "true";
			}

			if (cardViewBtn) {
				cardViewBtn.addEventListener('click', () => setMenuView('card'));
			}
			if (listViewBtn) {
				listViewBtn.addEventListener('click', () => setMenuView('list'));
			}

			function filterAndAnimateMenu(categoryToShow) {
				if (menuTabsContainer && menuTabsContainer.selectTabWithKey) {
				}

				menuCategories.forEach(categoryDiv => {
					const categoryGroups = categoryDiv.dataset.categoryGroup.split(' ');
					const shouldShow = categoryGroups.includes(categoryToShow) || categoryToShow === 'all';
					categoryDiv.classList.toggle('hidden', !shouldShow);

					// Remove .visible from all items before re-animating
					const cardsInCat = categoryDiv.querySelectorAll('.menu-card, .menu-list-item'); // Include list items
					Array.from(cardsInCat).forEach(el => el.classList.remove('visible'));
				});

				// Delay to allow DOM updates (hiding/showing categories) before animation
				setTimeout(animateCardsOnLoad, MENU_CARD_ANIMATION_DELAY);
			}

			if (menuTabsContainer) {
				menuTabsContainer.addEventListener('change', function(event) {
					clearTimeout(menuFilterTimeout);
					const selectedTab = event.target.activeTab;
					if (selectedTab) {
						const categoryToShow = selectedTab.dataset.category;
						menuFilterTimeout = setTimeout(() => filterAndAnimateMenu(categoryToShow), MENU_FILTER_DEBOUNCE_DELAY);
					} else {
						console.warn("Could not determine selected tab from event.");
					}
				});
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
				const pageId = link.getAttribute('data-page');
				if (pageId) {
					link.addEventListener('click', function (e) {
						closeMobileMenu(); 
						showPage(pageId);
					});
				}
			});

			if (mobileMenuButton && mobileMenu) {
				mobileMenuButton.addEventListener('click', function () {
					const isOpen = mobileMenu.opened;
					if (isOpen) {
						closeMobileMenu();
					} else {
						openMobileMenu();
					}
				});
			}
		});