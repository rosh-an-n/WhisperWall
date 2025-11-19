require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AdminUser = require('./src/models/AdminUser');
const Feedback = require('./src/models/Feedback');

const categories = ['Canteen', 'Academics', 'Hostel', 'Infrastructure', 'Transport', 'Other'];
const statuses = ['open', 'in-progress', 'resolved', 'closed'];

const sampleFeedback = [
  {
    title: 'Canteen Food Quality Needs Improvement',
    content: 'The food quality in the canteen has been declining. The prices are also quite high for the quality provided. Please look into this matter.',
    category: 'Canteen',
    tags: ['food', 'quality', 'pricing'],
    status: 'open',
    isPublic: true
  },
  {
    title: 'Library Opening Hours Extension Request',
    content: 'The library closes too early. Students need more time to study, especially during exam season. Request to extend library hours.',
    category: 'Academics',
    tags: ['library', 'hours', 'study'],
    status: 'open',
    isPublic: true
  },
  {
    title: 'Hostel WiFi Connection Issues',
    content: 'The WiFi in the hostel is very slow and frequently disconnects. This affects our online classes and assignments.',
    category: 'Hostel',
    tags: ['wifi', 'internet', 'connectivity'],
    status: 'in-progress',
    isPublic: true
  },
  {
    title: 'Parking Space Insufficient',
    content: 'There are not enough parking spaces for students. Many students have to park outside the campus which is not safe.',
    category: 'Infrastructure',
    tags: ['parking', 'safety'],
    status: 'open',
    isPublic: true
  },
  {
    title: 'Bus Service Timing Issues',
    content: 'The college bus service is not punctual. Students often miss classes due to bus delays.',
    category: 'Transport',
    tags: ['bus', 'timing', 'punctuality'],
    status: 'open',
    isPublic: true
  },
  {
    title: 'Canteen Menu Diversity',
    content: 'The canteen menu is very limited. Please add more vegetarian and healthy options.',
    category: 'Canteen',
    tags: ['menu', 'vegetarian', 'health'],
    status: 'resolved',
    isPublic: true
  },
  {
    title: 'Assignment Submission Portal Down',
    content: 'The online assignment submission portal has been down for 2 days. Please fix this urgently.',
    category: 'Academics',
    tags: ['portal', 'assignment', 'urgent'],
    status: 'resolved',
    isPublic: true
  },
  {
    title: 'Hostel Water Supply Problem',
    content: 'There is irregular water supply in the hostel. Water often runs out during morning hours.',
    category: 'Hostel',
    tags: ['water', 'supply'],
    status: 'in-progress',
    isPublic: true
  },
  {
    title: 'Lab Equipment Maintenance',
    content: 'Many computers in the computer lab are not working. They need repair or replacement.',
    category: 'Infrastructure',
    tags: ['lab', 'computers', 'maintenance'],
    status: 'open',
    isPublic: true
  },
  {
    title: 'Transport Fare Increase',
    content: 'The bus fare was increased without prior notice. Many students are facing financial difficulties.',
    category: 'Transport',
    tags: ['fare', 'pricing'],
    status: 'open',
    isPublic: true
  },
  {
    title: 'Canteen Queue Management',
    content: 'Long queues during lunch hours. Request to add more counters or improve service speed.',
    category: 'Canteen',
    tags: ['queue', 'service'],
    status: 'open',
    isPublic: true
  },
  {
    title: 'Course Material Availability',
    content: 'Study materials for some courses are not available in the library. Please restock them.',
    category: 'Academics',
    tags: ['library', 'materials', 'books'],
    status: 'open',
    isPublic: true
  },
  {
    title: 'Hostel Security Concerns',
    content: 'Security measures in the hostel need improvement. There have been incidents of unauthorized entry.',
    category: 'Hostel',
    tags: ['security', 'safety'],
    status: 'closed',
    isPublic: true
  },
  {
    title: 'Classroom Projector Issues',
    content: 'Many classroom projectors are not working properly. This affects teaching quality.',
    category: 'Infrastructure',
    tags: ['projector', 'classroom'],
    status: 'in-progress',
    isPublic: true
  },
  {
    title: 'Bus Route Optimization',
    content: 'The bus route does not cover all residential areas. Please add more pickup points.',
    category: 'Transport',
    tags: ['route', 'pickup'],
    status: 'open',
    isPublic: true
  },
  {
    title: 'Canteen Hygiene Standards',
    content: 'Canteen hygiene needs improvement. Please ensure proper cleaning and food safety measures.',
    category: 'Canteen',
    tags: ['hygiene', 'safety'],
    status: 'resolved',
    isPublic: true
  },
  {
    title: 'Exam Schedule Clarity',
    content: 'Exam schedules are announced very late. Students need more time to prepare.',
    category: 'Academics',
    tags: ['exam', 'schedule'],
    status: 'open',
    isPublic: true
  },
  {
    title: 'Hostel Room Maintenance',
    content: 'Many hostel rooms need maintenance. Leaks, broken fans, and other issues need immediate attention.',
    category: 'Hostel',
    tags: ['maintenance', 'rooms'],
    status: 'in-progress',
    isPublic: true
  },
  {
    title: 'Sports Facilities Upgrade',
    content: 'The sports facilities are outdated. Request for upgrade and maintenance of sports equipment.',
    category: 'Infrastructure',
    tags: ['sports', 'facilities'],
    status: 'open',
    isPublic: true
  },
  {
    title: 'Bus Safety Measures',
    content: 'Bus drivers sometimes drive recklessly. Please ensure proper safety measures and driver training.',
    category: 'Transport',
    tags: ['safety', 'drivers'],
    status: 'open',
    isPublic: true
  },
  {
    title: 'Canteen Payment Methods',
    content: 'Please add digital payment options in the canteen. Cash transactions are inconvenient.',
    category: 'Canteen',
    tags: ['payment', 'digital'],
    status: 'resolved',
    isPublic: true
  },
  {
    title: 'Faculty Availability',
    content: 'Faculty members are not available during office hours. Students face difficulty in getting guidance.',
    category: 'Academics',
    tags: ['faculty', 'office hours'],
    status: 'open',
    isPublic: true
  },
  {
    title: 'Hostel Common Area Facilities',
    content: 'The common areas in hostel need better furniture and facilities for students to relax and study.',
    category: 'Hostel',
    tags: ['common area', 'facilities'],
    status: 'open',
    isPublic: true
  },
  {
    title: 'Campus WiFi Coverage',
    content: 'WiFi coverage is poor in some areas of the campus. Please improve network coverage.',
    category: 'Infrastructure',
    tags: ['wifi', 'network'],
    status: 'in-progress',
    isPublic: true
  },
  {
    title: 'Transport Timetable',
    content: 'Please publish a clear timetable for bus services. Students need to plan their commute.',
    category: 'Transport',
    tags: ['timetable', 'schedule'],
    status: 'resolved',
    isPublic: true
  },
  {
    title: 'Canteen Student Discount',
    content: 'Request for student discount on canteen items. This will help students with limited budgets.',
    category: 'Canteen',
    tags: ['discount', 'pricing'],
    status: 'open',
    isPublic: true
  },
  {
    title: 'Online Lecture Recordings',
    content: 'Please provide recordings of online lectures for students who miss classes or want to review.',
    category: 'Academics',
    tags: ['lectures', 'recordings'],
    status: 'open',
    isPublic: true
  },
  {
    title: 'Hostel Laundry Services',
    content: 'The laundry service in hostel is expensive and slow. Please improve or provide alternatives.',
    category: 'Hostel',
    tags: ['laundry', 'services'],
    status: 'open',
    isPublic: true
  },
  {
    title: 'Building Accessibility',
    content: 'Some buildings are not accessible for students with disabilities. Please install ramps and elevators.',
    category: 'Infrastructure',
    tags: ['accessibility', 'disability'],
    status: 'open',
    isPublic: true
  },
  {
    title: 'Bus Capacity Issues',
    content: 'Buses are often overcrowded. Please add more buses or increase frequency during peak hours.',
    category: 'Transport',
    tags: ['capacity', 'crowding'],
    status: 'open',
    isPublic: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/whisperwall');
    console.log('Connected to MongoDB');

    // Clear existing data
    await AdminUser.deleteMany({});
    await Feedback.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = new AdminUser({
      name: 'Admin User',
      email: 'admin@college.edu',
      passwordHash: hashedPassword,
      role: 'admin'
    });
    await admin.save();
    console.log('Created admin user: admin@college.edu / password123');

    // Add some replies to random feedback entries
    const feedbackWithReplies = sampleFeedback.map((item, index) => {
      if (index % 3 === 0 && item.status !== 'open') {
        return {
          ...item,
          replies: [{
            message: 'Thank you for your feedback. We are looking into this matter and will update you soon.',
            public: true,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
          }]
        };
      }
      return item;
    });

    // Insert feedback
    await Feedback.insertMany(feedbackWithReplies);
    console.log(`Created ${sampleFeedback.length} sample feedback entries`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@college.edu');
    console.log('Password: password123');
    console.log('\nYou can now start the server and test the APIs.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();



