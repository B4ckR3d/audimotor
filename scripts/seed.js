const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.car.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.heroSection.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.contactInfo.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.page.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.role.deleteMany();

  await prisma.role.createMany({
    data: [
      {
        name: 'admin',
        label: 'Admin (Full)',
        description: 'Akses penuh ke semua fitur',
        permissions: JSON.stringify({ hero: 'write', features: 'write', gallery: 'write', testimonials: 'write', promotions: 'write', pages: 'write', contact: 'write', social: 'write', cars: 'write', users: 'write', roles: 'write', settings: 'write' }),
      },
      {
        name: 'editor',
        label: 'Editor',
        description: 'Bisa mengelola konten dan mobil',
        permissions: JSON.stringify({ hero: 'write', features: 'write', gallery: 'write', testimonials: 'write', promotions: 'write', pages: 'write', contact: 'write', social: 'write', cars: 'write', users: 'none', roles: 'none', settings: 'none' }),
      },
    ],
  });

  const adminPasswordHash = hashPassword('admin123');
  await prisma.user.create({
    data: {
      username: 'admin',
      password_hash: adminPasswordHash,
      full_name: 'Administrator',
      role: 'admin',
      is_active: 1,
    },
  });

  await prisma.car.createMany({
    data: [
      {
        name: 'Alphard', brand: 'Toyota', model: '2.5 G AT', year: 2021, price: 985000000,
        mileage: 32000, transmission: 'Automatic', fuel: 'Bensin', color: 'Hitam Metalik',
        description: 'Toyota Alphard 2.5 G AT tahun 2021 dengan kondisi premium. Interior terawat, AC dingin, audio system original, dan complete service history.',
        image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        status: 'available', is_featured: 1,
      },
      {
        name: 'Innova Zenix', brand: 'Toyota', model: '2.0 Q HV CVT', year: 2023, price: 580000000,
        mileage: 15000, transmission: 'CVT', fuel: 'Hybrid', color: 'Putih',
        description: 'Toyota Innova Zenix Hybrid 2.0 Q HV CVT. Irit bahan bakar berkat teknologi hybrid. Kondisi masih seperti baru.',
        image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        status: 'available', is_featured: 1,
      },
      {
        name: 'Pajero Sport', brand: 'Mitsubishi', model: 'Dakar 2.4 AT', year: 2020, price: 485000000,
        mileage: 45000, transmission: 'Automatic', fuel: 'Diesel', color: 'Abu-abu',
        description: 'Mitsubishi Pajero Sport Dakar 2.4 AT. Mesin diesel bertenaga, cocok untuk perjalanan jauh dan medan berat.',
        image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        status: 'available', is_featured: 0,
      },
    ],
  });

  await prisma.siteSetting.createMany({
    data: [
      { setting_key: 'site_name', setting_value: 'Audi Motor', setting_type: 'text', setting_group: 'general' },
      { setting_key: 'site_tagline', setting_value: 'Dealer Mobil Keluarga Terpercaya', setting_type: 'text', setting_group: 'general' },
      { setting_key: 'site_description', setting_value: 'Spesialis mobil keluarga bekas berkualitas premium.', setting_type: 'textarea', setting_group: 'general' },
      { setting_key: 'whatsapp_number', setting_value: '6281329400272', setting_type: 'text', setting_group: 'contact' },
      { setting_key: 'email', setting_value: 'info@audimotor.com', setting_type: 'text', setting_group: 'contact' },
      { setting_key: 'address', setting_value: 'Dsn. Bero 001/001, Ds. Caruban, Kec. Kandangan, Kabupaten Temanggung, Jawa Tengah 56281', setting_type: 'textarea', setting_group: 'contact' },
    ],
  });

  await prisma.heroSection.create({
    data: {
      title: 'Masa Depan Keluarga Anda Dimulai di Sini.',
      subtitle: 'Kami menghadirkan koleksi mobil bekas premium, terawat, dan berkualitas tinggi khusus untuk kenyamanan dan keamanan perjalanan keluarga Anda.',
      badge: 'Dealer Mobil Keluarga Terpercaya',
      button_primary_text: 'Lihat Koleksi',
      button_primary_link: '/#koleksi',
      button_secondary_text: 'Konsultasi WA',
      button_secondary_link: 'https://wa.me/6281329400272',
      background_image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      is_active: 1,
    },
  });

  await prisma.feature.createMany({
    data: [
      { icon: 'fa-shield-alt', title: 'Inspeksi Ketat', description: 'Setiap unit melewati 150+ titik inspeksi standar dealer resmi. Menjamin keamanan dan performa maksimal.', sort_order: 1, is_active: 1 },
      { icon: 'fa-file-contract', title: 'Dokumen Terjamin', description: 'Legalitas surat-surat kendaraan terverifikasi 100%. Bebas masalah hukum dan pajak terurus rapi.', sort_order: 2, is_active: 1 },
      { icon: 'fa-hand-holding-usd', title: 'Harga Transparan', description: 'Tanpa biaya tersembunyi. Kami menyediakan opsi kredit dengan bunga kompetitif dan proses cepat.', sort_order: 3, is_active: 1 },
    ],
  });

  await prisma.contactInfo.createMany({
    data: [
      { contact_type: 'address', contact_value: 'Dsn. Bero 001/001, Ds. Caruban, Kec. Kandangan, Kabupaten Temanggung, Jawa Tengah 56281', label: 'Alamat Showroom', sort_order: 1, is_active: 1 },
      { contact_type: 'whatsapp', contact_value: '0813-2940-0272', label: 'WhatsApp', sort_order: 2, is_active: 1 },
    ],
  });

  await prisma.socialLink.createMany({
    data: [
      { platform: 'instagram', url: 'https://www.instagram.com/audimotor_?igsh=YjV5dmM5NmU4a2Uy', icon: 'fab fa-instagram', sort_order: 1, is_active: 1 },
      { platform: 'facebook', url: 'https://www.facebook.com/share/1R4ZqEzk62/', icon: 'fab fa-facebook-f', sort_order: 2, is_active: 1 },
    ],
  });

  console.log('Seed berhasil!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
