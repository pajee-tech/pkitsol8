/**
 * Brand settings
 * ---------------------------------------------------------------------------
 * Every brand detail on the page is filled in from this object by js/main.js:
 *   text  -> elements marked  data-brand="name | phone | email | address | tagline"
 *   links -> elements marked  data-brand-link="phone | email | whatsapp | facebook | instagram | linkedin"
 *   map   -> the iframe marked data-brand-map
 *   portfolio -> the SEO slides, result tables, marketing cards and website mockups
 *   forms     -> where form submissions are emailed
 * To rebrand the site, edit the values below. Nothing else needs to change.
 * (index.html also carries the same values as plain text so the page still
 *  reads correctly for search engines and with JavaScript turned off.)
 */
window.SITE_CONFIG = {
  name: "PK IT SOLUTIONS",
  tagline: "Your Digital Partner",

  phone: "+923006540558",          // used for tel: links and shown as text
  whatsapp: "+923006540558",       // WhatsApp number (any format; digits are extracted)
  whatsappMessage: "Hello, I would like to book a strategy call.",   // pre-filled chat text, optional

  email: "pkitsols@gmail.com",

  address: "Plaza Number 55, Office Number 505 5th Floor, Civic Center Bahria Town Phase 4 Bahria Town, Islamabad, 44000",
  // Search text for the Google Maps embed. Leave empty to use the address above.
  mapQuery: "Plaza Number 55, Civic Center, Bahria Town Phase 4, Islamabad 44000",

  // Social profiles. An icon is hidden automatically while its URL is empty.
  social: {
    facebook: "",
    instagram: "",
    linkedin: ""
  },

  /* ------------------------------------------------------------------------
     INTRO VIDEO (home page, under the numbers)
     ------------------------------------------------------------------------
     Record a 60 to 90 second founder or team video (script: see README, "Intro video").
       youtube  the YouTube link or video ID, e.g. "https://youtu.be/abc123XYZ00"
       file     or a video file you upload, e.g. "assets/video/intro.mp4" (use one of the two)
       poster   picture shown before play. Leave as it is to use the built-in picture,
                or point it at a frame from your video (1280 x 720)
       caption  short line over the picture, e.g. "Ali Khan, Founder of PK IT Sol"
     While both "youtube" and "file" are empty, the section shows the picture
     without a play button. */
  video: {
    youtube: "",
    file: "",
    poster: "assets/img/video-poster.svg",
    caption: ""
  },

  /* ------------------------------------------------------------------------
     ANALYTICS (optional)
     ------------------------------------------------------------------------
     Paste an ID and that tool starts on every page. Leave empty to load nothing.
       ga4        Google Analytics 4 measurement ID, like "G-XXXXXXXXXX"
       metaPixel  Meta (Facebook) Pixel ID, numbers only
       gtm        Google Tag Manager container, like "GTM-XXXXXXX" (use this OR the two above)
     Events sent automatically:
       generate_lead   a form was sent successfully (Meta Pixel: "Lead")
       click_call, click_whatsapp, click_email   (Meta Pixel: "Contact")
       video_play, review_request_start          (the intro video and the review box) */
  analytics: {
    ga4: "",
    metaPixel: "",
    gtm: ""
  },

  /* ------------------------------------------------------------------------
     FORMS  (Contact / Get a Quote on the home page + one form per service page)
     ------------------------------------------------------------------------
     Every form sends its fields to "endpoint" and the message arrives by email.
     Default: FormSubmit.co (free, no account). {email} is replaced by "to",
     or by the email above when "to" is empty.
       1. Upload the site, open it on the real domain and send one test message.
       2. FormSubmit emails an "Activate Form" link to that address. Click it once.
       3. From then on every submission is delivered to the inbox.
     Forms do NOT send from a page opened by double-click (file://); test online.
     To use another service (Formspree, Web3Forms, your own API) put its URL here. */
  forms: {
    endpoint: "https://formsubmit.co/ajax/{email}",
    to: ""
  },

  /* ------------------------------------------------------------------------
     PORTFOLIO
     ------------------------------------------------------------------------ */
  portfolio: {

    /* SEO tab. One block per project.
         title   project name shown under the graph
         link    client website ("PROJECT: VISIT WEBSITE" in the result panel)
         image   Search Console screenshot. Put the file in assets/img/portfolio/
         remote  optional web address of the same image, used only while the
                 local file is missing
         rows    the "Real Result" table: keyword, rank, proof (screenshot or
                 page that opens when the rank number is clicked), url (ranked page)
       To add a project: copy one block, paste it after the last one, edit it. */
    seo: [
            {
        title: "Khanabdosh Glamps",
        link: "https://khanabadosh.pk/",
        image: "assets/img/portfolio/GSC - Khanabadosh.png",
        remote: "https://techwiz-solution.vercel.app/Graph.png",
        rows: [
          { keyword: "Khanabadosh Glamps", rank: 1,  proof: "", url: "https://khanabadosh.pk/" },
          { keyword: "Khanabadosh Glamps Murree",    rank: 1,  proof: "", url: "https://khanabadosh.pk/" },
          { keyword: "Khanabadosh Glamps Kumrat",         rank: 1, proof: "", url: "https://khanabadosh.pk/" },
          { keyword: "Kumrat Glamps",       rank: 1, proof: "", url: "https://khanabadosh.pk/" },
          { keyword: "Murree Glamps",        rank: 1, proof: "", url: "https://khanabadosh.pk/" },
          { keyword: "Khanabadosh Resort Kumrat", rank: 1, proof: "", url: "https://khanabadosh.pk/" },
          { keyword: "Khanabadosh Huts Murree",   rank: 1, proof: "", url: "https://khanabadosh.pk/" },
          { keyword: "Khanabadosh Pods",         rank: 1, proof: "", url: "https://khanabadosh.pk/" },
          { keyword: "Khanabadosh Hotel Kumrat",      rank: 1, proof: "", url: "https://khanabadosh.pk/" },
          { keyword: "Luxury Glamps",        rank: 1, proof: "", url: "https://khanabadosh.pk/" }
        ]
      },
      {
        title: "Rosa Clothing & Apparel Store",
        link: "https://rosastores.com/",
        image: "assets/img/portfolio/GSC - Rosa Stores.png",
        remote: "https://techwiz-solution.vercel.app/Graph.png",
        rows: [
          { keyword: "Rosa Boutique", rank: 1,  proof: "", url: "https://rosastores.com/" },
          { keyword: "Rosa Outfits",    rank: 1,  proof: "", url: "https://rosastores.com/" },
          { keyword: "Rosa Clothing Dress",         rank: 1, proof: "", url: "https://rosastores.com/" },
          { keyword: "Rosa Wear",       rank: 1, proof: "", url: "https://rosastores.com/" },
          { keyword: "Rosa Collection",        rank: 1, proof: "", url: "https://rosastores.com/" },
          { keyword: "Rosa Fashion Store", rank: 1, proof: "", url: "https://rosastores.com/" },
          { keyword: "Rosa Clothing Store",   rank: 1, proof: "", url: "https://rosastores.com/" },
          { keyword: "Rosa Clothes",         rank: 1, proof: "", url: "https://rosastores.com/" },
          { keyword: "Rosa 2 Piece Dress",      rank: 1, proof: "", url: "https://rosastores.com/" },
          { keyword: "Rosa 3 Piece Suit",        rank: 1, proof: "", url: "https://rosastores.com/" }
        ]
      },
      {
        title: "Two Guys",
        link: "https://www.twoguys.ae/",
        image: "assets/img/portfolio/gsc-two-guys.png",
        remote: "https://techwiz-solution.vercel.app/Graph.png",
        rows: [
          { keyword: "Sintered Stone Flooring", rank: 1,  proof: "https://i.imgur.com/lSY8kcm.png", url: "https://www.twoguys.ae/floors/sintered-stone/" },
          { keyword: "Linen Curtains Dubai",    rank: 1,  proof: "https://i.imgur.com/KGWiNyR.png", url: "https://www.twoguys.ae/curtains/linen-curtains/" },
          { keyword: "Home Furnishing",         rank: 2, proof: "https://i.imgur.com/U9shyx0.png", url: "https://www.twoguys.ae/" },
          { keyword: "Shutters in Dubai",       rank: 2, proof: "https://i.imgur.com/jlHLRTG.png", url: "https://www.twoguys.ae/shutters/" },
          { keyword: "LVT Flooring UAE",        rank: 3, proof: "https://i.imgur.com/OHxbZeg.png", url: "https://www.twoguys.ae/floors/lvt/" },
          { keyword: "Blackout Curtains Dubai", rank: 3, proof: "https://i.imgur.com/7NfGVdP.png", url: "https://www.twoguys.ae/curtains/blackout-curtains/" },
          { keyword: "Window Curtains Dubai",   rank: 3, proof: "https://www.twoguys.ae/curtains/", url: "https://www.twoguys.ae/curtains/" },
          { keyword: "Blinds in dubai",         rank: 4, proof: "https://i.imgur.com/DCjFJTz.png", url: "https://www.twoguys.ae/blinds/" },
          { keyword: "SPC Flooring Dubai",      rank: 4, proof: "https://i.imgur.com/o97DbQq.png", url: "https://www.twoguys.ae/floors/spc/" },
          { keyword: "Wall Decor Dubai",        rank: 4, proof: "https://i.imgur.com/JGhNT7f.png", url: "https://www.twoguys.ae/furniture/bedroom/" }
        ]
      },
      {
        title: "BnC",
        link: "https://blindsandcurtains.ae/",
        image: "assets/img/portfolio/gsc-bnc.png",
        remote: "https://techwiz-solution.vercel.app/blindgraph.png",
        rows: [
          { keyword: "Dubai Curtains and Blinds", rank: 1, proof: "https://i.imgur.com/4lIsfVU.png", url: "https://blindsandcurtains.ae/" },
          { keyword: "Motorised Curtains",        rank: 1, proof: "https://i.imgur.com/V6rRZiZ.png", url: "https://blindsandcurtains.ae/curtains/motorised-curtains/" },
          { keyword: "Dubai Blinds",              rank: 1, proof: "https://i.imgur.com/RVglZtR.png", url: "https://blindsandcurtains.ae/" },
          { keyword: "Conservatory Blinds",       rank: 1, proof: "https://i.imgur.com/U4WS8xk.png", url: "https://blindsandcurtains.ae/blinds/conservatory-blinds/" },
          { keyword: "Full Height Shutters",      rank: 1, proof: "https://i.imgur.com/B8sgbJJ.png", url: "https://blindsandcurtains.ae/shutters-range/full-heig/" },
          { keyword: "Office Curtains",           rank: 1, proof: "https://i.imgur.com/jIs6iFO.png", url: "https://blindsandcurtains.ae/curtains/office-window-curtains/" },
          { keyword: "Duplex Blinds Dubai",       rank: 1, proof: "https://i.imgur.com/T4FG9Wc.png", url: "https://blindsandcurtains.ae/blinds/duplex-blinds/" },
          { keyword: "Outdoor Blinds Dubai",      rank: 1, proof: "https://blindsandcurtains.ae/balcony-blinds-and-curtains/", url: "https://blindsandcurtains.ae/balcony-blinds-and-curtains/" },
          { keyword: "Motorised Curtains",        rank: 1, proof: "https://i.imgur.com/QygFSUg.png", url: "https://blindsandcurtains.ae/curtains/motorised-curtains/" },
          { keyword: "Blackout Roller Blinds",    rank: 1, proof: "https://i.imgur.com/D33DhGo.png", url: "https://blindsandcurtains.ae/blinds/roller-blinds/blackout-roller-blinds/" }
        ]
      },
      {
        title: "Interior Films Dubai",
        link: "https://interiorfilm.ae/",
        image: "assets/img/portfolio/gsc-interior-films.png",
        remote: "https://techwiz-solution.vercel.app/interiorgraph.png",
        rows: [
          { keyword: "Interior Vinyl Film",       rank: 1, proof: "https://interiorfilm.ae/", url: "https://interiorfilm.ae/" },
          { keyword: "Pure Gold Vinyl",           rank: 1, proof: "https://i.imgur.com/9RL1AFb.png", url: "https://interiorfilm.ae/products?category=cement-grey-series" },
          { keyword: "Cement Grey Vinyl",         rank: 1, proof: "https://interiorfilm.ae/products?category=cement-grey-series", url: "https://interiorfilm.ae/products?category=cement-grey-series" },
          { keyword: "Offwhite Fabric Vinyl",     rank: 1, proof: "https://i.imgur.com/lWinmSJ.png", url: "https://interiorfilm.ae/product/offwhite-fabric-vinyl" },
          { keyword: "White Vinyl Film",          rank: 1, proof: "https://i.imgur.com/PCLnfCd.png", url: "https://interiorfilm.ae/product/pure-white-vinyl-film" },
          { keyword: "Interior Film Accessories", rank: 1, proof: "https://i.imgur.com/M5TL6qz.png", url: "https://interiorfilm.ae/" },
          { keyword: "wood vinyl wrap",           rank: 1, proof: "https://i.imgur.com/WRa05ZP.png", url: "https://interiorfilm.ae/products?category=wood-grain-series" },
          { keyword: "Grey Wood Vinyl",           rank: 1, proof: "https://i.imgur.com/uPqLixN.png", url: "https://interiorfilm.ae/product/grey-wood-vinyl" },
          { keyword: "Metallic Vinyl",            rank: 1, proof: "https://i.imgur.com/rptamdb.png", url: "https://interiorfilm.ae/product/metallic-silver-vinyl" },
          { keyword: "Marble Wrap",               rank: 1, proof: "https://i.imgur.com/yQcwRM8.png", url: "https://interiorfilm.ae/product/grey-marble-vinyl-wrap" }
        ]
      }
    ],

    /* Digital Marketing tab. One block per card.
         title    card heading
         text     one or two lines under the heading
         color    card colour
         tilt     how far the card leans, in degrees (negative = left)
         results  campaign screenshots shown when "Real Result" is clicked
                  (Ads Manager, Google Ads, Mailchimp ...). Save them in
                  assets/img/portfolio/ and list one or more here. A card with
                  an empty list  results: []  shows no button.
         note     optional line shown above the screenshots */
    marketing: [
      { title: "Origo Forlag AS (Norway)",       color: "#00AD5C", tilt: -8,
        text: "We successfully managed a strategic Facebook video campaign that delivered over 17K views and triggered an impressive 202.9% spike in audience engagement.",
        results: ["assets/img/portfolio/Origo Forlag As Performance.jpeg"], note: ""  },
      { title: "Latitude Resorts (Pakistan)",        color: "#F6AF03", tilt: -6,
        text: "Our targeted Facebook video ads drove substantial brand exposure, securing more than 2.6 million ad views along with a 66.8% increase in 3-second views.",
        results: ["assets/img/portfolio/Latitude Resorts Performance.jpeg"], note: "" },
      { title: "Baby Magasinet (Norway)", color: "#E22726", tilt: 3,
        text: "Through a high-performing Facebook video ad strategy, we accelerated overall audience reach by 27.4% and generated over 1.9 million total views.",
        results: ["assets/img/portfolio/Babymagasinet Performance.jpeg"], note: "" },
        { title: "Infinity Resorts (Pakistan",      color: "#CF9E00", tilt: -4,
        text: "We optimized a dedicated Facebook video campaign that scaled platform visibility, yielding 1.5 million ad views and boosting total watch time by 555.7%",
        results: ["assets/img/portfolio/Infinity Resorts Performance.jpeg"], note: "" },
            { title: "Rosa Clothing & Apparel Store (Pakistan)",        color: "#212121", tilt: 7,
        text: "Our custom Facebook video ad setup catalyzed significant growth for the storefront, bringing in over 5.9K total views and driving a massive 2.6K% traffic increase.",
        results: ["assets/img/portfolio/Rosa Stores Performance.jpeg"], note: "" }
    ],

    /* Web Solutions tab. Add a website address and the page builds a laptop +
       phone mockup of it automatically (see "screenshot" below).
         url          the live website (required)
         title        name shown under the mockup (optional; the domain is used if empty)
         image        optional: your own desktop screenshot instead of the automatic one
                      (a full-page screenshot scrolls on hover)
         mobileImage  optional: your own phone screenshot
         phone        set to false to hide the phone mockup */
    web: [
      { url: "https://homyn.org/",           title: "Homyn Events" },
      { url: "https://khanabadosh.pk/",      title: "Khanabadosh Glamps" },
      { url: "https://rosastores.pk/",       title: "Rosa Lifestyle Hub" },
      { url: "https://apex.no/",             title: "Apex Sportsernæring" }
    ]
  },

  /* Service that turns a URL into a screenshot for the mockups above.
     {url} is replaced with the encoded website address. The default is the free
     WordPress.com mShots service (no account needed; the first view of a new
     site can take a few seconds while the screenshot is made).
     Another option: "https://image.thum.io/get/width/1280/crop/800/{rawurl}" */
  screenshot: {
    // Tall captures (vph = how much of the page is captured, in pixels) so the
    // mockup can scroll through the page when the cursor is on it.
    desktop: "https://s.wordpress.com/mshots/v1/{url}?w=1280&vpw=1280&vph=3200",
    mobile:  "https://s.wordpress.com/mshots/v1/{url}?w=390&vpw=390&vph=2400"
  },

  /* ------------------------------------------------------------------------
     ALL SERVICES MENU (the drop-down in the header, on every page)
     ------------------------------------------------------------------------
     One block per main service:
       title, tagline   shown at the top of the column
       url              page the main service links to
       image            small picture beside the title (left column)
       feature          large picture shown on the right when this service is
                        pointed at. Use a wide image, about 880 x 560
       description      two lines shown above the sub-services
       items            sub-services listed underneath: title + image.
                        Add  url: "/seo-services#local-seo"  to an item to make
                        it a link; without url it is shown as plain text.
     Pictures live in assets/img/menu/. Replace a file (same name) or point
     "image" at your own square picture. */
  services: [
    {
      title: "SEO Services",
      tagline: "Rank on Google, Maps and AI search",
      url: "/seo-services",
      image: "assets/img/menu/seo.svg",
      feature: "assets/img/menu/feature-seo.svg",
      description: "Get found on Google Search, Google Maps and in AI answers. We fix what holds your site back, then build the content and links that bring enquiries every month.",
      items: [
        {
          title: "SEO Audit",
          image: "assets/img/menu/seo-seo-audit.svg"
        },
        {
          title: "Technical SEO",
          image: "assets/img/menu/seo-technical-seo.svg"
        },
        {
          title: "On-Page and Off-Page SEO",
          image: "assets/img/menu/seo-on-page-off-page.svg"
        },
        {
          title: "Local SEO",
          image: "assets/img/menu/seo-local-seo.svg"
        },
        {
          title: "Ecommerce SEO",
          image: "assets/img/menu/seo-ecommerce-seo.svg"
        },
        {
          title: "AEO and GEO",
          image: "assets/img/menu/seo-aeo-geo.svg"
        },
        {
          title: "Link Building",
          image: "assets/img/menu/seo-link-building.svg"
        }
      ]
    },
    {
      title: "Web Development",
      tagline: "Fast, SEO-ready websites and stores",
      url: "/web-development",
      image: "assets/img/menu/web.svg",
      feature: "assets/img/menu/feature-web.svg",
      description: "WordPress, Shopify, e-commerce and custom websites that load fast, work on every phone and stay in your name after launch.",
      items: [
        {
          title: "WordPress Websites",
          image: "assets/img/menu/web-wordpress.svg"
        },
        {
          title: "Ecommerce Stores",
          image: "assets/img/menu/web-ecommerce.svg"
        },
        {
          title: "Shopify Stores",
          image: "assets/img/menu/web-shopify.svg"
        },
        {
          title: "Custom Web Development",
          image: "assets/img/menu/web-custom-development.svg"
        },
        {
          title: "UI / UX Design",
          image: "assets/img/menu/web-ui-ux.svg"
        },
        {
          title: "AI Chatbots and Automation",
          image: "assets/img/menu/web-ai-automation.svg"
        }
      ]
    },
    {
      title: "Digital Marketing",
      tagline: "Ads, social media and email that bring leads",
      url: "/digital-marketing",
      image: "assets/img/menu/marketing.svg",
      feature: "assets/img/menu/feature-marketing.svg",
      description: "Meta ads, Google Ads, social media, email and content, planned around your budget and reported every month.",
      items: [
        {
          title: "Social Media Ads",
          image: "assets/img/menu/marketing-social-media-ads.svg"
        },
        {
          title: "Google Ads and PPC",
          image: "assets/img/menu/marketing-google-ads.svg"
        },
        {
          title: "Social Media Management",
          image: "assets/img/menu/marketing-social-media-management.svg"
        },
        {
          title: "Content Marketing",
          image: "assets/img/menu/marketing-content-marketing.svg"
        },
        {
          title: "Email Marketing",
          image: "assets/img/menu/marketing-email-marketing.svg"
        },
        {
          title: "Remarketing",
          image: "assets/img/menu/marketing-remarketing.svg"
        },
        {
          title: "Influencer Marketing",
          image: "assets/img/menu/marketing-influencer-marketing.svg"
        },
        {
          title: "Video Marketing",
          image: "assets/img/menu/marketing-video-marketing.svg"
        }
      ]
    }
  ]

};
