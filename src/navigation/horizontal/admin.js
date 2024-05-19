export default [
  // { heading: 'Laffah' },
  {
    title: 'Safaqatii Admin',
    icon: { icon: 'tabler-smart-home' },
    to: {name:'dashboard'},

    action: "read",
    subject: "Auth",
  },
  {
    title: 'Branches',
    icon: { icon: 'tabler-lifebuoy' },
    to: {name:'laffah-branches-list'},
    action: "read",
    subject: "Auth",
  },
  {
    title: 'Users',
    icon: { icon: 'tabler-user' },
    to: {name:'laffah-users-list'},
    action: "read",
    subject: "Auth",
  },
  {
    title: 'Suppliers',
    icon: { icon: 'tabler-affiliate' },
    to: {name:'laffah-suppliers-list'},
    action: "read",
    subject: "Auth",
  },
  {
    title: 'Categories',
    icon: { icon: 'tabler-lifebuoy' },
    to: {name:'laffah-categories-list'},
    action: "read",
    subject: "Auth",
  },
  {
    title: 'Products',
    icon: { icon: 'tabler-archive' },
    children: [
    {
    title: 'All products',
    to: 'laffah-products-list',
    action: "read",
    subject: "Auth", 
    },
    {
    title: 'Upload images',
    to: 'laffah-products-files',
    action: "read",
    subject: "Auth", 
    },
    { title: 'products', to: 'laffah-materials-filter-List',
    action: "read",
    subject: "Auth",
    },

    ],
    
  },
  // {
  //   title: 'Templates',
  //   icon: { icon: 'tabler-air-balloon' },
  //   children: [
  //   {
  //   title: 'All Templates',
  //   to: 'laffah-orders-templates',
  //   action: "read",
  //   subject: "Auth", 
  //   },
  //   { title: 'Add template', to: 'laffah-orders-Template',
  //   action: "read",
  //   subject: "Auth",
  //   },

  //   ],
  // },
  {
    title: 'Orders',
    icon: { icon: 'tabler-chart-donut' },
    to: 'laffah-orders-MyOrders',
    action: "read",
    subject: "Auth",
  },
  {
    title: 'Order products',
    icon: { icon: 'tabler-eye' },
    to: 'laffah-orders-products',
    action: "read",
    subject: "Auth",
  },
  {
    title: 'Print Orders',
    icon: { icon: 'tabler-files' },
    to: 'laffah-orders-print',
    action: "read",
    subject: "Auth",
  },
  {
    title: 'Generate',
    icon: { icon: 'tabler-report-analytics' },
    to: 'laffah-orders-generate',
    action: "read",
    subject: "Auth",
  },
  // {
  //   title: 'Cart',
  //   icon: { icon: 'tabler-file' },
  //   to: 'laffah-orders-cart',
  //   action: "read",
  //   subject: "Auth",
  // },
]
