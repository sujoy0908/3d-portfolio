# 3D Generalist Portfolio

Welcome to your production-ready 3D portfolio! This README serves as a quick guide on how to maintain and update the projects displayed on the site without needing to touch the core HTML or CSS.

## Non-Technical Owner Guide

Your website is now powered by **Decap CMS**, allowing you to easily update your portfolio, NDA gallery, and settings without touching any code!

### How to Log In
1. Navigate to `yoursite.com/admin/`.
2. You will be prompted to log in using Netlify Identity.
3. Enter your email and password (set up via your Netlify Identity invite link).
4. You will now see the Content Manager Dashboard.

### Updating Your Portfolio
1. Click on **Site Content** > **Portfolio Collection** on the left sidebar.
2. You will see a list of your current projects.
3. Click an existing project to edit it, or click **Add project** to create a new one.
4. Fill out the fields: Title, ID, Category, Image, Description, Poly Count, Textures, Render Time.
5. **Model URL**: Click to upload your `.glb` 3D model file. *Important: Only upload `.glb` files here for the 3D viewer to work properly.*
6. **Software**: Select the software used from the list.
7. Click **Publish** to save changes to your live website.

### Managing the NDA Gallery
1. Click on **NDA Gallery Collection** on the left sidebar.
2. You can add or edit confidential projects here by providing a Title, Description, Image, and Link.
3. Click **Publish** to save.

### Changing the NDA Password
1. Click on **Settings Collection** > **General Settings** on the left sidebar.
2. Update the **NDA Access Password** field to your new desired access code.
3. Click **Publish**. The site will instantly start requiring the new password for the NDA gallery.

### ⚠️ Important Note for Site Owners
Before the dashboard will work on the live site, you **must** configure Netlify properly:
1. Go to your Netlify Dashboard > Site Settings > **Identity**.
2. Click **Enable Identity**.
3. Under the Identity tab, scroll to **Services** > **Git Gateway** and click **Enable Git Gateway**.
4. (Optional but recommended) Change Registration preferences to **Invite only** so random users cannot create accounts on your admin panel.

## PWA (Progressive Web App) Support
This portfolio is configured as a PWA. It caches core files so it can be viewed offline. If you update your `styles.css` or `script.js` and don't see changes immediately, try doing a "Hard Refresh" (Ctrl+F5 or Shift+Cmd+R) or clear your browser cache, as the Service Worker may be serving the offline cached version.

## Available Software Icons
The `injectSoftwareIcons` function in `script.js` currently supports the following tags:
- `maya`
- `zbrush`
- `substance`
- `unreal`
- `blender`
- `marmoset`
- `photoshop`

Enjoy your new site!

## Deployment Technical Guide

To ensure your PWA and routing work correctly in production, follow these platform-specific instructions:

### Netlify
1. Create a file named `_redirects` in the root of your project.
2. Add the following rule to handle the 404 page:
   ```
   /*    /404.html    404
   ```
3. Your `sw.js` (Service Worker) will automatically be served correctly from the root.

### Vercel
1. Create a file named `vercel.json` in the root of your project.
2. Add the following configuration to handle 404 routing:
   ```json
   {
     "cleanUrls": true,
     "trailingSlash": false,
     "routes": [
       { "handle": "filesystem" },
       { "src": "/(.*)", "status": 404, "dest": "/404.html" }
     ]
   }
   ```

### PWA Verification
After deploying, open your live site in Chrome and check the **Lighthouse** tab in Developer Tools. Run a scan to ensure the PWA is recognized as "Installable." If it is not, double-check that `manifest.json` and `sw.js` are in the root directory and properly referenced in `index.html`.
