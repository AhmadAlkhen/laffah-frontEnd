export default [
    // { heading: 'Laffah' },
    {
      title: 'Laffah Admin',
      icon: { icon: 'tabler-smart-home' },
      
    },
    {
      title: 'Branches',
      icon: { icon: 'tabler-lifebuoy' },
      to: {name:'laffah-branches-list'},
      
    },
    {
      title: 'Users',
      icon: { icon: 'tabler-user' },
      to: {name:'laffah-users-list'},
      
    },
    {
      title: 'Categories',
      icon: { icon: 'tabler-lifebuoy' },
      to: {name:'laffah-categories-list'},
      
    },
    {
      title: 'Products',
      icon: { icon: 'tabler-archive' },
      children: [
        { title: 'All products', to: 'laffah-products-list' },
        { title: 'products', to: 'laffah-materials-filter-List' },

      ],
      
    },
    {
      title: 'Orders',
      icon: { icon: 'tabler-chart-donut' },
      to: 'laffah-orders-MyOrders',
      
    },
    {
      title: 'Order products ',
      icon: { icon: 'tabler-eye' },
      to: 'laffah-orders-products',
      
    },
    {
      title: 'Cart',
      icon: { icon: 'tabler-file' },
      to: 'laffah-orders-cart',
    },
  ]
  