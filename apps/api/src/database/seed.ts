import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin, SiteSettings, Service, Package, Project } from './entities';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'website_db',
  entities: [Admin, SiteSettings, Service, Package, Project],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();
  console.log('Database connected');

  // Create default admin
  const adminRepo = dataSource.getRepository(Admin);
  const existingAdmin = await adminRepo.findOne({ where: { email: 'admin@example.com' } });
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await adminRepo.save({
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin',
    });
    console.log('Default admin created: admin@example.com / admin123');
  }

  // Create default settings
  const settingsRepo = dataSource.getRepository(SiteSettings);
  const existingSettings = await settingsRepo.findOne({ where: {} });
  
  if (!existingSettings) {
    await settingsRepo.save({
      siteName: 'YourName',
      tagline: 'Digital Transformation Expert',
      description: 'I help businesses digitize operations and solve problems with software.',
      heroTitle: 'Transform Your Business With Technology',
      heroSubtitle: 'I help businesses digitize operations, solve problems with software, and transition from traditional to systematic approaches.',
      aboutTitle: 'About Me',
      aboutDescription: 'With over 5 years of experience in software development and digital transformation, I help businesses modernize their operations and achieve their goals through technology.',
      email: 'hello@example.com',
      phone: '+1 234 567 890',
      whatsapp: '+1234567890',
      location: 'Remote / Worldwide',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/yourname',
        github: 'https://github.com/yourname',
        twitter: 'https://twitter.com/yourname',
      },
      stats: [
        { value: '5+', label: 'Years Experience' },
        { value: '50+', label: 'Projects Completed' },
        { value: '30+', label: 'Happy Clients' },
        { value: '99%', label: 'Satisfaction Rate' },
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

