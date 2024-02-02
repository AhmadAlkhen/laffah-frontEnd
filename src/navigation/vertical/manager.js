export default [
    {
      title: 'Safaqatii Manager',
      icon: { icon: 'tabler-smart-home' },
      to: {name:'dashboard'},
      action: "read",
      subject: "Auth",
    },
    {
      title: 'Products',
      icon: { icon: 'tabler-archive' },
      to: {name:'laffah-materials-filter-List'},
      action: "read",
      subject: "Auth",
    },
    {
      title: 'Orders',
      icon: { icon: 'tabler-chart-donut' },
      to: 'laffah-orders-MyOrders',
      action: "read",
      subject: "Auth",
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
      title: 'Order products ',
      icon: { icon: 'tabler-eye' },
      to: 'laffah-orders-products',
      action: "read",
      subject: "Auth",
    },


  ]
  