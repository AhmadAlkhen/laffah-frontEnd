export default [
    {
      title: 'Laffah Branch',
      icon: { icon: 'tabler-smart-home' },
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
    {
      title: 'Order products ',
      icon: { icon: 'tabler-eye' },
      to: 'laffah-orders-products',
      action: "read",
      subject: "Auth",
    },
    {
      title: 'Cart',
      icon: { icon: 'tabler-file' },
      to: 'laffah-orders-cart',
      action: "read",
      subject: "Auth",
    },

  ]
  