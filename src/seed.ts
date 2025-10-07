import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import utc  from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  try {
    console.log("Creating roles...");
    await prisma.role.createMany({
      data: [{ name: "Owner" }, { name: "Kasir" }, { name: "Pelanggan" }],
      skipDuplicates: true,
    });
    console.log("✅ Roles created");

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash("owner123", 10);
    console.log("✅ Password hashed");

    const now = dayjs().tz("Asia/Jakarta").toDate();

    console.log("Creating owner user...");
    await prisma.user.create({
      data: {
        name: "Owner Utama",
        email: "owner@opakopi.com",
        password: hashedPassword,
        role_id: 1,
        status: "Aktif",
        email_verified_at: now,
      },
    });
    console.log("✅ Owner user created");

    console.log("Creating tables...");
    const tables = Array.from({ length: 10 }).map((_, i) => ({
      number: i + 1,
      status: "available",
    }));

    await prisma.table.createMany({
      data: tables,
      skipDuplicates: true,
    });
    console.log("✅ Tables created");

    console.log("✨ Seed completed successfully!");
    const menuCategory = [
        {
            name : "Menu Ayam"
        },
        {
            name : "Mie"
        },
        {
            name : "Seafood"
        },
        {
            name : "Sayur dan Lauk"
        },
        {
            name: "Camilan"
        },
        {
            name: "Minuman"
        },
        {
            name: "Cofee"
        },
        {
            name: "Thai Tea"
        },
        {
            name: "Milk Based"
        }
    ]
    await prisma.menu_categories.createMany({
        data: menuCategory,
        skipDuplicates: true,
    })
    console.log("✅ Menu categories created");
    const menu = [
        {
            category_id : 1,
            name : "Chicken Ricebowl Original",
            description : "Ricebowl dengan topping ayam goreng crispy, saus original, dan sayuran segar.",
            image_url : "uploads/menus/chicken_ricebowl_original.jpg",
            current_price : 27000,
            current_cogs : 15000,
            status : "Tersedia"
        },
        {
            category_id : 1,
            name : "Chicken Ricebowl Spicy",
            description : "Ricebowl dengan topping ayam goreng crispy, saus spicy, dan sayuran segar.",
            image_url : "uploads/menus/chicken_ricebowl_spicy.jpg",
            current_price : 27000,
            current_cogs : 15000,
            status : "Tersedia"
        },
        {
            category_id : 1,
            name : "Chicken Ricebowl Sambal Matah",
            description : "Ricebowl dengan topping ayam goreng crispy, sambal matah, dan sayuran segar.",
            image_url : "uploads/menus/chicken_ricebowl_sambal_matah.jpg",
            current_price : 27000,
            current_cogs : 15000,
            status : "Tersedia"
        },
        {
            category_id : 1,
            name : "Ayam Goreng + Nasi",
            description : "Ayam goreng crispy dengan nasi putih hangat dan sambal.",
            image_url : "uploads/menus/ayam_goreng_nasi.jpg",
            current_price : 28000,
            current_cogs : 16000,
            status : "Tersedia"
        },
        {
            category_id : 1,
            name : "Ayam Bakar + Nasi",
            description : "Ayam bakar dengan nasi putih hangat dan sambal.",
            image_url : "uploads/menus/ayam_bakar_nasi.jpg",
            current_price : 28000,
            current_cogs : 16000,
            status : "Tersedia"
        },
        {
            category_id : 1,
            name : "Ayam Crispy + Nasi",
            description : "Ayam crispy dengan nasi putih hangat dan sambal.",
            image_url : "uploads/menus/ayam_crispy_nasi.jpg",
            current_price : 28000,
            current_cogs : 16000,
            status : "Tersedia"
        },
        {
            category_id : 1,
            name : "Ayam Geprek + Nasi",
            description : "Ayam geprek dengan nasi putih hangat dan sambal.",
            image_url : "uploads/menus/ayam_geprek_nasi.jpg",
            current_price : 28000,
            current_cogs : 16000,
            status : "Tersedia"
        },
        {
            category_id : 1,
            name : "Ayam Saus Mentega + Nasi",
            description : "Ayam saus mentega dengan nasi putih hangat dan sambal.",
            image_url : "uploads/menus/ayam_saus_mentega_nasi.jpg",
            current_price : 30000,
            current_cogs : 20000,
            status : "Tersedia"
        },
        {
            category_id : 1,
            name : "Chicken Blackpepper + Nasi",
            description : "Ayam blackpepper dengan nasi putih hangat dan sambal.",
            image_url : "uploads/menus/chicken_blackpepper_nasi.jpg",
            current_price : 30000,
            current_cogs : 20000,
            status : "Tersedia"
        },
        {
            category_id : 1,
            name : "Chicken Teriyaki + Nasi",
            description : "Ayam teriyaki dengan nasi putih hangat dan sambal.",
            image_url : "uploads/menus/chicken_teriyaki_nasi.jpg",
            current_price : 30000,
            current_cogs : 20000,
            status : "Tersedia"
        },
        {
            category_id : 1,
            name : "Chicken Katsu + Nasi",
            description : "Chicken katsu dengan nasi putih hangat dan sambal.",
            image_url : "uploads/menus/chicken_katsu_nasi.jpg",
            current_price : 30000,
            current_cogs : 20000,
            status : "Tersedia"
        },
        {
            category_id : 2,
            name : "Bihun Goreng",
            description : "Bihun goreng dengan sayuran dan telur.",
            image_url : "uploads/menus/bihun_goreng.jpg",
            current_price : 25000,
            current_cogs : 15000,
            status : "Tersedia"
        },
        {
            category_id : 2,
            name:"Bihun Rebus",
            description : "Bihun rebus dengan sayuran dan telur.",
            image_url : "uploads/menus/bihun_rebus.jpg",
            current_price : 25000,
            current_cogs : 15000,
            status : "Tersedia"
        },
        {
            category_id : 2,
            name: "Spaghetti Bolognese",
            description : "Spaghetti dengan saus bolognese dan daging cincang.",
            image_url : "uploads/menus/spaghetti_bolognese.jpg",
            current_price : 24000,
            current_cogs : 14000,
            status : "Tersedia"
        },
        {
            category_id : 2,
            name : "Kwetiaw Goreng",
            description : "Kwetiaw goreng dengan sayuran dan telur.",
            image_url : "uploads/menus/kwetiaw_goreng.jpg",
            current_price : 25000,
            current_cogs : 15000,
            status : "Tersedia"
        },
        {
            category_id : 2,
            name : "Mie Jowo Goreng",
            description : "Mie jowo goreng dengan sayuran dan telur.",
            image_url : "uploads/menus/mie_jowo_goreng.jpg",
            current_price : 25000,
            current_cogs : 15000,
            status : "Tersedia"
        },
        {
            category_id : 2,
            name : "Mie Jowo Rebus",
            description : "Mie jowo rebus dengan sayuran dan telur.",
            image_url : "uploads/menus/mie_jowo_rebus.jpg",
            current_price : 25000,
            current_cogs : 15000,
            status : "Tersedia"
        },
        {
            category_id : 2,
            name : "Nasi Goreng Jowo",
            description : "Nasi goreng jowo dengan sayuran dan telur.",
            image_url : "uploads/menus/nasi_goreng_jowo.jpg",
            current_price : 25000,
            current_cogs : 15000,
            status : "Tersedia"
        },
        {
            category_id : 2,
            name : "Capcay Rebus",
            description : "Capcay rebus dengan sayuran segar.",
            image_url : "uploads/menus/capcay_rebus.jpg",
            current_price : 25000,
            current_cogs : 15000,
            status : "Tersedia"
        },
        {
            category_id : 2,
            name : "Mie Goreng Oriental",
            description : "Mie goreng oriental dengan sayuran dan telur.",
            image_url : "uploads/menus/mie_goreng_oriental.jpg",
            current_price : 28000,
            current_cogs : 18000,
            status : "Tersedia"
        },
        {
            category_id : 2,
            name : "nasi Goreng Oriental",
            description : "Nasi goreng oriental dengan sayuran dan telur.",
            image_url : "uploads/menus/nasi_goreng_oriental.jpg",
            current_price : 28000,
            current_cogs : 18000,
            status : "Tersedia"
        },
        {
            category_id : 2,
            name : "Capcay Goreng",
            description : "Capcay goreng dengan sayuran dan telur.",
            image_url : "uploads/menus/capcay_goreng.jpg",
            current_price : 25000,
            current_cogs : 15000,
            status : "Tersedia"
        },
        {
            category_id : 3,
            name: "Wader Crispy + Nasi",
            description : "Wader crispy dengan nasi.",
            image_url : "uploads/menus/wader_crispy_nasi.jpg",
            current_price : 24000,
            current_cogs : 15000,
            status : "Tersedia"
        },
        {
            category_id : 3,
            name : "Nila Goreng + Nasi",
            description : "Nila goreng dengan nasi.",
            image_url : "uploads/menus/nila_goreng_nasi.jpg",
            current_price : 33000,
            current_cogs : 20000,
            status : "Tersedia"
        },
        {
            category_id : 3,
            name : "Nila Bakar + Nasi",
            description : "Nila bakar dengan nasi.",
            image_url : "uploads/menus/nila_bakar_nasi.jpg",
            current_price : 33000,
            current_cogs : 20000,
            status : "Tersedia"
        },
        {
            category_id : 3,
            name : "Udang Goreng tepung + Nasi",
            description : "Udang goreng tepung dengan nasi.",
            image_url : "uploads/menus/udang_goreng_tepung_nasi.jpg",
            current_price : 45000,
            current_cogs : 30000,
            status : "Tersedia"
        },
        {
            category_id : 3,
            name : "Udang saus Asam Manis + Nasi",
            description : "Udang saus asam manis dengan nasi.",
            image_url : "uploads/menus/udang_saus_asam_manis_nasi.jpg",
            current_price : 45000,
            current_cogs : 30000,
            status : "Tersedia"
        },
        {
            category_id : 3,
            name : "Cumi Goreng Tepung + Nasi",
            description : "Cumi goreng tepung dengan nasi.",
            image_url : "uploads/menus/cumi_goreng_tepung_nasi.jpg",
            current_price : 45000,
            current_cogs : 30000,
            status : "Tersedia"
        },
        {
            category_id : 3,
            name : "Gurame Goreng",
            description : "Gurame goreng dengan olahan khas.",
            image_url : "uploads/menus/gurame_goreng.jpg",
            current_price : 120000,
            current_cogs : 80000,
            status : "Tersedia"
        },
        {
            category_id : 3,
            name : "Gurame Crispy Asam Manis",
            description : "Gurame crispy asam manis dengan olahan khas.",
            image_url : "uploads/menus/gurame_crispy_asam_manis.jpg",
            current_price : 130000,
            current_cogs : 90000,
            status : "Tersedia"
        },
        {
            category_id : 3,
            name : "Gurame Bakar",
            description : "Gurame bakar dengan olahan khas.",
            image_url : "uploads/menus/gurame_bakar.jpg",
            current_price : 120000,
            current_cogs : 80000,
            status : "Tersedia"
        },
        {
            category_id : 4,
            name : "Tempe Kemul",
            description : "Tempe kemul dengan bumbu khas.",
            image_url : "uploads/menus/tempe_kemul.jpg",
            current_price : 11000,
            current_cogs : 7000,
            status : "Tersedia"
        },
        {
            category_id : 4,
            name : "Tempe Bakar",
            description : "Tempe bakar dengan bumbu khas.",
            image_url : "uploads/menus/tempe_bakar.jpg",
            current_price : 11000,
            current_cogs : 7000,
            status : "Tersedia"
        },
        {
            category_id : 4,
            name : "Tahu Goreng",
            description : "Tahu goreng dengan bumbu khas.",
            image_url : "uploads/menus/tahu_goreng.jpg",
            current_price : 11000,
            current_cogs : 7000,
            status : "Tersedia"
        },
        {
            category_id : 4,
            name : "Cah Kangkung",
            description : "Cah kangkung dengan bumbu khas.",
            image_url : "uploads/menus/cah_kangkung.jpg",
            current_price : 12000,
            current_cogs : 8000,
            status : "Tersedia"
        },
        {
            category_id : 4,
            name : "Omlete Sayur",
            description : "Omlete sayur dengan bumbu khas.",
            image_url : "uploads/menus/omlete_sayur.jpg",
            current_price : 16000,
            current_cogs : 10000,
            status : "Tersedia"
        },
        {
            category_id : 4,
            name : "Tumis Jamur",
            description : "Tumis jamur dengan bumbu khas.",
            image_url : "uploads/menus/tumis_jamur.jpg",
            current_price : 16000,
            current_cogs : 10000,
            status : "Tersedia"
        },
        {
            category_id : 5,
            name : "Rondo Royal",
            description : "Rondo royal dengan isian coklat dan keju.",
            image_url : "uploads/menus/rondo_royal.jpg",
            current_price : 15000,
            current_cogs : 8000,
            status : "Tersedia"
        },
        {
            category_id : 5,
            name : "Piscok Lumer",
            description : "Piscok lumer dengan isian coklat.",
            image_url : "uploads/menus/piscok_lumer.jpg",
            current_price : 15000,
            current_cogs : 8000,
            status : "Tersedia"
        },
        {
            category_id : 5,
            name : "Combro",
            description : "Combro dengan isian oncom pedas.",
            image_url : "uploads/menus/combro.jpg",
            current_price : 15000,
            current_cogs : 8000,
            status : "Tersedia"
        },
        {
            category_id : 5,
            name : "Gethuk Goreng",
            description : "Gethuk goreng dengan rasa manis dan gurih.",
            image_url : "uploads/menus/gethuk_goreng.jpg",
            current_price : 15000,
            current_cogs : 8000,
            status : "Tersedia"
        },
        {
            category_id : 5,
            name : "Cothot Goreng",
            description : "Cothot goreng dengan isian singkong dan kelapa.",
            image_url : "uploads/menus/cothot_goreng.jpg",
            current_price : 15000,
            current_cogs : 8000,
            status : "Tersedia"
        },
        {
            category_id : 5,
            name : "Tahu Crispy",
            description : "Tahu crispy dengan balutan tepung crispy.",
            image_url : "uploads/menus/tahu_crispy.jpg",
            current_price : 15000,
            current_cogs : 8000,
            status : "Tersedia"
        },
        {
            category_id : 5,
            name : "Timus Ubi Ungu",
            description : "Timus ubi ungu dengan rasa manis.",
            image_url : "uploads/menus/timus_ubi_ungu.jpg",
            current_price : 15000,
            current_cogs : 8000,
            status : "Tersedia"
        },
        {
            category_id : 5,
            name : "Pisang Goreng",
            description : "Pisang goreng dengan balutan tepung crispy.",
            image_url : "uploads/menus/pisang_goreng.jpg",
            current_price : 15000,
            current_cogs : 8000,
            status : "Tersedia"
        },
        {
            category_id : 5,
            name : "Lumpia Sayur",
            description : "Lumpia sayur dengan isian sayuran segar.",
            image_url : "uploads/menus/lumpia_sayur.jpg",
            current_price : 15000,
            current_cogs : 8000,
            status : "Tersedia"
        },
        {
            category_id : 5,
            name : "Singkong Goreng",
            description : "Singkong goreng dengan balutan tepung crispy.",
            image_url : "uploads/menus/singkong_goreng.jpg",
            current_price : 15000,
            current_cogs : 8000,
            status : "Tersedia"
        },
        {
            category_id : 5,
            name : "Risol Mayo",
            description : "Risol mayo dengan isian mayo dan sayuran.",
            image_url : "uploads/menus/risol_mayo.jpg",
            current_price : 15000,
            current_cogs : 8000,
            status : "Tersedia"
        },
        {
            category_id : 5,
            name : "Banana Bites",
            description : "Banana bites dengan isian pisang dan coklat.",
            image_url : "uploads/menus/banana_bites.jpg",
            current_price : 15000,
            current_cogs : 8000,
            status : "Tersedia"
        },
        {
            category_id : 5,
            name : "Dimsum",
            description : "Dimsum dengan isian ayam dan udang.",
            image_url : "uploads/menus/dimsum.jpg",
            current_price : 15000,
            current_cogs : 8000,
            status : "Tersedia"
        },
        {
            category_id : 5,
            name : "Tela - Tela Balado",
            description : "Tela - tela balado dengan isian singkong dan bumbu balado.",
            image_url : "uploads/menus/tela_tela_balado.jpg",
            current_price : 15000,
            current_cogs : 8000,
            status : "Tersedia"
        },
        {
            category_id : 5,
            name : "Jamur Crispy",
            description : "Jamur crispy dengan balutan tepung crispy.",
            image_url : "uploads/menus/jamur_crispy.jpg",
            current_price : 18000,
            current_cogs : 8000,
            status : "Tersedia"
        },
        {
            category_id : 5,
            name : "Onion Ring",
            description : "Onion ring dengan balutan tepung crispy.",
            image_url : "uploads/menus/onion_ring.jpg",
            current_price : 20000,
            current_cogs : 10000,
            status : "Tersedia"
        },
        {
            category_id : 5,
            name : "French Fries",
            description : "French fries dengan balutan tepung crispy.",
            image_url : "uploads/menus/french_fries.jpg",
            current_price : 20000,
            current_cogs : 10000,
            status : "Tersedia"
        },
        {
            category_id : 6,
            name : "Teh (Panas/Dingin)",
            description : "Teh dengan pilihan panas atau dingin.",
            image_url : "uploads/menus/teh.jpg",
            current_price : 7000,
            current_cogs : 3000,
            status : "Tersedia"
        },
        {
            category_id : 6,
            name : "Jeruk (Panas/Dingin)",
            description : "Jeruk dengan pilihan panas atau dingin.",
            image_url : "uploads/menus/jeruk.jpg",
            current_price : 8000,
            current_cogs : 3000,
            status : "Tersedia"
        },
        {
            category_id : 6,
            name : "Es Lemon Tea",
            description : "Es lemon tea yang segar.",
            image_url : "uploads/menus/es_lemon_tea.jpg",
            current_price : 10000,
            current_cogs : 6000,
            status : "Tersedia"
        },
        {
            category_id : 6,
            name : "Lemon Squash",
            description : "Lemon squash yang segar.",
            image_url : "uploads/menus/lemon_squash.jpg",
            current_price : 15000,
            current_cogs : 8000,
            status : "Tersedia"
        },
        {
            category_id : 6,
            name : "Es Teh Tarik",
            description : "Es teh tarik yang creamy.",
            image_url : "uploads/menus/es_teh_tarik.jpg",
            current_price : 14000,
            current_cogs : 9000,
            status : "Tersedia"
        },
        {
            category_id : 6,
            name : "Wedang Gula Asem",
            description : "Wedang gula asem yang hangat.",
            image_url : "uploads/menus/wedang_gula_asem.jpg",
            current_price : 15000,
            current_cogs : 9000,
            status : "Tersedia"
        },
        {
            category_id : 6,
            name : "Wedang Kunir Asem",
            description : "Wedang kunir asem yang hangat.",
            image_url : "uploads/menus/wedang_kunir_asem.jpg",
            current_price : 15000,
            current_cogs : 9000,
            status : "Tersedia"
        },
        {
            category_id : 6,
            name : "Wedang Beras Kencur",
            description : "Wedang beras kencur yang hangat.",
            image_url : "uploads/menus/wedang_beras_kencur.jpg",
            current_price : 15000,
            current_cogs : 9000,
            status : "Tersedia"
        },
        {
            category_id : 6,
            name : "Wedang Bajigur",
            description : "Wedang bajigur yang hangat.",
            image_url : "uploads/menus/wedang_bajigur.jpg",
            current_price : 15000,
            current_cogs : 9000,
            status : "Tersedia"
        },
        {
            category_id : 6,
            name : "Wedang Uwuh",
            description : "Wedang uwuh yang hangat.",
            image_url : "uploads/menus/wedang_uwuh.jpg",
            current_price : 15000,
            current_cogs : 9000,
            status : "Tersedia"
        },
        {
            category_id : 6,
            name : "Orange Squash",
            description : "Orange squash yang segar.",
            image_url : "uploads/menus/orange_squash.jpg",
            current_price : 16000,
            current_cogs : 9000,
            status : "Tersedia"
        },
        {
            category_id : 6,
            name : "Blue Ocean Squash",
            description : "Blue ocean squash yang segar.",
            image_url : "uploads/menus/blue_ocean_squash.jpg",
            current_price : 16000,
            current_cogs : 9000,
            status : "Tersedia"
        },
        {
            category_id : 6,
            name : "Lychee Tea",
            description : "Lychee tea yang segar.",
            image_url : "uploads/menus/lychee_tea.jpg",
            current_price : 20000,
            current_cogs : 14000,
            status : "Tersedia"
        },
        {
            category_id : 7,
            name : "Americano Iced",
            description : "Kopi americano dingin yang menyegarkan.",
            image_url : "uploads/menus/americano_iced.jpg",
            current_price : 18000,
            current_cogs : 12000,
            status : "Tersedia"
        },
        {
            category_id : 7,
            name : "Cappuccino Iced",
            description : "Kopi cappuccino dingin yang creamy.",
            image_url : "uploads/menus/cappuccino_iced.jpg",
            current_price : 19000,
            current_cogs : 13000,
            status : "Tersedia"
        },
        {
            category_id : 7,
            name : "Coffee Latte Iced",
            description : "Kopi coffee latte dingin yang creamy.",
            image_url : "uploads/menus/coffee_latte_iced.jpg",
            current_price : 19000,
            current_cogs : 14000,
            status : "Tersedia"
        },
        {
            category_id : 7,
            name : "Mocha Latte Iced",
            description : "Kopi mocha latte dingin yang creamy.",
            image_url : "uploads/menus/mocha_latte_iced.jpg",
            current_price : 20000,
            current_cogs : 14000,
            status : "Tersedia"
        },
        {
            category_id : 7,
            name : "Es Kopi Susu Opak",
            description : "Kopi susu dingin dengan cita rasa khas Opak.",
            image_url : "uploads/menus/es_kopi_susu_opak.jpg",
            current_price : 20000,
            current_cogs : 14000,
            status : "Tersedia"
        },
        {
            category_id : 7,
            name : "Es Kopi Susu Gula Aren",
            description : "Kopi susu dingin dengan gula aren yang manis.",
            image_url : "uploads/menus/es_kopi_susu_gula_aren.jpg",
            current_price : 20000,
            current_cogs : 14000,
            status : "Tersedia"
        },
        {
            category_id : 7,
            name : "Es Kopi Susu Pandan",
            description : "Kopi susu dingin dengan aroma pandan yang harum.",
            image_url : "uploads/menus/es_kopi_susu_pandan.jpg",
            current_price : 20000,
            current_cogs : 14000,
            status : "Tersedia"
        },
        {
            category_id : 7,
            name : "Es Kopi Susu Caramel",
            description : "Kopi susu dingin dengan rasa caramel yang manis.",
            image_url : "uploads/menus/es_kopi_susu_caramel.jpg",
            current_price : 20000,
            current_cogs : 14000,
            status : "Tersedia"
        },
        {
            category_id : 7,
            name : "Es Kopi Susu Hazelnut",
            description : "Kopi susu dingin dengan rasa hazelnut yang lezat.",
            image_url : "uploads/menus/es_kopi_susu_hazelnut.jpg",
            current_price : 20000,
            current_cogs : 14000,
            status : "Tersedia"
        },
        {
            category_id : 7,
            name  : "Es Kopi Susu Vanilla",
            description : "Kopi susu dingin dengan rasa vanilla yang harum.",
            image_url : "uploads/menus/es_kopi_susu_vanilla.jpg",
            current_price : 20000,
            current_cogs : 14000,
            status : "Tersedia"
        },
        {
            category_id : 7,
            name : "Es Kopi Susu Banana",
            description : "Kopi susu dingin dengan rasa pisang yang manis.",
            image_url : "uploads/menus/es_kopi_susu_banana.jpg",
            current_price : 20000,
            current_cogs : 14000,
            status : "Tersedia"
        },
        {
            category_id : 7,
            name : "Pastika",
            description : "Kopi dengan campuran mocktail pastika.",
            image_url : "uploads/menus/pastika.jpg",
            current_price : 20000,
            current_cogs : 14000,
            status : "Tersedia"
        },
        {
            category_id : 7,
            name : "Pelemsari",
            description : "Kopi dengan campuran mocktail pelemsari.",
            image_url : "uploads/menus/pelemsari.jpg",
            current_price : 20000,
            current_cogs : 14000,
            status : "Tersedia"
        },
        {
            category_id : 8,
            name : "Thai Tea Original Iced",
            description : "Thai tea original dingin yang menyegarkan.",
            image_url : "uploads/menus/thai_tea_original_iced.jpg",
            current_price : 16000,
            current_cogs : 10000,
            status : "Tersedia"
        },
        {
            category_id : 8,
            name : "Thai Green Tea Iced",
            description : "Thai green tea dingin yang menyegarkan.",
            image_url : "uploads/menus/thai_green_tea_iced.jpg",
            current_price : 16000,
            current_cogs : 10000,
            status : "Tersedia"
        },
        {
            category_id : 8,
            name : "Thai Tea Coffee Iced",
            description : "Thai tea coffee dingin yang menyegarkan.",
            image_url : "uploads/menus/thai_tea_coffee_iced.jpg",
            current_price : 16000,
            current_cogs : 10000,
            status : "Tersedia"
        },
        {
            category_id : 8,
            name : "Thai Green Tea Milo Iced",
            description : "Thai green tea milo dingin yang menyegarkan.",
            image_url : "uploads/menus/thai_green_tea_milo_iced.jpg",
            current_price : 16000,
            current_cogs : 10000,
            status : "Tersedia"
        },
        {
            category_id : 9,
            name : "Taro Latte Iced",
            description : "Taro latte dingin yang creamy.",
            image_url : "uploads/menus/taro_latte_iced.jpg",
            current_price : 17000,
            current_cogs : 11000,
            status : "Tersedia"
        },
        {
            category_id : 9,
            name : "Chocolate Iced",
            description : "Chocolate dingin yang creamy.",
            image_url : "uploads/menus/chocolate_iced.jpg",
            current_price : 17000,
            current_cogs : 12000,
            status : "Tersedia"
        },
        {
            category_id : 9,
            name : "Matcha Latte Iced",
            description : "Matcha latte dingin yang creamy.",
            image_url : "uploads/menus/matcha_latte_iced.jpg",
            current_price : 20000,
            current_cogs : 14000,
            status : "Tersedia"
        },
        {
            category_id : 9,
            name : "Banana Chocolate Iced",
            description : "Banana chocolate dingin yang creamy.",
            image_url : "uploads/menus/banana_chocolate_iced.jpg",
            current_price : 20000,
            current_cogs : 14000,
            status : "Tersedia"
        },
        {
            category_id : 9,
            name : "Chocolate Hazelnut Iced",
            description : "Chocolate hazelnut dingin yang creamy.",
            image_url : "uploads/menus/chocolate_hazelnut_iced.jpg",
            current_price : 20000,
            current_cogs : 14000,
            status : "Tersedia"
        }

    ]
    await prisma.menu.createMany({
        data: menu,
        skipDuplicates: true,
    })
  } catch (error) {
    console.error("❌ Error during seed:", error);
    throw error;
  }
}

main()
  .then(async () => {
    console.log("Disconnecting from database...");
    await prisma.$disconnect();
    console.log("✅ Disconnected");
  })
  .catch(async (e) => {
    console.error("❌ Fatal error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });