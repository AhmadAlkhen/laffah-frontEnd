export default [
    // { heading: 'Laffah' },
    {
      title: 'Laffah warehouse',
      icon: { icon: 'tabler-smart-home' },
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
    {
      title: 'Orders',
      icon: { icon: 'tabler-chart-donut' },
      to: 'laffah-orders-MyOrders',
      action: "read",
      subject: "Auth",
    },
    {
      title: 'Order products ',
      icon: { icon: 'tabler-eye' },
      to: 'laffah-orders-products',
      action: "read",
      subject: "Auth",
    },

  ]
  