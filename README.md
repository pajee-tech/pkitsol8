# PK IT Sol landing page

A static, single-page marketing site: plain HTML, CSS and vanilla JavaScript.
No build step, no dependencies, no framework.

## Structure

```
.
├── index.html            Home page (all sections, inline SVG icon sprite)
├── seo-services.html     Service page with the SEO proposal form
├── web-development.html  Service page with the web quote form
├── digital-marketing.html  Service page with the marketing proposal form
├── service-template.html Blank service page to copy for new services
├── privacy-policy.html   Privacy policy, linked from every footer and form
├── 404.html              Shown for addresses that do not exist
├── robots.txt, sitemap.xml  Only the home page is listed
├── vercel.json           Clean URLs on Vercel (/seo-services instead of /seo-services.html)
├── css/
│   └── style.css         Design tokens, logo recolouring, sections, breakpoints
├── js/
│   ├── config.js         Brand settings and portfolio projects
│   └── main.js           Nav, tabs, carousels, accordion, forms, lightbox
├── assets/
│   └── img/              Logo files, favicon, photos and placeholder artwork
│       └── portfolio/    Search Console screenshots for the SEO portfolio
└── tools/
    ├── download-images.bat   Windows: downloads the section photos and GSC graphs
    ├── download-images.sh    macOS / Linux version of the same
    └── split_logo.py         Regenerates the logo masks from a new logo PNG
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080      # then visit http://localhost:8080
```

## Deploy (GitHub + Vercel)

The pages only work when the folders are uploaded as folders. `index.html`
looks for `css/style.css`, `js/main.js` and `assets/img/...`; if those files
are uploaded loose next to `index.html`, the site shows as plain text with
giant icons.

1. Unzip the download. Open the folder so you can see `index.html`, `css`,
   `js`, `assets`, `tools`.
2. In the GitHub repository delete the old files, then choose
   Add file → Upload files.
3. Select everything inside the folder (Ctrl+A) and **drag it onto the upload
   box**. Dragging keeps the folders; the "choose your files" button does not.
4. Before committing, check the list shows paths such as `css/style.css` and
   `js/main.js`, not just `style.css`.
5. Commit. Vercel redeploys by itself. In Vercel keep Framework Preset "Other"
   and Root Directory empty.
6. Check these addresses open (they must not say 404):
   `/css/style.css`, `/js/main.js`, `/js/config.js`, `/assets/img/logo.png`

## Change the brand details

Edit `js/config.js`. Name, tagline, phone, WhatsApp, email, address, map,
social links, form delivery and the portfolio are read from there and written into every element marked with
`data-brand` or `data-brand-link`. Social icons stay hidden until you add a URL.

`index.html` also contains the same details as plain text so the page reads
correctly for search engines and without JavaScript. For a full rebrand, run a
find-and-replace on `index.html` as well (and update `<title>` and the meta tags).

## Change the colours

All colours are CSS variables at the top of `css/style.css`. Replace the
`--brand-50` … `--brand-950` scale and the whole page follows.

### How the logo follows the palette

The logo is not shown as a coloured image. It is split into two alpha masks,
`logo-ink.png` (dark artwork) and `logo-accent.png` (highlight artwork), and
CSS fills each mask with a variable:

```css
--logo-ink: var(--brand-900);
--logo-accent: var(--brand-500);
```

Add the class `logo--on-dark` to use the white version on dark backgrounds.
Browsers without CSS mask support fall back to `logo.png` with a hue filter.

To swap in a different logo:

```bash
pip install pillow numpy
python3 tools/split_logo.py path/to/new-logo.png
```

Then copy the printed `aspect-ratio` into the `.logo` rule in `css/style.css`.

## The three service pages

`seo-services.html`, `web-development.html` and `digital-marketing.html` share
the same building blocks but each has its own look:

| Page | Colour (`<body>` class) | Hero visual | Sub-service layout |
| --- | --- | --- | --- |
| SEO Services | site blues, `svc--seo` | search results, Maps and AI answer | numbered stack (`.stack`) |
| Web Development | site blues, `svc--web` | browser and phone wireframe | build cards with price tag (`.build-grid`) |
| Digital Marketing | site blues, `svc--dm` | sponsored post and report card | channel cards in shades of blue (`.channel-grid`) |

Every page has: hero (heading, sub-heading, "enter your website" bar), jump
links, sub-services (each with its own `id`, a "Get a Proposal" button and a
"Call Us" link), results, pricing, process, "where we work" and FAQs.

**Prices.** The starting prices on the pages are market-rate suggestions for a
mid-size Islamabad agency. Check them and change them in the HTML (search for
`PKR`). Each page's price is also in its `<script type="application/ld+json">`
block near the top (`"price"`), so change it there too.

**Proposal form.** The form is a pop-up (`<dialog id="quote">` near the end of
each page). It opens when a visitor submits the website bar, clicks any
"Get a Proposal" button or any link to `#quote`, or arrives from the home page
"Send Me a Proposal" box. The button passes its `data-service` to the form's
"Service You Need" list, so the email says which sub-service was asked for.

**Locations.** Headings target Pakistan; the "Where We Work" section
(`id="where"`) and one FAQ carry Islamabad and Rawalpindi. That section has a
short intro, three rows (Islamabad and Rawalpindi, Across Pakistan, Worldwide),
a "Get Directions" button and the office map; the address comes from
`js/config.js`.

**Yellow markers.** A few facts are still marked: the support period on
`web-development.html` (two places) and the three review texts on the home
page. Search each file for `todo` and replace the whole
`<mark class="todo">...</mark>` with real text.

**Addresses.** `vercel.json` turns on clean URLs, so the pages open as
`/seo-services`, `/web-development` and `/digital-marketing`. Keep it in the upload.

**FAQ data for Google.** FAQPage structured data is generated from the visible
questions, so editing a question or answer updates it too.

## Home page order (built for leads)

The sections run in the order a buyer decides:

| # | Section | Job |
| --- | --- | --- |
| 1 | Hero | Says what you do; two buttons (WhatsApp call, See Our Work) |
| 2 | Proof strip | Three numbers (7 years, 75+ projects, 15+ industries) and four promises that remove risk |
| 3 | Intro video | A 60 to 90 second founder or team video, three focus points and "Get a Free Website Review" |
| 3b | SEO, Web, Digital Marketing | The three services together, each with a starting price, a website box and a link to its page |
| 4 | What We Offer | Consulting, support, build and scale |
| 5 | Portfolio | Proof: SEO results, campaign results, websites |
| 6 | How It Works | Four steps, then "Get a Free Proposal" |
| 7 | Why Choose Us, Reviews | Reasons and other people's words |
| 8 | Industries, About | Who you work with and who you are |
| 9 | More Services | Nine extra services as compact cards linking to the service pages |
| 10 | FAQ, Contact | Last doubts, then the form |

To move a section, cut its whole block in `index.html` (from its
`<!-- ================= NAME ================= -->` comment to the next one)
and paste it where you want it.

The proof strip (`<div class="proof">`) and the starting prices in the three
service blocks (`feature-card__price`) are plain text in `index.html`. Keep the
prices the same as on the service pages.

**Numbers.** "7 Years of experience", "75+ Projects delivered" and "15+
Industries covered" are in `<ul class="stats">`. They count up once when they
scroll into view. To change one, set both `data-count` (the number the
animation ends on) and the text inside `<strong>`; `data-suffix` holds the
"+". The
same two numbers are also written in the "Where We Work" section of each
service page and in "Why Choose PK IT Sol" on the SEO page (search for
`7 years`). **The Google rating is hidden**: it sits in the same list inside an
HTML comment. When the Google Business Profile has reviews, move that `<li>`
out of the comment and set the real rating.

## Intro video

The section under the numbers (`id="video"` in `index.html`) is ready for a
60 to 90 second founder or team video. Until a video is set it shows the
picture without a play button, so nothing looks broken.

**Add the video**

1. Upload the video to YouTube (Unlisted is fine) and copy its link.
2. In `js/config.js` → `video`, paste the link into `youtube`.
   (Or put an `.mp4` in `assets/video/` and write its path in `file`.)
3. Optional: `caption`, for example `"Ali Khan, Founder of PK IT Sol"`, and
   `poster`, a 1280 x 720 frame from the video. Without a poster the YouTube
   thumbnail is used.
4. Save and upload. The play button appears and the video loads only when it
   is clicked, so the page stays fast.

**Script (about 165 words, 70 to 80 seconds at a natural pace)**

> Hi, I'm [Name] from PK IT Sol.
>
> We help businesses build websites, increase organic visibility and turn
> online traffic into qualified customers.
>
> Whether you're launching a new website, struggling with Google rankings, or
> looking to scale your digital marketing, our approach starts with
> understanding your business first: who your customers are, what you sell, and
> what a good lead looks like for you.
>
> Then we focus on three things.
>
> One, web development: fast websites and online stores that are easy to use
> and easy to update.
>
> Two, SEO and AI search: we get you found on Google, on Maps, and in AI
> answers like ChatGPT.
>
> Three, digital growth: ads, social media and email that bring enquiries, with
> a clear report every month.
>
> We've been doing this for seven years and have delivered more than 75
> projects across more than 15 industries.
>
> If you'd like us to review your website, send us your URL and we'll show you
> where the biggest opportunities are.

End screen: **Get a Free Website Review**.

**Recording tips**

- Do not open with "Welcome to PK IT Sol, we provide digital marketing".
  Start with the name and the sentence about what clients get.
- One person, looking at the camera, in the office. Phone on a tripod at eye
  level, landscape, window light on the face, a clip-on mic if possible.
- Show the three points as on-screen text while they are spoken.
- Keep it under 90 seconds; cut anything that is not in the script.
- Add captions; many people watch without sound.

The text beside the video and the "Get a Free Website Review" box are plain
HTML in the same section. The box sends the visitor to the contact form with
the subject and their website already filled in.

## Measuring leads (analytics)

Set your IDs in `js/config.js` → `analytics` (Google Analytics 4, Meta Pixel or
Google Tag Manager). Nothing loads while they are empty. With an ID set, every
page reports these events by itself:

| Event | When | Meta Pixel event |
| --- | --- | --- |
| `generate_lead` | a form was sent successfully (`form_name` says which) | Lead |
| `click_call` | a phone link was clicked | Contact |
| `click_whatsapp` | a WhatsApp link was clicked | Contact |
| `click_email` | an email link was clicked | Contact |
| `video_play` | the intro video was started | custom event |
| `review_request_start` | the "Free Website Review" box was submitted | custom event |

Mark `generate_lead` as a key event in GA4 and use "Lead" as the conversion in
Meta Ads.

## Privacy policy

`privacy-policy.html` (address `/privacy-policy`) explains in plain language
what the forms collect, which outside services handle it (FormSubmit, Google,
Meta, WordPress.com) and how to ask for deletion. It is linked from the footer
of every page and under each form. Company name, address, email and phone come
from `js/config.js`. Read it once and adjust anything that does not match how
you work; update the "Last updated" line when you change it. It is a
plain-language policy, not a legal review.

## 404 page

`404.html` is shown for any address that does not exist and links back to the
home page and the three services.

## Journey: what a visitor sees on phones and desktops

- **Main menu.** SEO Services, Web Solutions and Digital Marketing open the
  service pages; "All Services" opens the mega menu. The current page is
  highlighted. Once you scroll, the header gets slimmer.
- **Phone menu.** The same services as cards (picture, name, short line).
  Tapping a card opens its sub-services and an "Explore" button, one card at a
  time; below are Home, About Us, Our Work and Contact Us. It is built from
  `services` in `js/config.js`, like the desktop menu.
- **First screen.** On every page the main button is visible without scrolling
  (checked on 18 screen sizes from 360x640 to 2560x1300).
- **Phones: contact bar.** A fixed bar at the bottom has Call, WhatsApp and
  Get a Quote (`<nav class="mobile-bar">`, in every page). It replaces the
  floating buttons on phones.
- **Phones: home service blocks.** Phones have no hover, so the text and the
  website box are always shown and slide in when the block scrolls into view.
  On desktop they still appear on hover. The "Explore ..." button has a moving
  arrow and goes to the service page.
- **Phones and tablets: industries.** The picture panel is on top and all six
  buttons sit underneath in a grid, so a tap changes what is right above it.
- **Phones: portfolio.** The three tabs are one switch on a single line and the
  SEO graph uses the full width of the screen.
- **Phones: "on this page" links** on service pages stay on one swipeable line.

## "All Services" menu (mega menu)

The fourth item in the header opens a panel with the three main services in
the left column. Pointing at one (or moving to it with the keyboard) shows its
description, its sub-services and a large picture on the right. Clicking a main
service, its picture or the "Explore" button opens that service page. On touch
screens the first tap shows the service and the second tap opens its page.

Why hover to preview and click to open: every main service is a normal link,
so one click always reaches the page. The three service pages are also plain
links in the header itself (SEO Services, Web Solutions, Digital Marketing),
which is what search engines follow; the panel is built by script from
`services` in `js/config.js`, so one edit updates every page and the list in
the mobile menu.

| To change | Where in `services` (js/config.js) |
| --- | --- |
| Name, short line or link of a main service | `title`, `tagline`, `url` |
| The two lines above the sub-services | `description` |
| Small picture in the left column | `image` (square, 96 px or larger) |
| Large picture on the right | `feature` (wide, about 880 x 560). Replace the file in `assets/img/menu/` or point at your own photo |
| Rename, add or remove a sub-service | the `items` list of that service |
| Sub-service picture | the item's `image` |
| Make a sub-service a link | add `url: "/seo-services#local-seo"` to the item (none are linked yet) |

The button text "ALL SERVICES" is in the header of each page
(`nav-mega__toggle`), and "All Services" in the mobile menu.

## Reviews (testimonials)

The reviews are in `index.html`. Search for `class="testimonials"`. Each review
is one block that starts with `<li class="carousel__slide">` and ends with
`</li>`:

```html
<li class="carousel__slide"><figure class="testimonial">
  <svg class="icon testimonial__quote"><use href="#i-quote"/></svg>
  <figcaption>
    <span class="testimonial__avatar"><img src="assets/img/reviews/hamza-ali.png" alt="Hamza Ali" ...></span>
    <span><strong>Hamza Ali</strong><span>E-Commerce Store Manager</span></span>
  </figcaption>
  <blockquote>The review text.</blockquote>
</figure></li>
```

The three names, roles and photos are already set (Hamza Ali, Ayesha Khan,
Ali Raza). The photos are saved by `tools/download-images` into
`assets/img/reviews/`; until then they load from the web. **The review text is
not filled in**: each `<blockquote>` holds a yellow note. Paste the client's
own words there, replacing the whole `<mark class="todo">...</mark>`.

| To change | Edit |
| --- | --- |
| Name | the text inside `<strong>` |
| Role and company | the `<span>` right after `</strong>` |
| Review text | the text inside `<blockquote>` |
| Photo | put a square photo (160 px or larger) in `assets/img/reviews/` and set `src` on the `<img>`; you can delete the `data-remote` part |
| Initials instead of a photo | replace the whole `<img ...>` with two letters, for example `AK` |
| The quote mark in the corner | `#i-quote` in `<use href="#i-quote"/>`. Any icon name from the list at the top of `service-template.html` works, e.g. `#i-check`. Delete the whole `<svg ...>` line to remove it |
| Section heading | the `<h2 class="testimonials__title">`; the coloured word is inside `<span>` |
| Add a review | copy one whole `<li class="carousel__slide">...</li>` block and paste it after the last one. The dots update by themselves |
| Remove a review | delete its whole block |
| Sliding speed | `data-autoplay="5000"` on the carousel (milliseconds). Remove the attribute to stop auto-sliding |

Two reviews show side by side on desktop and one on phones. Use real client
reviews only, with the client's permission.

## Mockups that scroll

The Web Solutions mockups ask the screenshot service for a tall capture of each
site (`screenshot` in `js/config.js`, `vph` = captured height). When a
screenshot is taller than its frame it scrolls from top to bottom while the
cursor is on the mockup, and pans slowly by itself on phones. Your own
full-page screenshot (`image: "assets/img/portfolio/site.png"`) scrolls too.

## Indexing and the home address

- Only `index.html` is set to `index, follow`. Every other page is
  `noindex, nofollow` until its content is final.
- The logo and every "Home" link point to `/` (the root of the domain), never
  to `index.html` or `#top`. If someone opens `/index.html`, the address bar
  is rewritten to `/`, and the canonical tag points to the root.
- The canonical tag, `og:url`, the business data in `index.html`, `robots.txt`
  and `sitemap.xml` use `https://pkitsol.com/`. Change them if the site goes
  on a different domain.
- Opened from disk (double-click), `/` links are pointed at `index.html`
  automatically so local preview still works.

## Forms and email

| Form | Where | Fields |
| --- | --- | --- |
| Contact (also used by "Get a Quote Now" and the footer button) | `index.html#contact` | Name, Email, Phone, Subject, Message |
| SEO proposal (pop-up) | `seo-services.html`, `#quote` | Name, Email, Website, Company, Phone, Service, Budget, Comments |
| Web quote (pop-up) | `web-development.html`, `#quote` | Same fields, web budget ranges, website optional |
| Digital marketing proposal (pop-up) | `digital-marketing.html`, `#quote` | Same fields, "Work Email Address" |

The "Send Me a Proposal" boxes on the home page pass the typed website to the
matching service form.

Every form is sent by `js/main.js` to the address in `js/config.js` → `forms`
and arrives by email. The default service is FormSubmit.co (free, no account):

1. Upload the site and open it on the real domain.
2. Send one test message from any form.
3. FormSubmit emails an "Activate Form" link to `pkitsols@gmail.com`. Click it.
4. Send a second test. It should arrive in the inbox (check Spam the first time).

Forms do not send from a page opened by double-click; test on the live site.
To deliver to a different inbox set `forms.to`. To use another service, put
its URL in `forms.endpoint`; the form then posts the same fields as JSON.

To change budget options or add a field, edit the form in that page's HTML.
Give every new `<input>` a `name`; that name becomes the label in the email.

## Images

Run the download script once. It saves the About and What We Offer photos, the
three Why Choose Us photos and the three Search Console graphs into `assets/img`.

- Windows: double-click `tools/download-images.bat`
- macOS / Linux: `bash tools/download-images.sh`

Until the files exist locally, each image loads from its web address
(`data-remote`), and if that also fails it shows the blue placeholder
(`data-placeholder`). Commit the downloaded files so the live site does not
depend on another server.

| Image | Local file | To change it |
| --- | --- | --- |
| About Our Company | `assets/img/about.avif` | Replace the file, or edit `src` in `index.html` |
| What We Offer | `assets/img/offer.jpg` | Same |
| Why Choose Us (3 tabs) | `assets/img/why-1.jpg`, `why-2.jpg`, `why-3.jpg` | Same. Square photos, 800 x 800 or larger |
| SEO graphs | `assets/img/portfolio/*.png` | Listed in `js/config.js` |

The Why Choose Us photos come from Unsplash (free licence, no attribution required).

## Portfolio

Everything in the portfolio is listed in `js/config.js` under `portfolio`.

### Add an SEO project (graph + "Real Result" table)

1. Take the Search Console screenshot and save it in `assets/img/portfolio/`,
   for example `gsc-my-client.png`.
2. In `js/config.js`, copy one block inside `portfolio.seo`, paste it after the
   last block (keep the comma between blocks) and edit it:

```js
{
  title: "My Client",
  link: "https://myclient.com/",
  image: "assets/img/portfolio/gsc-my-client.png",
  rows: [
    { keyword: "best keyword", rank: 1, proof: "https://i.imgur.com/xxxx.png", url: "https://myclient.com/page/" },
    { keyword: "second keyword", rank: 3, proof: "https://i.imgur.com/yyyy.png", url: "https://myclient.com/other/" }
  ]
}
```

`proof` is what opens when a visitor clicks the rank number (a SERP screenshot
uploaded to Imgur, or any link). Leave `rows` out to show only the graph.

### Add a website mockup (Web Solutions tab)

Add one line to `portfolio.web`. The laptop and phone mockups are generated
from the address:

```js
web: [
  { url: "https://zarwa.store/", title: "Zarwa Store" },
  { url: "https://newclient.com/", title: "New Client" }
]
```

Screenshots come from the service set in `screenshot` (default: WordPress.com
mShots, free, no account). The first time a new address is shown the service
needs a few seconds; the page retries by itself. To use your own screenshot
instead, add `image: "assets/img/portfolio/newclient.png"` (and optionally
`mobileImage`). Use `phone: false` to hide the phone.

### Digital Marketing tab (cards + campaign screenshots)

The five cards are listed in `portfolio.marketing`. Each has a "Real Result"
button that opens its screenshots.

1. Take the screenshot (Meta Ads Manager, Google Ads, Mailchimp ...) and hide
   anything the client would not want public.
2. Save it in `assets/img/portfolio/`, for example `result-ppc.png`.
3. In `js/config.js` put the file in that card's `results` list. Several
   screenshots are allowed:

```js
{ title: "PPC Advertising", color: "#155dfc", tilt: 7,
  text: "Google and Meta campaigns with tight targeting and results you can measure.",
  results: ["assets/img/portfolio/result-ppc.png", "assets/img/portfolio/result-ppc-2.png"],
  note: "Lead campaign, 30 days" }
```

Until a file exists the dialog shows a placeholder chart. `results: []` hides
the button on that card. Add or remove cards by adding or removing blocks.

## Add a service page

`seo-services.html`, `web-development.html` and `digital-marketing.html` are
finished pages. `service-template.html` is the same layout with the text
replaced by `[CAPITALS IN BRACKETS]`.

1. Copy `service-template.html` and rename the copy in lowercase with hyphens,
   for example `web-development.html`. Keep it in the same folder as `index.html`.
2. Open the copy and replace every `[...]` placeholder. Search for `[` to find
   them all. The parts, top to bottom:
   - `<title>` and `<meta name="description">`: unique for every page
   - Page hero: breadcrumb name, one `<h1>` with the main keyword, intro
   - What is included: six cards. Change the icon with `<use href="#i-NAME"/>`
     (the list of names is in the comment above the icon sprite). Delete or
     duplicate an `<article class="service-card">` block to change the count
   - How we work: four steps (`<li class="step">`); numbers are added automatically
   - Results: optional. Copy the block from `seo-services.html` for SEO graphs,
     or use `<div class="mockups" data-portfolio="web"></div>` for website mockups
   - Questions: each `faq__item` needs its own `sfaq-1`, `sfaq-2` ... id
   - Quote form at the bottom: change `data-form="..."` to the service name
     (it appears in the email subject) and edit the budget options if needed
3. The page stays `noindex, nofollow` while you work on it. When the content
   is final, change it to `index, follow` and add the page to `sitemap.xml`.
4. Link the page from the home page so visitors and Google can reach it:
   - footer list in `index.html`: `<li><a href="web-development.html">Web Solutions</a></li>`
   - optionally the main nav: change `href="#web"` to `href="web-development.html"`
     (do the same in the other pages' headers)
5. Open the page in a browser, check it on a phone width, then upload it.

Header, footer, floating buttons and contact details are already in the
template and read the brand settings from `js/config.js`. If you change the
header or footer in `index.html` later, repeat the change in each service page.

## Before going live

| Item | Where | What to do |
| --- | --- | --- |
| Images | `tools/download-images` | Run it once and commit the files (see Images). |
| Other artwork | `assets/img/*.svg` | Hero, industries and service-card backgrounds are still illustrations. Replace when you have photos (hero background is set in `css/style.css`, `.hero`). |
| Testimonials | `index.html`, section `.testimonials` | Replace the placeholder reviews with real ones (see Reviews). |
| Social links | `js/config.js` | Add your Facebook, Instagram and LinkedIn URLs. |
| Forms | live site | Send one test message and click the FormSubmit activation link (see Forms and email). |
| Domain | `index.html`, `robots.txt`, `sitemap.xml` | Uses `https://pkitsol.com/`. Change it if the domain is different. |
| Template | `service-template.html` | It is `noindex`; you can leave it out of the upload. |
| Share image | `index.html` `<head>` | `og:image` needs an absolute URL once you know the domain. |

## Interactive parts

| Component | Markup hook | Notes |
| --- | --- | --- |
| Sticky header, mobile menu | `data-header`, `data-nav-toggle` | Closes on link tap, Escape and resize |
| Tabs (industries, portfolio, why us) | `data-tabs` + `role="tab"` | Arrow-key navigation |
| Carousels (SEO projects, testimonials) | `data-carousel` | Swipe, arrows, dots, optional `data-autoplay="5000"`; slides per view set by `--per-view` in CSS |
| Service cards with proposal form | `data-feature-card`, `data-proposal` | Hover on desktop, tap on touch; submitting pre-fills the contact form |
| SEO result panel | `data-result-dialog` | Opens from "Real Result"; rank numbers link to proof |
| Website mockups | `data-portfolio="web"` | Built from URLs in `config.js` |
| FAQ accordion | `data-accordion` | One item open at a time |
| Scroll reveal | `data-reveal="left"` or `"up"` | Skipped when the visitor prefers reduced motion |

## Browser support

Current Chrome, Edge, Firefox and Safari (desktop and mobile).
