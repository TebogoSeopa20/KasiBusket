import { User, Owner, SpazaShop, Product, DeliveryDriver, Combo } from '../types';

export function initializeData() {
  const users: User[] = [
    {
      username: 'john65',
      password: 'password123',
      fullName: 'John Mabena',
      address: '123 Vilakazi Street, Soweto',
      phoneNumber: '+27 11 111 1111',
      email: 'john65@example.com',
      isSenior: true,
      hasDisability: false,
      idNumber: '5905125800083',
      preferredLanguage: 'English',
      registeredAt: new Date('2023-01-01'),
      accountActive: true,
      role: 'customer'
    },
    {
      username: 'sarah55',
      password: 'password123',
      fullName: 'Sarah Khumalo',
      address: '45 Alexandra Road',
      phoneNumber: '+27 11 222 2222',
      email: 'sarah55@example.com',
      isSenior: true,
      hasDisability: true,
      idNumber: '6802156700089',
      preferredLanguage: 'isiZulu',
      registeredAt: new Date('2023-02-15'),
      accountActive: true,
      role: 'customer'
    },
    {
      username: 'mike30',
      password: 'password123',
      fullName: 'Mike van Wyk',
      address: '78 Khayelitsha Avenue',
      phoneNumber: '+27 21 333 3333',
      email: 'mike30@example.com',
      isSenior: false,
      hasDisability: false,
      idNumber: '9403127800084',
      preferredLanguage: 'Afrikaans',
      registeredAt: new Date('2023-03-12'),
      accountActive: true,
      role: 'customer'
    },
    {
      username: 'disabled_user',
      password: 'password123',
      fullName: 'David Johnson',
      address: '56 Disability Lane',
      phoneNumber: '+27 11 444 4444',
      email: 'david@example.com',
      isSenior: false,
      hasDisability: true,
      idNumber: '8506145700086',
      preferredLanguage: 'English',
      registeredAt: new Date('2023-05-20'),
      accountActive: true,
      role: 'customer'
    },
    {
      username: 'thandi_xh',
      password: 'password123',
      fullName: 'Thandi Makeba',
      address: '12 Nelson Mandela Boulevard, Port Elizabeth',
      phoneNumber: '+27 41 555 5555',
      email: 'thandi@example.com',
      isSenior: false,
      hasDisability: false,
      idNumber: '8907122800087',
      preferredLanguage: 'isiXhosa',
      registeredAt: new Date('2023-06-10'),
      accountActive: true,
      role: 'customer'
    }
  ];

  const owners: Owner[] = [
    {
      username: 'lydia_shop',
      password: 'owner123',
      fullName: 'Lydia Mbeki',
      shopName: "Mama Lydia's Spaza",
      phoneNumber: '+27 11 123 4567',
      email: 'lydia@spazaeats.co.za',
      idNumber: '6503124800082',
      preferredLanguage: 'Sepedi',
      ownedShops: ['SHOP001', 'SHOP002'],
      registeredAt: new Date('2022-10-15'),
      accountActive: true,
      role: 'owner'
    },
    {
      username: 'devrift_shop',
      password: 'owner123',
      fullName: 'DevRift Admin',
      shopName: "DevRift's Spaza Shop",
      phoneNumber: '+27 11 999 8888',
      email: 'devrift@spazaeats.co.za',
      idNumber: '8505129800090',
      preferredLanguage: 'English',
      ownedShops: ['SHOP_DEVRIFT'],
      registeredAt: new Date('2023-01-01'),
      accountActive: true,
      role: 'owner'
    },
    {
      username: 'thomas_shop',
      password: 'owner123',
      fullName: 'Thomas Nkosi',
      shopName: 'Alex Corner Store',
      phoneNumber: '+27 11 234 5678',
      email: 'thomas@spazaeats.co.za',
      idNumber: '7208135800081',
      preferredLanguage: 'English',
      ownedShops: ['SHOP003'],
      registeredAt: new Date('2022-12-20'),
      accountActive: true,
      role: 'owner'
    },
    {
      username: 'nomsa_shop',
      password: 'owner123',
      fullName: 'Nomsa Dlamini',
      shopName: 'Khayelitsha Fresh',
      phoneNumber: '+27 21 345 6789',
      email: 'nomsa@spazaeats.co.za',
      idNumber: '7511144800085',
      preferredLanguage: 'isiXhosa',
      ownedShops: ['SHOP004'],
      registeredAt: new Date('2023-04-10'),
      accountActive: true,
      role: 'owner'
    },
    {
      username: 'multi_owner',
      password: 'owner123',
      fullName: 'James Mokoena',
      shopName: 'Mokoena Retail Group',
      phoneNumber: '+27 12 678 9012',
      email: 'james@spazaeats.co.za',
      idNumber: '7903148800088',
      preferredLanguage: 'Setswana',
      ownedShops: ['SHOP005', 'SHOP006', 'SHOP007'],
      registeredAt: new Date('2023-05-15'),
      accountActive: true,
      role: 'owner'
    }
  ];

  const shops: SpazaShop[] = [
    // Gauteng Province
    {
      shopId: 'SHOP001',
      shopName: "Mama Lydia's Spaza",
      ownerName: 'Lydia Mbeki',
      ownerUsername: 'lydia_shop',
      location: 'Soweto',
      province: 'Gauteng',
      address: '123 Vilakazi Street, Orlando West',
      phoneNumber: '+27 11 123 4567',
      operatingHours: '6:00 AM - 8:00 PM',
      openingTime: '06:00',
      closingTime: '20:00',
      latitude: -26.2356,
      longitude: 27.9076,
      isOpen: true,
      offersCredit: true,
      disabilityFriendly: true
    },
    {
      shopId: 'SHOP002',
      shopName: "Lydia's Second Branch",
      ownerName: 'Lydia Mbeki',
      ownerUsername: 'lydia_shop',
      location: 'Diepsloot',
      province: 'Gauteng',
      address: '45 Main Road, Diepsloot',
      phoneNumber: '+27 11 123 4568',
      operatingHours: '7:00 AM - 7:00 PM',
      openingTime: '07:00',
      closingTime: '19:00',
      latitude: -25.9341,
      longitude: 28.0169,
      isOpen: true,
      offersCredit: true,
      disabilityFriendly: true
    },
    {
      shopId: 'SHOP003',
      shopName: 'Alex Corner Store',
      ownerName: 'Thomas Nkosi',
      ownerUsername: 'thomas_shop',
      location: 'Alexandra',
      province: 'Gauteng',
      address: '45 8th Avenue, Alexandra',
      phoneNumber: '+27 11 234 5678',
      operatingHours: '5:30 AM - 9:00 PM',
      openingTime: '05:30',
      closingTime: '21:00',
      latitude: -26.1048,
      longitude: 28.0914,
      isOpen: true,
      offersCredit: true,
      disabilityFriendly: false
    },
    {
      shopId: 'SHOP_DEVRIFT',
      shopName: "DevRift's Spaza Shop",
      ownerName: 'DevRift Admin',
      ownerUsername: 'devrift_shop',
      location: 'Sandton',
      province: 'Gauteng',
      address: '100 Rivonia Road, Sandton City',
      phoneNumber: '+27 11 999 8888',
      operatingHours: '6:00 AM - 10:00 PM',
      openingTime: '06:00',
      closingTime: '22:00',
      latitude: -26.1076,
      longitude: 28.0567,
      isOpen: true,
      offersCredit: true,
      disabilityFriendly: true
    },
    // Western Cape Province
    {
      shopId: 'SHOP004',
      shopName: 'Khayelitsha Fresh',
      ownerName: 'Nomsa Dlamini',
      ownerUsername: 'nomsa_shop',
      location: 'Khayelitsha',
      province: 'Western Cape',
      address: '78 Msobomvu Road, Site B',
      phoneNumber: '+27 21 345 6789',
      operatingHours: '6:00 AM - 7:30 PM',
      openingTime: '06:00',
      closingTime: '19:30',
      latitude: -34.039,
      longitude: 18.642,
      isOpen: true,
      offersCredit: false,
      disabilityFriendly: true
    },
    {
      shopId: 'SHOP005',
      shopName: 'Mokoena Market - Cape Town',
      ownerName: 'James Mokoena',
      ownerUsername: 'multi_owner',
      location: 'Mitchell\'s Plain',
      province: 'Western Cape',
      address: '23 AZ Berman Drive, Mitchell\'s Plain',
      phoneNumber: '+27 21 456 7890',
      operatingHours: '6:30 AM - 8:00 PM',
      openingTime: '06:30',
      closingTime: '20:00',
      latitude: -34.0526,
      longitude: 18.6298,
      isOpen: true,
      offersCredit: true,
      disabilityFriendly: true
    },
    // KwaZulu-Natal Province
    {
      shopId: 'SHOP006',
      shopName: 'Mokoena Market - Durban',
      ownerName: 'James Mokoena',
      ownerUsername: 'multi_owner',
      location: 'Umlazi',
      province: 'KwaZulu-Natal',
      address: '123 Florida Road, Umlazi',
      phoneNumber: '+27 31 567 8901',
      operatingHours: '6:00 AM - 8:30 PM',
      openingTime: '06:00',
      closingTime: '20:30',
      latitude: -29.9679,
      longitude: 30.8827,
      isOpen: true,
      offersCredit: true,
      disabilityFriendly: false
    },
    {
      shopId: 'SHOP007',
      shopName: 'Mokoena Market - Pietermaritzburg',
      ownerName: 'James Mokoena',
      ownerUsername: 'multi_owner',
      location: 'Edendale',
      province: 'KwaZulu-Natal',
      address: '56 Church Street, Edendale',
      phoneNumber: '+27 33 678 9012',
      operatingHours: '7:00 AM - 7:00 PM',
      openingTime: '07:00',
      closingTime: '19:00',
      latitude: -29.6475,
      longitude: 30.3466,
      isOpen: true,
      offersCredit: false,
      disabilityFriendly: true
    },
    // Eastern Cape Province
    {
      shopId: 'SHOP008',
      shopName: 'Eastern Cape Village Store',
      ownerName: 'Bongani Mthembu',
      ownerUsername: 'bongani_shop',
      location: 'Qunu',
      province: 'Eastern Cape',
      address: 'Main Road, Qunu Village',
      phoneNumber: '+27 47 456 7890',
      operatingHours: '7:00 AM - 6:00 PM',
      openingTime: '07:00',
      closingTime: '18:00',
      latitude: -31.8029,
      longitude: 28.6325,
      isOpen: true,
      offersCredit: true,
      disabilityFriendly: true
    },
    // Limpopo Province
    {
      shopId: 'SHOP009',
      shopName: 'Limpopo Village Market',
      ownerName: 'Sarah Baloyi',
      ownerUsername: 'sarah_limpopo',
      location: 'Thohoyandou',
      province: 'Limpopo',
      address: 'Thohoyandou Central',
      phoneNumber: '+27 15 567 8901',
      operatingHours: '6:30 AM - 7:00 PM',
      openingTime: '06:30',
      closingTime: '19:00',
      latitude: -22.9486,
      longitude: 30.4843,
      isOpen: true,
      offersCredit: true,
      disabilityFriendly: false
    },
    // Free State Province
    {
      shopId: 'SHOP010',
      shopName: 'Bloemfontein Fresh Mart',
      ownerName: 'Pieter Botha',
      ownerUsername: 'pieter_freestate',
      location: 'Mangaung',
      province: 'Free State',
      address: '89 Nelson Mandela Drive, Bloemfontein',
      phoneNumber: '+27 51 678 9012',
      operatingHours: '6:00 AM - 8:00 PM',
      openingTime: '06:00',
      closingTime: '20:00',
      latitude: -29.1211,
      longitude: 26.2141,
      isOpen: true,
      offersCredit: false,
      disabilityFriendly: true
    },
    // Mpumalanga Province
    {
      shopId: 'SHOP011',
      shopName: 'Nelspruit Market Hub',
      ownerName: 'Grace Sithole',
      ownerUsername: 'grace_mpumalanga',
      location: 'Mbombela',
      province: 'Mpumalanga',
      address: '34 Paul Kruger Street, Nelspruit',
      phoneNumber: '+27 13 789 0123',
      operatingHours: '6:30 AM - 7:30 PM',
      openingTime: '06:30',
      closingTime: '19:30',
      latitude: -25.4753,
      longitude: 30.9699,
      isOpen: true,
      offersCredit: true,
      disabilityFriendly: true
    },
    // North West Province
    {
      shopId: 'SHOP012',
      shopName: 'Rustenburg Community Store',
      ownerName: 'Moses Tau',
      ownerUsername: 'moses_northwest',
      location: 'Rustenburg',
      province: 'North West',
      address: '12 Beyers Naude Drive, Rustenburg',
      phoneNumber: '+27 14 890 1234',
      operatingHours: '7:00 AM - 6:30 PM',
      openingTime: '07:00',
      closingTime: '18:30',
      latitude: -25.6672,
      longitude: 27.2423,
      isOpen: true,
      offersCredit: true,
      disabilityFriendly: false
    },
    // Northern Cape Province
    {
      shopId: 'SHOP013',
      shopName: 'Kimberley Diamond Mart',
      ownerName: 'Maria Hendricks',
      ownerUsername: 'maria_northerncape',
      location: 'Kimberley',
      province: 'Northern Cape',
      address: '67 Du Toitspan Road, Kimberley',
      phoneNumber: '+27 53 901 2345',
      operatingHours: '7:30 AM - 6:00 PM',
      openingTime: '07:30',
      closingTime: '18:00',
      latitude: -28.7320,
      longitude: 24.7610,
      isOpen: true,
      offersCredit: false,
      disabilityFriendly: true
    }
  ];

  const products: Product[] = [
    // Essential items available on credit
    {
      name: 'Bread',
      price: 18.50,
      category: 'Groceries',
      stock: 50,
      minStockLevel: 10,
      shopLocation: 'Soweto',
      seniorFavorite: true,
      shopOwner: 'lydia_shop',
      availableOnCredit: true,
      description: {
        'en': 'Fresh baked bread, soft and fluffy, perfect for sandwiches',
        'zu': 'Isinkwa esisha esivuthiwe, esithambile',
        'xh': 'Isonka esifreshe esibhakiweyo',
        'af': 'Vars gebakte brood, sag en pluisig'
      }
    },
    {
      name: 'Milk 1L',
      price: 22.00,
      category: 'Groceries',
      stock: 30,
      minStockLevel: 5,
      shopLocation: 'Soweto',
      seniorFavorite: true,
      shopOwner: 'lydia_shop',
      availableOnCredit: true,
      description: {
        'en': 'Fresh full cream milk, 1 liter',
        'zu': 'Ubisi olunobulungisa, uhlamvu oyi-1',
        'xh': 'Ubisi olufreshwe olukreyim',
        'af': 'Vars volroommelk, 1 liter'
      }
    },
    {
      name: 'Rice 2kg',
      price: 45.00,
      category: 'Groceries',
      stock: 25,
      minStockLevel: 5,
      shopLocation: 'Soweto',
      seniorFavorite: true,
      shopOwner: 'lydia_shop',
      availableOnCredit: true,
      description: {
        'en': 'Premium white rice, 2kg pack',
        'zu': 'Ulayisi omhlophe, iphakethe lama-2kg',
        'xh': 'Irayisi emhlophe, iipakethe ze-2kg',
        'af': 'Premium wit rys, 2kg pak'
      }
    },
    {
      name: 'Medicine',
      price: 45.00,
      category: 'Health',
      stock: 25,
      minStockLevel: 5,
      shopLocation: 'Soweto',
      seniorFavorite: true,
      shopOwner: 'lydia_shop',
      availableOnCredit: true,
      description: {
        'en': 'General pain relief medication',
        'zu': 'Umuthi wokuqeda ubuhlungu',
        'xh': 'Iyeza lokunciphisa iintlungu',
        'af': 'Algemene pynverligting medisyne'
      }
    },
    {
      name: 'Cooking Oil',
      price: 65.00,
      category: 'Groceries',
      stock: 15,
      minStockLevel: 3,
      shopLocation: 'Soweto',
      seniorFavorite: true,
      shopOwner: 'lydia_shop',
      availableOnCredit: true,
      description: {
        'en': 'Pure sunflower cooking oil',
        'zu': 'Uwoyela wokupheka we-sunflower',
        'xh': 'Ioyile yokupheka ye-sunflower',
        'af': 'Suiwer sonneblom kookolie'
      }
    },
    {
      name: 'Sugar 2kg',
      price: 38.00,
      category: 'Groceries',
      stock: 20,
      minStockLevel: 5,
      shopLocation: 'Soweto',
      seniorFavorite: true,
      shopOwner: 'lydia_shop',
      availableOnCredit: true,
      description: {
        'en': 'White granulated sugar, 2kg',
        'zu': 'Ushukela omhlophe, ama-2kg',
        'xh': 'Iswekile emhlophe, i-2kg',
        'af': 'Wit suiker, 2kg'
      }
    },
    {
      name: 'Tea Bags',
      price: 25.00,
      category: 'Groceries',
      stock: 40,
      minStockLevel: 8,
      shopLocation: 'Soweto',
      seniorFavorite: true,
      shopOwner: 'lydia_shop',
      availableOnCredit: true,
      description: {
        'en': 'Rooibos tea bags, 100 count',
        'zu': 'Amabhegi wetiye, ayi-100',
        'xh': 'Iingxowa zetiye, iyi-100',
        'af': 'Rooibos teesakke, 100 stuks'
      }
    },
    {
      name: 'Eggs (Dozen)',
      price: 35.00,
      category: 'Groceries',
      stock: 30,
      minStockLevel: 6,
      shopLocation: 'Soweto',
      seniorFavorite: true,
      shopOwner: 'lydia_shop',
      availableOnCredit: true,
      description: {
        'en': 'Fresh farm eggs, 12 count',
        'zu': 'Amaqanda asepulazini, ayi-12',
        'xh': 'Amaqanda afreshe, ali-12',
        'af': 'Vars plaseiere, 12 stuks'
      }
    },
    // Traditional food - not available on credit
    {
      name: 'Kota',
      price: 45.00,
      category: 'Traditional Food',
      stock: 20,
      minStockLevel: 5,
      shopLocation: 'Soweto',
      seniorFavorite: false,
      shopOwner: 'lydia_shop',
      availableOnCredit: false,
      description: {
        'en': 'Traditional Soweto quarter loaf filled with various ingredients',
        'zu': 'I-Kota yendabuko yaseSoweto',
        'xh': 'I-Kota yemveli yaseSoweto',
        'af': 'Tradisionele Soweto kwart brood'
      }
    },
    {
      name: 'Bunny Chow',
      price: 55.00,
      category: 'Traditional Food',
      stock: 18,
      minStockLevel: 4,
      shopLocation: 'Alexandra',
      seniorFavorite: false,
      shopOwner: 'thomas_shop',
      availableOnCredit: false,
      description: {
        'en': 'Hollowed out bread filled with curry',
        'zu': 'Isinkwa esigcwele ikhari',
        'xh': 'Isonka esizele ikhari',
        'af': 'Uitgegraafde brood gevul met kerrie'
      }
    },
    {
      name: 'Gatsby',
      price: 65.00,
      category: 'Traditional Food',
      stock: 15,
      minStockLevel: 3,
      shopLocation: 'Khayelitsha',
      seniorFavorite: false,
      shopOwner: 'nomsa_shop',
      availableOnCredit: false,
      description: {
        'en': 'Large Cape Town sandwich with chips and various fillings',
        'zu': 'I-sandwich enkulu yaseKapa enama-chips',
        'xh': 'Isandwich enkulu yaseKapa eneetshipsi',
        'af': 'Groot Kaapstad toebroodjie met tjips'
      }
    }
  ];

  const drivers: DeliveryDriver[] = [
    // Gauteng drivers - various transport methods
    {
      name: 'Thabo Mbeki',
      vehicleType: 'Walking',
      numberPlate: 'N/A',
      phoneNumber: '+27 11 111 1111',
      assignedShop: 'Soweto',
      available: true,
      deliveryStatus: 'Available',
      preferredLanguage: 'Sepedi'
    },
    {
      name: 'Lerato Smith',
      vehicleType: 'Bicycle',
      numberPlate: 'N/A',
      phoneNumber: '+27 11 111 1112',
      assignedShop: 'Soweto',
      available: true,
      deliveryStatus: 'Available',
      preferredLanguage: 'English'
    },
    {
      name: 'John Khumalo',
      vehicleType: 'Motorcycle',
      numberPlate: 'GP 456-789',
      phoneNumber: '+27 11 111 1113',
      assignedShop: 'Soweto',
      available: true,
      deliveryStatus: 'Available',
      preferredLanguage: 'isiZulu'
    },
    {
      name: 'Sipho Ndlovu',
      vehicleType: 'Donkey Cart',
      numberPlate: 'N/A',
      phoneNumber: '+27 11 222 2222',
      assignedShop: 'Alexandra',
      available: true,
      deliveryStatus: 'Available',
      preferredLanguage: 'isiZulu'
    },
    {
      name: 'Maria van Wyk',
      vehicleType: 'Car',
      numberPlate: 'GP 123-ABC',
      phoneNumber: '+27 11 222 2223',
      assignedShop: 'Alexandra',
      available: true,
      deliveryStatus: 'Available',
      preferredLanguage: 'Afrikaans'
    },
    // Western Cape drivers
    {
      name: 'Andile Mbane',
      vehicleType: 'Walking',
      numberPlate: 'N/A',
      phoneNumber: '+27 21 333 3333',
      assignedShop: 'Khayelitsha',
      available: true,
      deliveryStatus: 'Available',
      preferredLanguage: 'isiXhosa'
    },
    {
      name: 'Nadia Peters',
      vehicleType: 'Bakkie',
      numberPlate: 'CA 789-012',
      phoneNumber: '+27 21 333 3334',
      assignedShop: 'Khayelitsha',
      available: true,
      deliveryStatus: 'Available',
      preferredLanguage: 'Afrikaans'
    },
    // Eastern Cape drivers
    {
      name: 'Bongani Junior',
      vehicleType: 'Donkey Cart',
      numberPlate: 'N/A',
      phoneNumber: '+27 47 444 4444',
      assignedShop: 'Qunu',
      available: true,
      deliveryStatus: 'Available',
      preferredLanguage: 'isiXhosa'
    },
    {
      name: 'Nomvula Khoza',
      vehicleType: 'Bicycle',
      numberPlate: 'N/A',
      phoneNumber: '+27 47 444 4445',
      assignedShop: 'Qunu',
      available: true,
      deliveryStatus: 'Available',
      preferredLanguage: 'isiXhosa'
    },
    // Limpopo drivers
    {
      name: 'James Maluleke',
      vehicleType: 'Motorcycle',
      numberPlate: 'L 777-888',
      phoneNumber: '+27 15 555 5556',
      assignedShop: 'Thohoyandou',
      available: true,
      deliveryStatus: 'Available',
      preferredLanguage: 'Tshivenda'
    },
    {
      name: 'Tshifhiwa Netshiunda',
      vehicleType: 'Walking',
      numberPlate: 'N/A',
      phoneNumber: '+27 15 555 5557',
      assignedShop: 'Thohoyandou',
      available: true,
      deliveryStatus: 'Available',
      preferredLanguage: 'Tshivenda'
    }
  ];

  const combos: Combo[] = [
    {
      id: 'combo1',
      name: 'Bread & Milk Bundle',
      productIds: ['Bread', 'Milk 1L'],
      price: 35.0,
      discountPercentage: ((1 - 35.0 / (18.5 + 22.0)) * 100)
    }
  ]; // initially one example combo

  return { users, owners, shops, products, drivers, combos };
}



