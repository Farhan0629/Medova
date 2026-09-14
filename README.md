# Medova / Healthletic Lifestyle — Static Website Clone

A picture-perfect static mirror clone of the **Medova** (Healthletic Lifestyle) WordPress + Elementor website, optimized for GitHub Pages static hosting.

- **Live Demo (GitHub Pages):** [https://farhan0629.github.io/Medova/](https://farhan0629.github.io/Medova/)
- **Original Source Site:** [https://darkorchid-peafowl-201172.hostingersite.com/](https://darkorchid-peafowl-201172.hostingersite.com/)
- **Architecture:** 100% Static UI (HTML5, CSS3, JavaScript, WebFonts, SVGs, Images) — zero backend or PHP dependencies.

---

## Features

- **Pixel-Perfect Visual Fidelity:** Retains all Elementor typography, animations, Swiper sliders, Magnific popup lightboxes, sticky headers, responsive menus, and custom styling.
- **Self-Contained Local Assets:** All 880+ assets (images, CSS stylesheets, JavaScript files, fonts, and icons) are hosted directly within the repository under /wp-content/ and /_external/.
- **Zero Original Hotlinking:** All original domain hotlinks rewritten to relative static paths compatible with root and subpath GitHub Pages deployment (/Medova/).
- **Complete Page Inventory:** 60+ pages cloned, including all core clinic pages, meals & cloud kitchen menus, specialized service pages, WooCommerce shop & account flows, and full blog posts.

---

## Page Inventory

### Core Pages
- **Home:** index.html
- **About Us:** about/index.html (alias: about-us/)
- **Services Overview:** services/index.html
- **Service Details:** service-details/index.html
- **Doctors / Team:** doctors/index.html
- **Doctor Details:** doctor-details/index.html
- **Appointment:** appointment/index.html
- **Pricing Plans:** price-table/index.html
- **Case Studies:** case-studies/index.html
- **Case Study Details:** case-study-details/index.html
- **Medical Shop:** medical-shop/index.html
- **Contact:** contact/index.html, contact-us/, contact-healthletic/

### Meals & Cloud Kitchen
- **Cloud Kitchen Menu:** cloud-kitchen-menu/index.html
- **Breakfast:** breakfast/index.html
- **Lunch:** lunch/index.html
- **Dinner:** dinner/index.html
- **Evening Snacks:** evening-snacks/index.html
- **Mid-Morning Snack:** mid-morning-sanck/index.html
- **Hydration Guidelines:** hyderation-guidelines/index.html
- **Diet Plans:** 7378-2/index.html
- **HealthLetic Kitchen:** home-cardiology/index.html

### Specialized Services
- **Yoga Plan (Home Physiotherapy):** home-physiotherapy/index.html
- **Nutrition & Diet:** home-nutrition-diet/index.html
- **Optometrist:** home-optometrist/index.html
- **Surgery Center:** home-surgery-center/index.html
- **Healthy Lifestyle Coaching:** healthy-lifestyle-coaching/index.html
- **Online Health Consultations:** online-health-consultations/index.html
- **Personalized Nutrition Plans:** personalized-nutrition-plans/index.html
- **Nutritional Deficiency Support:** elementor-7015/index.html
- **Personalized Fitness Programs:** fitness-designed-around-you/index.html

### WooCommerce & Membership UI
- **Shop:** shop/index.html (aliases: shop-2/, shop-3/)
- **Cart:** cart/index.html (alias: cart-2/)
- **Checkout:** checkout/index.html (alias: checkout-2/)
- **Wishlist:** wishlist/index.html (alias: wishlist-2/)
- **My Account:** my-account/index.html (alias: my-account-3/, account/)
- **Login:** login/index.html, login-2/
- **Register:** register/index.html
- **Password Reset:** password-reset/index.html
- **Members & User Profiles:** members/index.html, user/

### Blog & Articles
- **Blog Listing:** blog/index.html
- **15 Blog Posts:**
  1. swimming-lessons-save-lives-what-parents-should-know/
  2. how-and-why-to-fit-more-fiber-and-fermented-food-into-your-meals/
  3. want-to-cool-down-14-ideas-to-try/
  4. is-your-breakfast-cereal-healthy/
  5. 5-timeless-habits-for-better-health/
  6. 10-simple-daily-habits-for-a-healthy-life/
  7. natural-foods-that-boost-energy-metabolism/
  8. healthy-lifestyle-simple-fitness-and-diet-tips-for-a-better-life/
  9. best-diet-plan-for-healthy-life/
  10. hello-world/
  11. hello-world-2/
  12. innovative-technologies-transforming-healthcare-delivery/
  13. how-to-keep-your-loved-ones-healthy-year-round/
  14. how-to-choose-the-right-primary-care-doctor-for-you/
  15. strategies-for-effective-time-management/

---

## Local Development & Testing

Run any local static HTTP server from the root of the project:

`ash
python -m http.server 8000
`

Then visit http://localhost:8000/ in your browser.

---

## GitHub Pages Deployment

To deploy this site on GitHub Pages:
1. Navigate to **Settings** -> **Pages** in the GitHub repository.
2. Under **Build and deployment** -> **Source**, select **Deploy from a branch**.
3. Under **Branch**, select **main** and folder **/ (root)**.
4. Click **Save**.
5. Your site will automatically be published at:  
   https://farhan0629.github.io/Medova/
