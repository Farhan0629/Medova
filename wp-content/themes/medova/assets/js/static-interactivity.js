/**
 * Medova / Healthletic Lifestyle - Static Client-side Interactivity Handler
 * Enhances purely static hosting: Cart, Wishlist, QuickView, Search, Responsive Mobile Navigation & Touch Controls
 */
(function($) {
    'use strict';

    // 1. Polyfill jQuery AJAX for WooCommerce & Wishlist static endpoints
    if (typeof $ !== 'undefined' && $.ajaxPrefilter) {
        $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
            var url = options.url || '';
            if (url.indexOf('wc-ajax=') !== -1 || url.indexOf('admin-ajax.php') !== -1 || url.indexOf('wp-json') !== -1) {
                options.type = 'GET';
                options.success = options.success || function() {};
                var originalSend = jqXHR.send;
                jqXHR.send = function() {
                    setTimeout(function() {
                        if (typeof options.success === 'function') {
                            options.success({
                                count: parseInt(localStorage.getItem('medova_wishlist_count') || '1'),
                                fragments: {},
                                cart_hash: 'static_cart'
                            });
                        }
                    }, 50);
                };
            }
        });
    }

    $(document).ready(function() {
        // Load initial counts from localStorage
        var cartCount = parseInt(localStorage.getItem('medova_cart_count') || '0');
        var wishlistCount = parseInt(localStorage.getItem('medova_wishlist_count') || '0');

        function updateBadges() {
            $('.wpr-cart-count, .cart-count, .mini-cart-count, .badge').text(cartCount > 0 ? cartCount : '0');
            $('.woosw-count, .wishlist-count').text(wishlistCount > 0 ? wishlistCount : '0');
        }
        updateBadges();

        // 2. Toast notification function
        function showToast(message, icon) {
            var toast = $('<div class="medova-static-toast" style="position:fixed;bottom:25px;right:25px;background:#111b55;color:#fff;padding:14px 22px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.25);z-index:999999;display:flex;align-items:center;gap:12px;font-family:Outfit,sans-serif;font-weight:600;font-size:15px;transform:translateY(100px);opacity:0;transition:all 0.35s cubic-bezier(0.175,0.885,0.32,1.275);"><i class="' + (icon || 'fas fa-check-circle') + '" style="color:#00d084;font-size:20px;"></i> <span>' + message + '</span></div>');
            $('body').append(toast);
            setTimeout(function() {
                toast.css({ 'transform': 'translateY(0)', 'opacity': '1' });
            }, 50);
            setTimeout(function() {
                toast.css({ 'transform': 'translateY(100px)', 'opacity': '0' });
                setTimeout(function() { toast.remove(); }, 400);
            }, 3000);
        }

        // 3. Handle Add to Cart button clicks
        $(document).on('click', '.add_to_cart_button, .ajax_add_to_cart, button.single_add_to_cart_button, a.button[href*="add-to-cart"]', function(e) {
            e.preventDefault();
            var $btn = $(this);
            var title = $btn.closest('.product, .th-product, .service-card, .elementor-widget-container').find('.woocommerce-loop-product__title, .product-title, .box-title, h3, h4').first().text().trim() || 'Item';

            $btn.addClass('loading');
            setTimeout(function() {
                $btn.removeClass('loading').addClass('added');
                cartCount++;
                localStorage.setItem('medova_cart_count', cartCount);
                updateBadges();
                showToast(title + ' added to your cart!', 'fas fa-shopping-bag');
            }, 300);
        });

        // 4. Handle Wishlist button clicks
        $(document).on('click', '.woosw-btn, .add_to_wishlist, .yith-wcwl-add-button a', function(e) {
            e.preventDefault();
            var $btn = $(this);
            $btn.toggleClass('woosw-added added');
            var isAdded = $btn.hasClass('woosw-added') || $btn.hasClass('added');
            if (isAdded) {
                wishlistCount++;
                showToast('Item added to your Wishlist!', 'fas fa-heart');
            } else {
                wishlistCount = Math.max(0, wishlistCount - 1);
                showToast('Item removed from Wishlist', 'far fa-heart');
            }
            localStorage.setItem('medova_wishlist_count', wishlistCount);
            updateBadges();
        });

        // 5. Handle Search form submits
        $('form.wpr-search-form, form[role="search"]').on('submit', function(e) {
            var query = $(this).find('input[name="s"], input[type="search"]').val();
            if (query && query.trim()) {
                e.preventDefault();
                var currentPath = window.location.pathname;
                var depth = (currentPath.replace(/^\//, '').replace(/\/$/, '').split('/').length) - 1;
                var prefix = depth <= 0 ? '.' : Array(depth).fill('..').join('/');
                window.location.href = prefix + '/shop-3/index.html?s=' + encodeURIComponent(query.trim());
            }
        });

        // 6. Handle quick-view fallback
        $(document).on('click', '.woosq-btn', function(e) {
            var $card = $(this).closest('.product, .th-product, .service-card');
            var productLink = $card.find('a[href*="/product/"], a.woocommerce-LoopProduct-link').attr('href');
            if (productLink) {
                window.location.href = productLink;
            }
        });

        // 7. Ensure background videos autoplay smoothly
        $('video.elementor-background-video-hosted, video[autoplay]').each(function() {
            var v = this;
            v.muted = true;
            var playPromise = v.play();
            if (playPromise !== undefined) {
                playPromise.catch(function(error) {
                    $(document).one('touchstart click scroll', function() {
                        v.play();
                    });
                });
            }
        });

        // =========================================================================
        // 8. MASTER MOBILE NAVIGATION SYSTEM (WPR MENU + THEME MENU)
        // =========================================================================

        // Backdrop element
        var $backdrop = $('<div class="medova-nav-backdrop" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:99998;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);"></div>');
        $('body').append($backdrop);

        function closeAllMobileMenus() {
            $('.wpr-mobile-nav-menu').removeClass('open show wpr-active-menu').slideUp(200);
            $('.wpr-mobile-toggle').removeClass('active');
            $('.th-menu-wrapper').removeClass('th-body-visible');
            $('.th-mobile-menu').removeClass('open');
            $backdrop.fadeOut(200);
            $('body').removeClass('menu-open-locked');
        }

        // A. Toggle Royal Elementor Addons Mobile Menu
        $(document).on('click', '.wpr-mobile-toggle, .wpr-mobile-toggle-wrap', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var $toggle = $(this).closest('.wpr-mobile-nav-menu-container').find('.wpr-mobile-toggle');
            var $menu = $(this).closest('.wpr-mobile-nav-menu-container').find('.wpr-mobile-nav-menu');

            var isOpen = $menu.hasClass('open') || $menu.is(':visible');
            if (isOpen) {
                $menu.removeClass('open show wpr-active-menu').slideUp(200);
                $toggle.removeClass('active');
                $backdrop.fadeOut(200);
            } else {
                // Close any other open menus
                $('.wpr-mobile-nav-menu').not($menu).removeClass('open show wpr-active-menu').hide();
                $('.wpr-mobile-toggle').not($toggle).removeClass('active');

                $menu.addClass('open show wpr-active-menu').slideDown(250);
                $toggle.addClass('active');
                $backdrop.fadeIn(200);
            }
        });

        // B. Handle Mobile Submenu Accordions
        $(document).on('click', '.wpr-mobile-nav-menu .menu-item-has-children > a, .th-mobile-menu .menu-item-has-children > a', function(e) {
            var $parentLi = $(this).parent('li');
            var $submenu = $parentLi.children('.sub-menu');

            if ($submenu.length > 0) {
                var href = $(this).attr('href');
                // If link is placeholder or user wants to expand dropdown
                if (!href || href === '#' || href === 'javascript:void(0);' || !$(this).hasClass('direct-nav')) {
                    e.preventDefault();
                    e.stopPropagation();

                    var isSubOpen = $submenu.hasClass('open') || $submenu.is(':visible');
                    if (isSubOpen) {
                        $submenu.removeClass('open show').slideUp(200);
                        $parentLi.removeClass('th-active active');
                    } else {
                        // Collapse sibling submenus for accordion behavior
                        $parentLi.siblings('.menu-item-has-children').find('.sub-menu').removeClass('open show').slideUp(200);
                        $parentLi.siblings('.menu-item-has-children').removeClass('th-active active');

                        $submenu.addClass('open show').slideDown(200);
                        $parentLi.addClass('th-active active');
                    }
                }
            }
        });

        // C. Close menu when clicking backdrop or outside
        $backdrop.on('click', function() {
            closeAllMobileMenus();
        });

        $(document).on('click', function(e) {
            if (!$(e.target).closest('.wpr-mobile-nav-menu-container, .th-menu-wrapper, .elementor-widget-wpr-nav-menu').length) {
                closeAllMobileMenus();
            }
        });

        // D. Close menu when standard link is clicked
        $(document).on('click', '.wpr-mobile-nav-menu a:not(.menu-item-has-children > a), .th-mobile-menu a:not(.menu-item-has-children > a)', function() {
            var href = $(this).attr('href');
            if (href && href !== '#') {
                closeAllMobileMenus();
            }
        });

        // E. Theme Header Mobile Menu Toggle
        $(document).on('click', '.th-menu-toggle', function(e) {
            e.preventDefault();
            $('.th-menu-wrapper').toggleClass('th-body-visible');
            var isVis = $('.th-menu-wrapper').hasClass('th-body-visible');
            if (isVis) {
                $backdrop.fadeIn(200);
            } else {
                $backdrop.fadeOut(200);
            }
        });

        // F. Search Icon Click on Mobile -> Reveal Search Prompt / Modal
        $(document).on('click', '.elementor-element-1fe45ef, .elementor-element-e8c61c1', function(e) {
            e.preventDefault();
            var $searchForm = $(this).closest('.e-con, header').find('.elementor-widget-wpr-search, form[role="search"]');
            if ($searchForm.length) {
                $searchForm.slideToggle(200).find('input').focus();
            } else {
                var query = prompt("Search Medova / Healthletic:");
                if (query && query.trim()) {
                    var currentPath = window.location.pathname;
                    var depth = (currentPath.replace(/^\//, '').replace(/\/$/, '').split('/').length) - 1;
                    var prefix = depth <= 0 ? '.' : Array(depth).fill('..').join('/');
                    window.location.href = prefix + '/shop-3/index.html?s=' + encodeURIComponent(query.trim());
                }
            }
        });

        // G. Nested Tabs in Cloud Kitchen Menu - Touch / Click Handler
        $(document).on('click', '.e-n-tab-title', function(e) {
            e.preventDefault();
            var tabIndex = $(this).attr('data-tab-index');
            var $widget = $(this).closest('.e-n-tabs');

            $widget.find('.e-n-tab-title').attr('aria-selected', 'false').removeClass('e-active');
            $(this).attr('aria-selected', 'true').addClass('e-active');

            $widget.find('.e-n-tabs-content > div').hide().removeClass('e-active');
            $widget.find('#e-n-tab-content-' + $widget.attr('data-widget-number') + tabIndex + ', [data-tab-index="' + tabIndex + '"].e-con').show().addClass('e-active');
        });

        // H. Window Resize Adjustments
        var resizeTimer;
        $(window).on('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if ($(window).width() > 1024) {
                    closeAllMobileMenus();
                }
            }, 150);
        });
    });
})(window.jQuery || window.$);
