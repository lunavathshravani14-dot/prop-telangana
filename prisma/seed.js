const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- PropTelangana Database Seeding Started ---');

  // 1. Clean existing records if any
  await prisma.auditLog.deleteMany({});
  await prisma.leadNote.deleteMany({});
  await prisma.leadStatusHistory.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.comparison.deleteMany({});
  await prisma.propertyAmenity.deleteMany({});
  await prisma.propertyImage.deleteMany({});
  await prisma.propertyVideo.deleteMany({});
  await prisma.propertyDocument.deleteMany({});
  await prisma.projectImage.deleteMany({});
  await prisma.projectDocument.deleteMany({});
  await prisma.property.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.blogCategory.deleteMany({});
  await prisma.amenity.deleteMany({});
  await prisma.location.deleteMany({});
  await prisma.agent.deleteMany({});
  await prisma.developer.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.siteSetting.deleteMany({});

  // 2. Roles
  const roles = await Promise.all([
    prisma.role.create({ data: { name: 'SUPER_ADMIN', description: 'Full system administrator' } }),
    prisma.role.create({ data: { name: 'ADMIN', description: 'Real estate platform manager' } }),
    prisma.role.create({ data: { name: 'EDITOR', description: 'Content and listing editor' } }),
    prisma.role.create({ data: { name: 'AGENT', description: 'Assigned property consultant' } }),
    prisma.role.create({ data: { name: 'USER', description: 'Public registered home seeker' } }),
  ]);

  // 3. Users
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('Admin@123', salt);
  const agentPassword = await bcrypt.hash('Agent@123', salt);
  const userPassword = await bcrypt.hash('User@123', salt);

  const adminUser = await prisma.user.create({
    data: {
      name: 'PropTelangana Administrator',
      email: 'admin@proptelangana.com',
      passwordHash: adminPassword,
      phone: '+91 91234 56789',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
  });

  const agentUser1 = await prisma.user.create({
    data: {
      name: 'Rajesh Kumar Varma',
      email: 'rajesh.kumar@proptelangana.com',
      passwordHash: agentPassword,
      phone: '+91 98765 43210',
      role: 'AGENT',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    },
  });

  const agentUser2 = await prisma.user.create({
    data: {
      name: 'Priyanka Reddy',
      email: 'priyanka.reddy@proptelangana.com',
      passwordHash: agentPassword,
      phone: '+91 98765 43211',
      role: 'AGENT',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
  });

  const normalUser = await prisma.user.create({
    data: {
      name: 'Shravani Rao',
      email: 'shravani@example.com',
      passwordHash: userPassword,
      phone: '+91 99887 76655',
      role: 'USER',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    },
  });

  // 4. Agents Profile
  const agent1 = await prisma.agent.create({
    data: {
      userId: agentUser1.id,
      employeeId: 'PT-AGT-01',
      name: 'Rajesh Kumar Varma',
      email: 'rajesh.kumar@proptelangana.com',
      phone: '+91 98765 43210',
      designation: 'Senior Investment Advisor (Kokapet & Neopolis)',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      bio: 'Over 12 years of experience guiding luxury buyers across Cyberabad, Financial District, and Neopolis high-rises.',
      reraNumber: 'A02400001889',
      status: 'ACTIVE',
    },
  });

  const agent2 = await prisma.agent.create({
    data: {
      userId: agentUser2.id,
      employeeId: 'PT-AGT-02',
      name: 'Priyanka Reddy',
      email: 'priyanka.reddy@proptelangana.com',
      phone: '+91 98765 43211',
      designation: 'Luxury Gated Villa Specialist (Tellapur & Mokila)',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      bio: 'Expert consultant for HMDA villa communities and high-yield open plot investments along the Outer Ring Road corridor.',
      reraNumber: 'A02400002144',
      status: 'ACTIVE',
    },
  });

  // 5. Locations (Hierarchy: State -> District -> Locality)
  const telangana = await prisma.location.create({
    data: {
      name: 'Telangana',
      slug: 'telangana',
      type: 'STATE',
      description: 'India’s fastest-growing economy and technological hub with premier real estate infrastructure.',
      popular: true,
    },
  });

  const hyderabadDist = await prisma.location.create({
    data: {
      name: 'Hyderabad',
      slug: 'hyderabad',
      type: 'DISTRICT',
      parentId: telangana.id,
      description: 'The City of Pearls, home to HITEC City, Financial District, and vibrant urban communities.',
      coverImage: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
      avgPriceSqft: 8500,
      popular: true,
    },
  });

  const rangareddyDist = await prisma.location.create({
    data: {
      name: 'Rangareddy',
      slug: 'rangareddy',
      type: 'DISTRICT',
      parentId: telangana.id,
      description: 'Encompassing Kokapet, Neopolis, and Rajendranagar - Telangana’s prime investment corridor.',
      coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      avgPriceSqft: 9800,
      popular: true,
    },
  });

  const sangareddyDist = await prisma.location.create({
    data: {
      name: 'Sangareddy',
      slug: 'sangareddy',
      type: 'DISTRICT',
      parentId: telangana.id,
      description: 'Gated community villas and emerging IT expansion zone including Tellapur, Kollur, and Mokila.',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      avgPriceSqft: 7200,
      popular: true,
    },
  });

  // Localities
  const kokapet = await prisma.location.create({
    data: {
      name: 'Kokapet',
      slug: 'kokapet',
      type: 'LOCALITY',
      parentId: rangareddyDist.id,
      description: 'Home to the iconic Neopolis SEZ and world-class ultra-luxury residential towers.',
      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      avgPriceSqft: 11500,
      popular: true,
      latitude: 17.3871,
      longitude: 78.3308,
    },
  });

  const gachibowli = await prisma.location.create({
    data: {
      name: 'Gachibowli',
      slug: 'gachibowli',
      type: 'LOCALITY',
      parentId: hyderabadDist.id,
      description: 'Financial district epicenter with tech campuses, premier hospitals, and top international schools.',
      coverImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
      avgPriceSqft: 9500,
      popular: true,
      latitude: 17.4401,
      longitude: 78.3489,
    },
  });

  const tellapur = await prisma.location.create({
    data: {
      name: 'Tellapur',
      slug: 'tellapur',
      type: 'LOCALITY',
      parentId: sangareddyDist.id,
      description: 'The preferred villa and premium high-rise paradise right next to Financial District and ORR Exit 2.',
      coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      avgPriceSqft: 7800,
      popular: true,
      latitude: 17.4612,
      longitude: 78.2796,
    },
  });

  const financialDistrict = await prisma.location.create({
    data: {
      name: 'Financial District',
      slug: 'financial-district',
      type: 'LOCALITY',
      parentId: rangareddyDist.id,
      description: 'Hyderabad’s Wall Street, hosting multinational tech giants and marquee residential skyscrapers.',
      coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      avgPriceSqft: 10200,
      popular: true,
      latitude: 17.4147,
      longitude: 78.3403,
    },
  });

  const mokila = await prisma.location.create({
    data: {
      name: 'Mokila',
      slug: 'mokila',
      type: 'LOCALITY',
      parentId: sangareddyDist.id,
      description: 'Scenic green corridor famous for HMDA approved luxury villa plots and gated farmhouses.',
      coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      avgPriceSqft: 4500,
      popular: true,
      latitude: 17.4168,
      longitude: 78.1963,
    },
  });

  const jubileeHills = await prisma.location.create({
    data: {
      name: 'Jubilee Hills',
      slug: 'jubilee-hills',
      type: 'LOCALITY',
      parentId: hyderabadDist.id,
      description: 'Hyderabad’s most prestigious residential enclave with celebrity homes and gourmet dining.',
      coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      avgPriceSqft: 18000,
      popular: true,
      latitude: 17.4319,
      longitude: 78.4073,
    },
  });

  // 6. Developers
  const devMyHome = await prisma.developer.create({
    data: {
      name: 'My Home Group',
      slug: 'my-home-group',
      logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80',
      coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      description: 'Over 35 years of engineering excellence, shaping Hyderabad’s skyline with 40+ million sq.ft of landmark residential and commercial developments.',
      website: 'https://myhomegroup.in',
      phone: '+91 40 6688 8888',
      email: 'sales@myhomegroup.in',
      officeAddress: 'My Home Hub, Madhapur, Hyderabad, Telangana 500081',
      experienceYears: 36,
      verified: true,
      reraRegistered: true,
      socialLinks: JSON.stringify({ linkedin: 'https://linkedin.com', facebook: 'https://facebook.com' }),
    },
  });

  const devAparna = await prisma.developer.create({
    data: {
      name: 'Aparna Constructions',
      slug: 'aparna-constructions',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=300&q=80',
      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      description: 'Pioneers in gated communities in South India, renowned for punctuality, quality, and sustainable architecture.',
      website: 'https://aparnaconstructions.com',
      phone: '+91 40 2335 2708',
      email: 'info@aparnaconstructions.com',
      officeAddress: 'Astron, Financial District, Nanakramguda, Hyderabad, Telangana 500032',
      experienceYears: 28,
      verified: true,
      reraRegistered: true,
    },
  });

  const devRajapushpa = await prisma.developer.create({
    data: {
      name: 'Rajapushpa Properties',
      slug: 'rajapushpa-properties',
      logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=300&q=80',
      coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      description: 'Architecting lifestyle luxury residences with sprawling clubhouses, futuristic amenities, and unmatched finishes.',
      website: 'https://rajapushpa.in',
      phone: '+91 40 4445 5555',
      email: 'sales@rajapushpa.in',
      officeAddress: 'Rajapushpa Summit, Financial District, Hyderabad, Telangana 500032',
      experienceYears: 18,
      verified: true,
      reraRegistered: true,
    },
  });

  const devPrestige = await prisma.developer.create({
    data: {
      name: 'Prestige Group',
      slug: 'prestige-group',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      description: 'One of India’s foremost real estate developers with marquee projects across residential, luxury, and IT parks.',
      website: 'https://prestigeconstructions.com',
      phone: '+91 40 2341 0000',
      email: 'hyderabad@prestigeconstructions.com',
      officeAddress: 'Prestige Falcon Tower, Banjara Hills, Hyderabad, Telangana 500034',
      experienceYears: 38,
      verified: true,
      reraRegistered: true,
    },
  });

  // 7. Amenities
  const amenitiesList = [
    { name: 'Grand Clubhouse (50,000+ Sq.Ft)', slug: 'grand-clubhouse', icon: 'Building2', category: 'LEISURE' },
    { name: 'Olympic-Size Swimming Pool', slug: 'olympic-pool', icon: 'Waves', category: 'SPORTS' },
    { name: 'State-of-the-Art Gymnasium', slug: 'gym', icon: 'Dumbbell', category: 'SPORTS' },
    { name: '24/7 Multi-Tier CCTV Security', slug: 'security-cctv', icon: 'ShieldCheck', category: 'SAFETY' },
    { name: '100% DG Power Backup', slug: 'power-backup', icon: 'Zap', category: 'CONVENIENCE' },
    { name: 'EV Charging Infrastructure', slug: 'ev-charging', icon: 'BatteryCharging', category: 'ECO' },
    { name: 'Children Themed Play Park', slug: 'play-area', icon: 'Smile', category: 'LEISURE' },
    { name: 'Indoor Badminton & Squash Courts', slug: 'badminton-squash', icon: 'Trophy', category: 'SPORTS' },
    { name: 'Aroma Gardens & Jogging Track', slug: 'jogging-track', icon: 'Footprints', category: 'ECO' },
    { name: 'High-Speed Elevators', slug: 'high-speed-elevators', icon: 'ArrowUpCircle', category: 'CONVENIENCE' },
    { name: 'HMDA & RERA Approved', slug: 'hmda-rera-approved', icon: 'FileCheck', category: 'SAFETY' },
    { name: '100% Vastu Compliant', slug: 'vastu-compliant', icon: 'Compass', category: 'CONVENIENCE' },
  ];

  const dbAmenities = [];
  for (const a of amenitiesList) {
    const am = await prisma.amenity.create({ data: a });
    dbAmenities.push(am);
  }

  // 8. Projects
  const prjSayuk = await prisma.project.create({
    data: {
      projectId: 'PT-PRJ-2001',
      name: 'My Home Sayuk',
      slug: 'my-home-sayuk',
      description: 'A 25.37-acre integrated mega-community located at Tellapur-Gachibowli junction. Sayuk features 12 towering blocks rising 39 floors high with an expansive 100,000 sq.ft mega clubhouse.',
      developerId: devMyHome.id,
      location: 'Tellapur, Near Financial District',
      city: 'Hyderabad',
      district: 'Sangareddy',
      projectType: 'LUXURY_APARTMENTS',
      totalArea: '25.37 Acres',
      totalUnits: '3,780 Units',
      apartmentSizes: '2, 2.5, 3 & 4 BHK (1355 - 2260 Sq.Ft)',
      minPrice: 11000000,
      maxPrice: 24500000,
      priceRange: '₹ 1.10 Cr - ₹ 2.45 Cr',
      possessionDate: 'March 2026',
      reraNumber: 'P02400003923',
      approvalDetails: 'HMDA, RERA, and Environmental Clearance Approved',
      connectivity: '5 mins to ORR Exit 2, 10 mins to Wipro Circle, 15 mins to Inorbit Mall',
      latitude: 17.4615,
      longitude: 78.2810,
      contactPhone: '+91 40 6688 8888',
      contactEmail: 'sales@myhomegroup.in',
      status: 'ONGOING',
      featured: true,
    },
  });

  const prjProvincia = await prisma.project.create({
    data: {
      projectId: 'PT-PRJ-2002',
      name: 'Rajapushpa Provincia',
      slug: 'rajapushpa-provincia',
      description: 'Spread over 23.75 lush acres in Narsingi, right beside the Outer Ring Road. 11 towers of 39 floors offering lifestyle flats with dual clubhouses totaling 1.5 Lakh sq.ft.',
      developerId: devRajapushpa.id,
      location: 'Narsingi, Financial District Corridor',
      city: 'Hyderabad',
      district: 'Rangareddy',
      projectType: 'LUXURY_APARTMENTS',
      totalArea: '23.75 Acres',
      totalUnits: '3,498 Units',
      apartmentSizes: '2 & 3 BHK (1370 - 2660 Sq.Ft)',
      minPrice: 12500000,
      maxPrice: 28000000,
      priceRange: '₹ 1.25 Cr - ₹ 2.80 Cr',
      possessionDate: 'December 2025',
      reraNumber: 'P02400003445',
      approvalDetails: 'HMDA & Telangana RERA Approved',
      connectivity: '2 mins from ORR, 7 mins from Financial District, 25 mins to Rajiv Gandhi International Airport',
      latitude: 17.3820,
      longitude: 78.3610,
      status: 'ONGOING',
      featured: true,
    },
  });

  const prjClairemont = await prisma.project.create({
    data: {
      projectId: 'PT-PRJ-2003',
      name: 'Prestige Clairemont',
      slug: 'prestige-clairemont',
      description: 'Ultra-luxurious sky residences located right next to Neopolis Kokapet. Features 4 soaring towers with grand glass-facade aesthetics, panoramic lake views, and bespoke private sky lounges.',
      developerId: devPrestige.id,
      location: 'Neopolis, Kokapet',
      city: 'Hyderabad',
      district: 'Rangareddy',
      projectType: 'LUXURY_APARTMENTS',
      totalArea: '7.56 Acres',
      totalUnits: '928 Units',
      apartmentSizes: '3 & 4 BHK (1989 - 4060 Sq.Ft)',
      minPrice: 24000000,
      maxPrice: 52000000,
      priceRange: '₹ 2.40 Cr - ₹ 5.20 Cr',
      possessionDate: 'November 2027',
      reraNumber: 'P02400006211',
      approvalDetails: 'HMDA & RERA Approved with 100% clear titles',
      connectivity: 'Direct access to Neopolis Trumpet interchange, 8 mins to Knowledge City',
      latitude: 17.3890,
      longitude: 78.3280,
      status: 'UPCOMING',
      featured: true,
    },
  });

  const prjMokilaPlots = await prisma.project.create({
    data: {
      projectId: 'PT-PRJ-2004',
      name: 'Green Meadows Luxury Villa Plots',
      slug: 'green-meadows-villa-plots',
      description: 'HMDA and RERA certified premium villa gated layout in Mokila. Fully developed with 60ft and 40ft blacktop roads, underground cabling, avenue plantation, and sports arena.',
      developerId: devAparna.id,
      location: 'Shankarpally - Mokila Road',
      city: 'Hyderabad',
      district: 'Sangareddy',
      projectType: 'PLOTTED_DEVELOPMENT',
      totalArea: '40 Acres',
      totalUnits: '320 Plots',
      plotSizes: '200 to 600 Sq.Yds',
      minPrice: 5500000,
      maxPrice: 18000000,
      priceRange: '₹ 55 Lakhs - ₹ 1.80 Cr',
      possessionDate: 'Ready to Construct',
      reraNumber: 'P02400001990',
      approvalDetails: 'HMDA LP No: 000142/LO/Plg/HMDA/2024',
      connectivity: '15 mins to Kokapet SEZ, 20 mins to Financial District, adjacent to Indus International School',
      latitude: 17.4180,
      longitude: 78.1920,
      status: 'READY_TO_MOVE',
      featured: true,
    },
  });

  // Project Images
  await prisma.projectImage.createMany({
    data: [
      { projectId: prjSayuk.id, url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', isCover: true, orderIndex: 0 },
      { projectId: prjSayuk.id, url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', isCover: false, orderIndex: 1 },
      { projectId: prjProvincia.id, url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', isCover: true, orderIndex: 0 },
      { projectId: prjClairemont.id, url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', isCover: true, orderIndex: 0 },
      { projectId: prjMokilaPlots.id, url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80', isCover: true, orderIndex: 0 },
    ],
  });

  // 9. Properties
  const propData = [
    {
      propertyId: 'PT-PROP-1001',
      title: 'Ultra-Luxury 4 BHK Sky Residence in Neopolis Kokapet',
      slug: 'ultra-luxury-4bhk-sky-residence-neopolis-kokapet',
      description: 'Experience regal living in this panoramic 4-bedroom corner apartment situated on the 32nd floor with unhindered views of Gandipet Lake and the Cyberabad skyline. Featuring imported Italian marble flooring, 11-ft clear ceiling height, private elevator lobby, and German modular kitchen.',
      propertyType: 'APARTMENT',
      listingType: 'BUY',
      price: 38500000,
      priceDisplay: '₹ 3.85 Cr',
      area: 3850,
      areaUnit: 'sqft',
      bedrooms: 4,
      bathrooms: 5,
      balconies: 3,
      floor: 32,
      totalFloors: 45,
      facing: 'East',
      furnishing: 'SEMI_FURNISHED',
      possessionStatus: 'UNDER_CONSTRUCTION',
      reraNumber: 'P02400006211',
      approvalInfo: 'HMDA & RERA Approved',
      address: 'Tower A, Prestige Clairemont, Neopolis, Kokapet',
      locality: 'Kokapet',
      city: 'Hyderabad',
      district: 'Rangareddy',
      pincode: '500075',
      latitude: 17.3895,
      longitude: 78.3285,
      developerId: devPrestige.id,
      agentId: agent1.id,
      projectId: prjClairemont.id,
      locationId: kokapet.id,
      featured: true,
      status: 'PUBLISHED',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    {
      propertyId: 'PT-PROP-1002',
      title: 'Sprawling 4 BHK Triplex Luxury Villa in Tellapur Gated Community',
      slug: '4bhk-triplex-luxury-villa-tellapur',
      description: 'Designer independent villa with private swimming pool, home theatre, and manicured terrace garden. Located in a high-security gated enclave with international school and shopping promenade inside.',
      propertyType: 'VILLA',
      listingType: 'BUY',
      price: 52500000,
      priceDisplay: '₹ 5.25 Cr',
      area: 4600,
      areaUnit: 'sqft',
      bedrooms: 4,
      bathrooms: 5,
      balconies: 4,
      floor: 1,
      totalFloors: 3,
      facing: 'North-East',
      furnishing: 'FULLY_FURNISHED',
      possessionStatus: 'READY_TO_MOVE',
      reraNumber: 'P02400002888',
      approvalInfo: 'HMDA Approved Gated Layout',
      address: 'Villa 42, Boulevard Enclave, Tellapur',
      locality: 'Tellapur',
      city: 'Hyderabad',
      district: 'Sangareddy',
      pincode: '502032',
      latitude: 17.4620,
      longitude: 78.2785,
      developerId: devMyHome.id,
      agentId: agent2.id,
      locationId: tellapur.id,
      featured: true,
      status: 'PUBLISHED',
      coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    {
      propertyId: 'PT-PROP-1003',
      title: 'Premium 3 BHK High-Rise Flat in Financial District',
      slug: 'premium-3bhk-high-rise-flat-financial-district',
      description: 'Walking distance to Amazon Campus, Microsoft, and Waverock. Beautiful 3 BHK apartment with 3 attached baths, servant room, modular fittings, and covered 2-car basement parking.',
      propertyType: 'APARTMENT',
      listingType: 'BUY',
      price: 19500000,
      priceDisplay: '₹ 1.95 Cr',
      area: 2150,
      areaUnit: 'sqft',
      bedrooms: 3,
      bathrooms: 3,
      balconies: 2,
      floor: 18,
      totalFloors: 39,
      facing: 'East',
      furnishing: 'SEMI_FURNISHED',
      possessionStatus: 'UNDER_CONSTRUCTION',
      reraNumber: 'P02400003445',
      approvalInfo: 'HMDA & RERA Approved',
      address: 'Provincia Heights, Narsingi / Financial District',
      locality: 'Financial District',
      city: 'Hyderabad',
      district: 'Rangareddy',
      pincode: '500032',
      latitude: 17.4140,
      longitude: 78.3410,
      developerId: devRajapushpa.id,
      agentId: agent1.id,
      projectId: prjProvincia.id,
      locationId: financialDistrict.id,
      featured: true,
      status: 'PUBLISHED',
      coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    {
      propertyId: 'PT-PROP-1004',
      title: 'HMDA Approved 267 Sq.Yds Villa Plot in Mokila Gated Layout',
      slug: 'hmda-approved-villa-plot-mokila-gated-layout',
      description: 'Clear title, 100% Vastu East facing open plot situated inside 40-acre gated venture. Features underground drainage, 24/7 security, club house access, and clear bank loan sanction from SBI and HDFC.',
      propertyType: 'PLOT',
      listingType: 'BUY',
      price: 6500000,
      priceDisplay: '₹ 65 Lakhs',
      area: 267,
      areaUnit: 'sqyd',
      facing: 'East',
      possessionStatus: 'READY_TO_MOVE',
      reraNumber: 'P02400001990',
      approvalInfo: 'HMDA Approved LP Layout',
      address: 'Plot 88, Green Meadows, Mokila, Shankarpally Road',
      locality: 'Mokila',
      city: 'Hyderabad',
      district: 'Sangareddy',
      pincode: '501503',
      latitude: 17.4185,
      longitude: 78.1930,
      developerId: devAparna.id,
      agentId: agent2.id,
      projectId: prjMokilaPlots.id,
      locationId: mokila.id,
      featured: true,
      status: 'PUBLISHED',
      coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
    },
    {
      propertyId: 'PT-PROP-1005',
      title: 'Grade-A Commercial IT Office Space in Gachibowli Cyber Hub',
      slug: 'grade-a-commercial-it-office-space-gachibowli',
      description: 'High-yield commercial asset leased to global fintech company. 6,500 sq.ft bare-shell or plug-and-play floor with 9% assured rental yield and long-term 9-year lease agreement.',
      propertyType: 'COMMERCIAL',
      listingType: 'BUY',
      price: 85000000,
      priceDisplay: '₹ 8.50 Cr',
      area: 6500,
      areaUnit: 'sqft',
      floor: 7,
      totalFloors: 14,
      facing: 'North',
      possessionStatus: 'READY_TO_MOVE',
      approvalInfo: 'GHMC & Fire NOC Certified Commercial Tech Park',
      address: 'Tower B, Cyber Crest, Gachibowli Outer Ring Road',
      locality: 'Gachibowli',
      city: 'Hyderabad',
      district: 'Hyderabad',
      pincode: '500032',
      latitude: 17.4410,
      longitude: 78.3495,
      agentId: agent1.id,
      locationId: gachibowli.id,
      featured: false,
      status: 'PUBLISHED',
      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
    },
    {
      propertyId: 'PT-PROP-1006',
      title: '2.5 Acres Commercial Growth Corridor Land on ORR Exit 1',
      slug: 'commercial-growth-land-orr-exit-1',
      description: 'Prime contiguous commercial land parcel located directly facing 150-ft arterial service road. Ideal for IT SEZ, hospital campus, high-street retail, or luxury high-rise development.',
      propertyType: 'LAND',
      listingType: 'BUY',
      price: 225000000,
      priceDisplay: '₹ 22.50 Cr',
      area: 2.5,
      areaUnit: 'acres',
      facing: 'East',
      possessionStatus: 'READY_TO_MOVE',
      approvalInfo: 'Clear Title Agricultural/Commercial Conversion Ready',
      address: 'Near ORR Exit 1, Financial District Extension',
      locality: 'Financial District',
      city: 'Hyderabad',
      district: 'Rangareddy',
      pincode: '500075',
      latitude: 17.3910,
      longitude: 78.3340,
      agentId: agent1.id,
      locationId: financialDistrict.id,
      featured: false,
      status: 'PUBLISHED',
      coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
    },
    {
      propertyId: 'PT-PROP-1007',
      title: 'Executive 3 BHK Furnished Apartment for Rent in Gachibowli',
      slug: 'executive-3bhk-furnished-apartment-rent-gachibowli',
      description: 'Fully furnished luxury apartment with premium electronics, modular Italian kitchen, high-speed fiber internet, and 24/7 clubhouse access. Perfect for corporate executives and tech leads.',
      propertyType: 'APARTMENT',
      listingType: 'RENT',
      price: 75000,
      priceDisplay: '₹ 75,000 / mo',
      area: 2100,
      areaUnit: 'sqft',
      bedrooms: 3,
      bathrooms: 3,
      balconies: 2,
      floor: 12,
      totalFloors: 25,
      facing: 'East',
      furnishing: 'FULLY_FURNISHED',
      possessionStatus: 'READY_TO_MOVE',
      approvalInfo: 'GHMC Approved',
      address: 'Greenwood Heights, Gachibowli',
      locality: 'Gachibowli',
      city: 'Hyderabad',
      district: 'Hyderabad',
      pincode: '500032',
      latitude: 17.4420,
      longitude: 78.3470,
      agentId: agent2.id,
      locationId: gachibowli.id,
      featured: false,
      status: 'PUBLISHED',
      coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
    },
    {
      propertyId: 'PT-PROP-1008',
      title: 'Ultra-Exclusive 4 BHK Sky Villa in Jubilee Hills Road No. 36',
      slug: 'ultra-exclusive-4bhk-sky-villa-jubilee-hills',
      description: 'Single residence per floor concept with dedicated private elevator. Panoramic city views, private temperature-controlled plunge pool, and signature designer interiors.',
      propertyType: 'APARTMENT',
      listingType: 'BUY',
      price: 41000000,
      priceDisplay: '₹ 4.10 Cr',
      area: 3200,
      areaUnit: 'sqft',
      bedrooms: 4,
      bathrooms: 4,
      balconies: 3,
      floor: 5,
      totalFloors: 7,
      facing: 'North-East',
      furnishing: 'SEMI_FURNISHED',
      possessionStatus: 'READY_TO_MOVE',
      reraNumber: 'P02400001122',
      approvalInfo: 'GHMC & RERA Approved',
      address: 'Road No. 36, Jubilee Hills',
      locality: 'Jubilee Hills',
      city: 'Hyderabad',
      district: 'Hyderabad',
      pincode: '500033',
      latitude: 17.4325,
      longitude: 78.4080,
      agentId: agent1.id,
      locationId: jubileeHills.id,
      featured: true,
      status: 'PUBLISHED',
      coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
    },
  ];

  for (const p of propData) {
    const { gallery, coverImage, ...data } = p;
    const createdProp = await prisma.property.create({ data });

    // Add cover image
    await prisma.propertyImage.create({
      data: {
        propertyId: createdProp.id,
        url: coverImage,
        isCover: true,
        orderIndex: 0,
        altText: createdProp.title,
      },
    });

    // Add gallery images
    if (gallery && gallery.length > 0) {
      for (let i = 0; i < gallery.length; i++) {
        await prisma.propertyImage.create({
          data: {
            propertyId: createdProp.id,
            url: gallery[i],
            isCover: false,
            orderIndex: i + 1,
            altText: `${createdProp.title} view ${i + 1}`,
          },
        });
      }
    }

    // Connect top 4 amenities
    for (let i = 0; i < 4; i++) {
      await prisma.propertyAmenity.create({
        data: {
          propertyId: createdProp.id,
          amenityId: dbAmenities[i].id,
        },
      });
    }
  }

  // 10. Sample Leads & CRM data
  const sampleProp = await prisma.property.findFirst();
  const lead1 = await prisma.lead.create({
    data: {
      leadId: 'PT-LD-1001',
      name: 'Venkata Krishna Reddy',
      phone: '+91 98490 12345',
      email: 'krishna.reddy@techcorp.com',
      propertyId: sampleProp ? sampleProp.id : null,
      message: 'Looking for a 4 BHK in Kokapet for immediate family shifting. Need floor plan and payment plan details.',
      source: 'PROPERTY_PAGE',
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'kokapet_luxury_homes',
      assignedAgentId: agent1.id,
      status: 'INTERESTED',
      priority: 'HIGH',
    },
  });

  await prisma.leadNote.create({
    data: {
      leadId: lead1.id,
      authorName: 'Rajesh Kumar Varma',
      note: 'Spoke over phone. Client works at Amazon as VP. Interested in visiting Neopolis site this Saturday at 11 AM.',
    },
  });

  await prisma.leadStatusHistory.create({
    data: {
      leadId: lead1.id,
      oldStatus: 'NEW',
      newStatus: 'INTERESTED',
      remarks: 'Scheduled site visit for Kokapet project.',
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      leadId: 'PT-LD-1002',
      name: 'Dr. Madhavi Latha',
      phone: '+91 94401 56789',
      email: 'madhavi.latha@carehospital.org',
      message: 'Looking to invest in HMDA approved villa plots in Mokila or Tellapur with bank loan support.',
      source: 'HOMEPAGE_ENQUIRY',
      status: 'SITE_VISIT',
      priority: 'URGENT',
      assignedAgentId: agent2.id,
    },
  });

  // 11. Blog Categories & Posts
  const catMarket = await prisma.blogCategory.create({
    data: { name: 'Market Insights', slug: 'market-insights', description: 'Trends and price analysis in Telangana' },
  });
  const catRera = await prisma.blogCategory.create({
    data: { name: 'RERA & Legal', slug: 'rera-legal', description: 'Legal guidance and document verification' },
  });
  const catInfrastructure = await prisma.blogCategory.create({
    data: { name: 'Infrastructure Updates', slug: 'infrastructure-updates', description: 'Metro rail, ORR, and SEZ announcements' },
  });

  await prisma.blogPost.create({
    data: {
      title: 'Neopolis Kokapet: Why Hyderabad’s Skyscraper Hub is South India’s #1 Real Estate Hotspot',
      slug: 'neopolis-kokapet-south-india-top-real-estate-hotspot',
      featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'With record-breaking land auctions and 45-to-55 floor skyscrapers rising along the Outer Ring Road, Neopolis is reshaping luxury urban living in Hyderabad.',
      content: `Neopolis Kokapet has firmly established itself as the crown jewel of Hyderabad's luxury real estate landscape. Backed by world-class infrastructure, underground utility ducting, and direct 8-lane expressway connectivity to the Financial District, Neopolis commands the highest capital appreciation rates across South India.

Key highlights driving the Neopolis boom:
1. Trumpet interchange connecting directly to the Outer Ring Road (ORR).
2. Proximity to marquee employers including Google, Amazon, and Microsoft campuses.
3. Master-planned 500+ acre layout with dedicated green belts and zero overhead electric wires.

For investors and high-net-worth home buyers, properties in Neopolis represent not just residences, but generational wealth assets.`,
      categoryId: catMarket.id,
      authorName: 'PropTelangana Research Desk',
      tags: 'Neopolis, Kokapet, Luxury Homes, Investment',
      seoTitle: 'Neopolis Kokapet Real Estate Market Analysis 2026',
      metaDescription: 'Complete guide on Neopolis Kokapet real estate prices, projects, and investment potential.',
      status: 'PUBLISHED',
      viewsCount: 1420,
    },
  });

  await prisma.blogPost.create({
    data: {
      title: 'Telangana RERA Guide: 7 Mandatory Documents Every Home Buyer Must Verify',
      slug: 'telangana-rera-guide-documents-verification',
      featuredImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Avoid disputes and delays: Here is our definitive checklist for verifying TG-RERA numbers, approved layout plans, encumbrance certificates, and builder escrows.',
      content: `Buying a property in Telangana is a significant financial milestone. Under the Telangana Real Estate (Regulation and Development) Rules, purchasers enjoy unprecedented consumer protections—provided due diligence is conducted prior to signing the agreement of sale.

Always inspect:
1. The unique TG-RERA Registration Number on the official portal.
2. The sanctioned architectural building plan approved by HMDA or GHMC.
3. Clear Title Search Report covering a minimum of 30 continuous years.
4. Nil-Encumbrance Certificate (EC) from the Registration and Stamps Department.
5. The designated RERA 70% Escrow Account for construction funds.

PropTelangana lists only verified developers with verified RERA documentation.`,
      categoryId: catRera.id,
      authorName: 'Legal & Compliance Team',
      tags: 'RERA, HMDA, Legal Guide, Property Verification',
      seoTitle: 'Telangana RERA Verification Checklist for Buyers',
      metaDescription: 'Step-by-step instructions on verifying RERA approved properties in Telangana.',
      status: 'PUBLISHED',
      viewsCount: 890,
    },
  });

  // 12. Site Settings
  await prisma.siteSetting.createMany({
    data: [
      { key: 'site_title', value: 'PropTelangana - Telangana’s Premier Real Estate Portal' },
      { key: 'support_phone', value: '+91 70138 73126' },
      { key: 'support_email', value: 'jbinfra.sales25@gmail.com' },
      { key: 'office_address', value: 'Level 5, Cyber Crest, HITEC City, Hyderabad, Telangana 500081' },
      { key: 'whatsapp_number', value: '+917013873126' },
      { key: 'rera_disclaimer', value: 'PropTelangana is an authorized real estate facilitation portal registered under Telangana RERA. All information is sourced directly from approved builders.' },
    ],
  });

  console.log('✓ Seeding complete! Created Admin user, Agents, Developers, Locations, Properties, Projects, Leads, Blogs, and Settings.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
