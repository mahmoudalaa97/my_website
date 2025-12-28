import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin, AdminRole, AuditLog, SiteSettings, Service, Package, Project } from './entities';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'website_db',
  entities: [Admin, AuditLog, SiteSettings, Service, Package, Project],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();
  console.log('Database connected');

  // Create default admin (use env vars or defaults)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';
  const adminName = process.env.ADMIN_NAME || 'Super Admin';

  const adminRepo = dataSource.getRepository(Admin);
  const existingAdmin = await adminRepo.findOne({ where: { email: adminEmail } });
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await adminRepo.save({
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    });
    console.log(`Default super admin created: ${adminEmail} (password from env or default)`);
    console.log('⚠️  IMPORTANT: Change the admin password immediately after first login!');
  } else if (!existingAdmin.role) {
    // Update existing admin to SUPER_ADMIN if role is not set
    existingAdmin.role = AdminRole.SUPER_ADMIN;
    existingAdmin.isActive = true;
    await adminRepo.save(existingAdmin);
    console.log('Existing admin upgraded to super admin');
  }

  // Create default settings
  const settingsRepo = dataSource.getRepository(SiteSettings);
  const existingSettings = await settingsRepo.findOne({ where: {} });
  
  if (!existingSettings) {
    await settingsRepo.save({
      siteName: 'Your Business Name',
      tagline: 'Your Tagline Here',
      description: 'Describe your business and services here.',
      heroTitle: 'Welcome to Our Website',
      heroSubtitle: 'We help businesses achieve their goals through professional services and solutions.',
      aboutTitle: 'About Us',
      aboutDescription: 'Tell your story here. Describe your experience, expertise, and what makes you unique.',
      email: '',
      phone: '',
      whatsapp: '',
      location: '',
      socialLinks: {},
      stats: [
        { value: '10+', label: 'Years Experience' },
        { value: '100+', label: 'Projects Completed' },
        { value: '50+', label: 'Happy Clients' },
        { value: '100%', label: 'Satisfaction Rate' },
      ],
    });
    console.log('Default settings created');
  }

  // Create default services
  const serviceRepo = dataSource.getRepository(Service);
  const existingServices = await serviceRepo.count();
  
  if (existingServices === 0) {
    await serviceRepo.save([
      {
        title: 'Web Development',
        description: 'Custom web applications built with modern technologies like React, Next.js, and Node.js.',
        icon: 'Globe',
        features: ['Responsive Design', 'SEO Optimized', 'Fast Performance', 'Secure & Scalable'],
        sortOrder: 0,
      },
      {
        title: 'Mobile Apps',
        description: 'Native and cross-platform mobile applications for iOS and Android.',
        icon: 'Smartphone',
        features: ['iOS & Android', 'Cross-Platform', 'Offline Support', 'Push Notifications'],
        sortOrder: 1,
      },
      {
        title: 'Digital Transformation',
        description: 'Help businesses transition from traditional to digital processes.',
        icon: 'Zap',
        features: ['Process Analysis', 'System Design', 'Implementation', 'Training'],
        sortOrder: 2,
      },
      {
        title: 'API Development',
        description: 'RESTful and GraphQL APIs for seamless data integration.',
        icon: 'Code',
        features: ['REST & GraphQL', 'Authentication', 'Documentation', 'Scalable'],
        sortOrder: 3,
      },
      {
        title: 'E-Commerce',
        description: 'Online stores and payment integrations for your business.',
        icon: 'ShoppingCart',
        features: ['Payment Gateway', 'Inventory Management', 'Analytics', 'Multi-currency'],
        sortOrder: 4,
      },
      {
        title: 'Consulting',
        description: 'Technical consulting and architecture design for your projects.',
        icon: 'MessageSquare',
        features: ['Architecture Review', 'Code Audit', 'Tech Strategy', 'Team Training'],
        sortOrder: 5,
      },
    ]);
    console.log('Default services created');
  }

  // Create default packages
  const packageRepo = dataSource.getRepository(Package);
  const existingPackages = await packageRepo.count();
  
  if (existingPackages === 0) {
    await packageRepo.save([
      {
        name: 'Starter',
        description: 'Perfect for small projects and MVPs',
        price: '$999',
        priceNote: 'starting price',
        features: [
          'Up to 5 pages',
          'Responsive design',
          'Basic SEO',
          'Contact form',
          '1 month support',
        ],
        isPopular: false,
        sortOrder: 0,
      },
      {
        name: 'Professional',
        description: 'For growing businesses and complex applications',
        price: '$2,999',
        priceNote: 'starting price',
        features: [
          'Up to 15 pages',
          'Custom design',
          'Advanced SEO',
          'CMS integration',
          'Analytics setup',
          '3 months support',
          'Priority support',
        ],
        isPopular: true,
        sortOrder: 1,
      },
      {
        name: 'Enterprise',
        description: 'Full-scale solutions for large organizations',
        price: 'Custom',
        priceNote: 'contact for quote',
        features: [
          'Unlimited pages',
          'Custom features',
          'API integrations',
          'Performance optimization',
          'Security audit',
          '12 months support',
          '24/7 support',
          'Dedicated account manager',
        ],
        isPopular: false,
        sortOrder: 2,
      },
    ]);
    console.log('Default packages created');
  }

  // Create default projects
  const projectRepo = dataSource.getRepository(Project);
  const existingProjects = await projectRepo.count();
  
  if (existingProjects === 0) {
    await projectRepo.save([
      {
        title: 'E-Commerce Platform',
        description: 'A full-featured e-commerce platform with payment integration and inventory management.',
        tags: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
        isFeatured: true,
        sortOrder: 0,
      },
      {
        title: 'Healthcare Dashboard',
        description: 'Patient management system with appointment scheduling and medical records.',
        tags: ['React', 'TypeScript', 'GraphQL', 'AWS'],
        isFeatured: true,
        sortOrder: 1,
      },
      {
        title: 'Logistics App',
        description: 'Real-time tracking and fleet management mobile application.',
        tags: ['React Native', 'Firebase', 'Google Maps'],
        isFeatured: true,
        sortOrder: 2,
      },
      {
        title: 'SaaS Platform',
        description: 'Multi-tenant SaaS application with subscription billing.',
        tags: ['Next.js', 'Prisma', 'Stripe', 'Vercel'],
        isFeatured: false,
        sortOrder: 3,
      },
      {
        title: 'CRM System',
        description: 'Customer relationship management system with analytics.',
        tags: ['Vue.js', 'Laravel', 'MySQL'],
        isFeatured: false,
        sortOrder: 4,
      },
      {
        title: 'IoT Dashboard',
        description: 'Real-time monitoring dashboard for IoT devices.',
        tags: ['React', 'WebSocket', 'InfluxDB', 'Grafana'],
        isFeatured: false,
        sortOrder: 5,
      },
    ]);
    console.log('Default projects created');
  }

  await dataSource.destroy();
  console.log('Seed completed!');
}

seed().catch(console.error);

