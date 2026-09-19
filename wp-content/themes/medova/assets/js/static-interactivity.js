/**
 * Medova / Healthletic Lifestyle - Static Client-side Interactivity Handler
 * Enhances purely static hosting: Cart, Wishlist, QuickView, Search & Notifications
 */
(function($) {
    'use strict';

    // 1. Polyfill jQuery AJAX for WooCommerce & Wishlist static endpoints
    if (typeof $ !== 'undefined' && $.ajaxPrefilter) {
        $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
            var url = options.url || '';
            if (url.indexOf('wc-ajax=') !== -1 || url.indexOf('admin-ajax.php') !== -1 || url.indexOf('wp-json') !== -1) {
                // Intercept and fake success for static server
                options.type = 'GET';
                options.success = options.success || function() {};
                // Override send to prevent 501 on static server
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
            var toast = $('<div class="medova-static-toast" style="position:fixed;bottom:30px;right:30px;background:#111b55;color:#fff;padding:16px 24px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.25);z-index:999999;display:flex;align-items:center;gap:12px;font-family:Outfit,sans-serif;font-weight:600;font-size:15px;transform:translateY(100px);opacity:0;transition:all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);"><i class="' + (icon || 'fas fa-check-circle') + '" style="color:#00d084;font-size:20px;"></i> <span>' + message + '</span></div>');
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
                // Determine relative path to shop
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
                // If quick view modal CSS fails on static host, navigate gracefully to product
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
    });
})(window.jQuery || window.$);
