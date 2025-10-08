var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc);
dayjs.extend(timezone);
const prisma = new PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🌱 Starting seed...");
        try {
            console.log("Creating roles...");
            yield prisma.role.createMany({
                data: [{ name: "Owner" }, { name: "Kasir" }, { name: "Pelanggan" }],
                skipDuplicates: true,
            });
            console.log("✅ Roles created");
            console.log("Hashing password...");
            const hashedPassword = yield bcrypt.hash("owner123", 10);
            console.log("✅ Password hashed");
            const now = dayjs().tz("Asia/Jakarta").toDate();
            console.log("Creating owner user...");
            yield prisma.user.create({
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
            yield prisma.table.createMany({
                data: tables,
                skipDuplicates: true,
            });
            console.log("✅ Tables created");
            console.log("✨ Seed completed successfully!");
            const menuCategory = [
                {
                    name: "Menu Ayam"
                },
                {
                    name: "Mie"
                },
                {
                    name: "Seafood"
                },
                {
                    name: "Sayur dan Lauk"
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
            ];
            yield prisma.menu_categories.createMany({
                data: menuCategory,
                skipDuplicates: true,
            });
            console.log("✅ Menu categories created");
            const menu = [
                {
                    category_id: 1,
                    name: "Chicken Ricebowl Original",
                    description: "Ricebowl dengan topping ayam goreng crispy, saus original, dan sayuran segar.",
                    image_url: "uploads/products/product-1759839926843-964710415.PNG",
                    current_price: 27000,
                    current_cogs: 15000,
                    status: "Tersedia"
                },
                {
                    category_id: 1,
                    name: "Chicken Ricebowl Spicy",
                    description: "Ricebowl dengan topping ayam goreng crispy, saus spicy, dan sayuran segar.",
                    image_url: "uploads/products/product-1759839934804-360614160.PNG",
                    current_price: 27000,
                    current_cogs: 15000,
                    status: "Tersedia"
                },
                {
                    category_id: 1,
                    name: "Chicken Ricebowl Sambal Matah",
                    description: "Ricebowl dengan topping ayam goreng crispy, sambal matah, dan sayuran segar.",
                    image_url: "uploads/products/product-1759839942819-616876747.PNG",
                    current_price: 27000,
                    current_cogs: 15000,
                    status: "Tersedia"
                },
                {
                    category_id: 1,
                    name: "Ayam Goreng + Nasi",
                    description: "Ayam goreng crispy dengan nasi putih hangat dan sambal.",
                    image_url: "uploads/products/product-1759839953153-994685441.PNG",
                    current_price: 28000,
                    current_cogs: 16000,
                    status: "Tersedia"
                },
                {
                    category_id: 1,
                    name: "Ayam Bakar + Nasi",
                    description: "Ayam bakar dengan nasi putih hangat dan sambal.",
                    image_url: "uploads/products/product-1759839994345-27777683.PNG",
                    current_price: 28000,
                    current_cogs: 16000,
                    status: "Tersedia"
                },
                {
                    category_id: 1,
                    name: "Ayam Crispy + Nasi",
                    description: "Ayam crispy dengan nasi putih hangat dan sambal.",
                    image_url: "uploads/products/product-1759840003790-409272380.PNG",
                    current_price: 28000,
                    current_cogs: 16000,
                    status: "Tersedia"
                },
                {
                    category_id: 1,
                    name: "Ayam Geprek + Nasi",
                    description: "Ayam geprek dengan nasi putih hangat dan sambal.",
                    image_url: "uploads/products/product-1759840010562-544437157.PNG",
                    current_price: 28000,
                    current_cogs: 16000,
                    status: "Tersedia"
                },
                {
                    category_id: 1,
                    name: "Ayam Saus Mentega + Nasi",
                    description: "Ayam saus mentega dengan nasi putih hangat dan sambal.",
                    image_url: "uploads/products/product-1759840031129-444268772.PNG",
                    current_price: 30000,
                    current_cogs: 20000,
                    status: "Tersedia"
                },
                {
                    category_id: 1,
                    name: "Chicken Blackpepper + Nasi",
                    description: "Ayam blackpepper dengan nasi putih hangat dan sambal.",
                    image_url: "uploads/products/product-1759840041004-713014877.PNG",
                    current_price: 30000,
                    current_cogs: 20000,
                    status: "Tersedia"
                },
                {
                    category_id: 1,
                    name: "Chicken Teriyaki + Nasi",
                    description: "Ayam teriyaki dengan nasi putih hangat dan sambal.",
                    image_url: "uploads/products/product-1759840047426-70821981.PNG",
                    current_price: 30000,
                    current_cogs: 20000,
                    status: "Tersedia"
                },
                {
                    category_id: 1,
                    name: "Chicken Katsu + Nasi",
                    description: "Chicken katsu dengan nasi putih hangat dan sambal.",
                    image_url: "uploads/products/product-1759840059636-172014658.PNG",
                    current_price: 30000,
                    current_cogs: 20000,
                    status: "Tersedia"
                },
                {
                    category_id: 2,
                    name: "Bihun Goreng",
                    description: "Bihun goreng dengan sayuran dan telur.",
                    image_url: "uploads/products/product-1759840083815-874078996.PNG",
                    current_price: 25000,
                    current_cogs: 15000,
                    status: "Tersedia"
                },
                {
                    category_id: 2,
                    name: "Bihun Rebus",
                    description: "Bihun rebus dengan sayuran dan telur.",
                    image_url: "uploads/products/product-1759840088377-531774601.PNG",
                    current_price: 25000,
                    current_cogs: 15000,
                    status: "Tersedia"
                },
                {
                    category_id: 2,
                    name: "Spaghetti Bolognese",
                    description: "Spaghetti dengan saus bolognese dan daging cincang.",
                    image_url: "uploads/products/product-1759840097955-561172228.PNG",
                    current_price: 24000,
                    current_cogs: 14000,
                    status: "Tersedia"
                },
                {
                    category_id: 2,
                    name: "Kwetiaw Goreng",
                    description: "Kwetiaw goreng dengan sayuran dan telur.",
                    image_url: "uploads/products/product-1759840111339-103822602.PNG",
                    current_price: 25000,
                    current_cogs: 15000,
                    status: "Tersedia"
                },
                {
                    category_id: 2,
                    name: "Mie Jowo Goreng",
                    description: "Mie jowo goreng dengan sayuran dan telur.",
                    image_url: "uploads/products/product-1759840168184-735103269.PNG",
                    current_price: 25000,
                    current_cogs: 15000,
                    status: "Tersedia"
                },
                {
                    category_id: 2,
                    name: "Mie Jowo Rebus",
                    description: "Mie jowo rebus dengan sayuran dan telur.",
                    image_url: "uploads/products/product-1759840174613-931878362.PNG",
                    current_price: 25000,
                    current_cogs: 15000,
                    status: "Tersedia"
                },
                {
                    category_id: 2,
                    name: "Nasi Goreng Jowo",
                    description: "Nasi goreng jowo dengan sayuran dan telur.",
                    image_url: "uploads/products/product-1759840180686-593603703.PNG",
                    current_price: 25000,
                    current_cogs: 15000,
                    status: "Tersedia"
                },
                {
                    category_id: 2,
                    name: "Capcay Rebus",
                    description: "Capcay rebus dengan sayuran segar.",
                    image_url: "uploads/products/product-1759840195488-562368508.PNG",
                    current_price: 25000,
                    current_cogs: 15000,
                    status: "Tersedia"
                },
                {
                    category_id: 2,
                    name: "Mie Goreng Oriental",
                    description: "Mie goreng oriental dengan sayuran dan telur.",
                    image_url: "uploads/products/product-1759840203835-886599775.PNG",
                    current_price: 28000,
                    current_cogs: 18000,
                    status: "Tersedia"
                },
                {
                    category_id: 2,
                    name: "nasi Goreng Oriental",
                    description: "Nasi goreng oriental dengan sayuran dan telur.",
                    image_url: "uploads/products/product-1759840215712-46493464.PNG",
                    current_price: 28000,
                    current_cogs: 18000,
                    status: "Tersedia"
                },
                {
                    category_id: 2,
                    name: "Capcay Goreng",
                    description: "Capcay goreng dengan sayuran dan telur.",
                    image_url: "uploads/products/product-1759840229851-740569035.PNG",
                    current_price: 25000,
                    current_cogs: 15000,
                    status: "Tersedia"
                },
                {
                    category_id: 3,
                    name: "Wader Crispy + Nasi",
                    description: "Wader crispy dengan nasi.",
                    image_url: "uploads/products/product-1759840297403-497569178.PNG",
                    current_price: 24000,
                    current_cogs: 15000,
                    status: "Tersedia"
                },
                {
                    category_id: 3,
                    name: "Nila Goreng + Nasi",
                    description: "Nila goreng dengan nasi.",
                    image_url: "uploads/products/product-1759840303982-781998759.PNG",
                    current_price: 33000,
                    current_cogs: 20000,
                    status: "Tersedia"
                },
                {
                    category_id: 3,
                    name: "Nila Bakar + Nasi",
                    description: "Nila bakar dengan nasi.",
                    image_url: "uploads/products/product-1759840309490-449146959.PNG",
                    current_price: 33000,
                    current_cogs: 20000,
                    status: "Tersedia"
                },
                {
                    category_id: 3,
                    name: "Udang Goreng tepung + Nasi",
                    description: "Udang goreng tepung dengan nasi.",
                    image_url: "uploads/products/product-1759840321990-880794749.PNG",
                    current_price: 45000,
                    current_cogs: 30000,
                    status: "Tersedia"
                },
                {
                    category_id: 3,
                    name: "Udang saus Asam Manis + Nasi",
                    description: "Udang saus asam manis dengan nasi.",
                    image_url: "uploads/products/product-1759840332453-635446571.PNG",
                    current_price: 45000,
                    current_cogs: 30000,
                    status: "Tersedia"
                },
                {
                    category_id: 3,
                    name: "Cumi Goreng Tepung + Nasi",
                    description: "Cumi goreng tepung dengan nasi.",
                    image_url: "uploads/products/product-1759840341243-30031951.PNG",
                    current_price: 45000,
                    current_cogs: 30000,
                    status: "Tersedia"
                },
                {
                    category_id: 3,
                    name: "Gurame Goreng",
                    description: "Gurame goreng dengan olahan khas.",
                    image_url: "uploads/products/product-1759840348005-423619126.PNG",
                    current_price: 120000,
                    current_cogs: 80000,
                    status: "Tersedia"
                },
                {
                    category_id: 3,
                    name: "Gurame Crispy Asam Manis",
                    description: "Gurame crispy asam manis dengan olahan khas.",
                    image_url: "uploads/products/product-1759840355102-288857953.PNG",
                    current_price: 130000,
                    current_cogs: 90000,
                    status: "Tersedia"
                },
                {
                    category_id: 3,
                    name: "Gurame Bakar",
                    description: "Gurame bakar dengan olahan khas.",
                    image_url: "uploads/products/product-1759840365374-124500898.PNG",
                    current_price: 120000,
                    current_cogs: 80000,
                    status: "Tersedia"
                },
                {
                    category_id: 4,
                    name: "Tempe Kemul",
                    description: "Tempe kemul dengan bumbu khas.",
                    image_url: "uploads/products/product-1759840382114-691785443.PNG",
                    current_price: 11000,
                    current_cogs: 7000,
                    status: "Tersedia"
                },
                {
                    category_id: 4,
                    name: "Tempe Bakar",
                    description: "Tempe bakar dengan bumbu khas.",
                    image_url: "uploads/products/product-1759840387468-161782209.PNG",
                    current_price: 11000,
                    current_cogs: 7000,
                    status: "Tersedia"
                },
                {
                    category_id: 4,
                    name: "Tahu Goreng",
                    description: "Tahu goreng dengan bumbu khas.",
                    image_url: "uploads/products/product-1759840394122-842279233.PNG",
                    current_price: 11000,
                    current_cogs: 7000,
                    status: "Tersedia"
                },
                {
                    category_id: 4,
                    name: "Cah Kangkung",
                    description: "Cah kangkung dengan bumbu khas.",
                    image_url: "uploads/products/product-1759840403987-410787892.PNG",
                    current_price: 12000,
                    current_cogs: 8000,
                    status: "Tersedia"
                },
                {
                    category_id: 4,
                    name: "Omlete Sayur",
                    description: "Omlete sayur dengan bumbu khas.",
                    image_url: "uploads/products/product-1759840409186-458465194.PNG",
                    current_price: 16000,
                    current_cogs: 10000,
                    status: "Tersedia"
                },
                {
                    category_id: 4,
                    name: "Tumis Jamur",
                    description: "Tumis jamur dengan bumbu khas.",
                    image_url: "uploads/products/product-1759840414232-436528975.PNG",
                    current_price: 16000,
                    current_cogs: 10000,
                    status: "Tersedia"
                },
                {
                    category_id: 5,
                    name: "Rondo Royal",
                    description: "Rondo royal dengan isian coklat dan keju.",
                    image_url: "uploads/products/product-1759840424192-976939902.PNG",
                    current_price: 15000,
                    current_cogs: 8000,
                    status: "Tersedia"
                },
                {
                    category_id: 5,
                    name: "Piscok Lumer",
                    description: "Piscok lumer dengan isian coklat.",
                    image_url: "uploads/products/product-1759840433128-545781746.PNG",
                    current_price: 15000,
                    current_cogs: 8000,
                    status: "Tersedia"
                },
                {
                    category_id: 5,
                    name: "Combro",
                    description: "Combro dengan isian oncom pedas.",
                    image_url: "uploads/products/product-1759840438535-666301114.PNG",
                    current_price: 15000,
                    current_cogs: 8000,
                    status: "Tersedia"
                },
                {
                    category_id: 5,
                    name: "Gethuk Goreng",
                    description: "Gethuk goreng dengan rasa manis dan gurih.",
                    image_url: "uploads/products/product-1759840447661-812891430.PNG",
                    current_price: 15000,
                    current_cogs: 8000,
                    status: "Tersedia"
                },
                {
                    category_id: 5,
                    name: "Cothot Goreng",
                    description: "Cothot goreng dengan isian singkong dan kelapa.",
                    image_url: "uploads/products/product-1759840458766-340552144.PNG",
                    current_price: 15000,
                    current_cogs: 8000,
                    status: "Tersedia"
                },
                {
                    category_id: 5,
                    name: "Tahu Crispy",
                    description: "Tahu crispy dengan balutan tepung crispy.",
                    image_url: "uploads/products/product-1759840465181-816257279.PNG",
                    current_price: 15000,
                    current_cogs: 8000,
                    status: "Tersedia"
                },
                {
                    category_id: 5,
                    name: "Timus Ubi Ungu",
                    description: "Timus ubi ungu dengan rasa manis.",
                    image_url: "uploads/products/product-1759840472990-903768704.PNG",
                    current_price: 15000,
                    current_cogs: 8000,
                    status: "Tersedia"
                },
                {
                    category_id: 5,
                    name: "Pisang Goreng",
                    description: "Pisang goreng dengan balutan tepung crispy.",
                    image_url: "uploads/products/product-1759840478765-264771277.PNG",
                    current_price: 15000,
                    current_cogs: 8000,
                    status: "Tersedia"
                },
                {
                    category_id: 5,
                    name: "Lumpia Sayur",
                    description: "Lumpia sayur dengan isian sayuran segar.",
                    image_url: "uploads/products/product-1759840484724-223271920.PNG",
                    current_price: 15000,
                    current_cogs: 8000,
                    status: "Tersedia"
                },
                {
                    category_id: 5,
                    name: "Singkong Goreng",
                    description: "Singkong goreng dengan balutan tepung crispy.",
                    image_url: "uploads/products/product-1759840520763-87980559.PNG",
                    current_price: 15000,
                    current_cogs: 8000,
                    status: "Tersedia"
                },
                {
                    category_id: 5,
                    name: "Risol Mayo",
                    description: "Risol mayo dengan isian mayo dan sayuran.",
                    image_url: "uploads/products/product-1759840527582-984809140.PNG",
                    current_price: 15000,
                    current_cogs: 8000,
                    status: "Tersedia"
                },
                {
                    category_id: 5,
                    name: "Banana Bites",
                    description: "Banana bites dengan isian pisang dan coklat.",
                    image_url: "uploads/products/product-1759840533632-672870311.PNG",
                    current_price: 15000,
                    current_cogs: 8000,
                    status: "Tersedia"
                },
                {
                    category_id: 5,
                    name: "Dimsum",
                    description: "Dimsum dengan isian ayam dan udang.",
                    image_url: "uploads/products/product-1759840538966-40051264.PNG",
                    current_price: 15000,
                    current_cogs: 8000,
                    status: "Tersedia"
                },
                {
                    category_id: 5,
                    name: "Tela - Tela Balado",
                    description: "Tela - tela balado dengan isian singkong dan bumbu balado.",
                    image_url: "uploads/products/product-1759840551681-19497351.PNG",
                    current_price: 15000,
                    current_cogs: 8000,
                    status: "Tersedia"
                },
                {
                    category_id: 5,
                    name: "Jamur Crispy",
                    description: "Jamur crispy dengan balutan tepung crispy.",
                    image_url: "uploads/products/product-1759840558892-63298240.PNG",
                    current_price: 18000,
                    current_cogs: 8000,
                    status: "Tersedia"
                },
                {
                    category_id: 5,
                    name: "Onion Ring",
                    description: "Onion ring dengan balutan tepung crispy.",
                    image_url: "uploads/products/product-1759840563464-566353966.PNG",
                    current_price: 20000,
                    current_cogs: 10000,
                    status: "Tersedia"
                },
                {
                    category_id: 5,
                    name: "French Fries",
                    description: "French fries dengan balutan tepung crispy.",
                    image_url: "uploads/products/product-1759840569472-504657742.PNG",
                    current_price: 20000,
                    current_cogs: 10000,
                    status: "Tersedia"
                },
                {
                    category_id: 6,
                    name: "Teh (Panas/Dingin)",
                    description: "Teh dengan pilihan panas atau dingin.",
                    image_url: "uploads/products/product-1759840580286-331136020.PNG",
                    current_price: 7000,
                    current_cogs: 3000,
                    status: "Tersedia"
                },
                {
                    category_id: 6,
                    name: "Jeruk (Panas/Dingin)",
                    description: "Jeruk dengan pilihan panas atau dingin.",
                    image_url: "uploads/products/product-1759840591859-464252548.PNG",
                    current_price: 8000,
                    current_cogs: 3000,
                    status: "Tersedia"
                },
                {
                    category_id: 6,
                    name: "Es Lemon Tea",
                    description: "Es lemon tea yang segar.",
                    image_url: "uploads/products/product-1759840597090-565473180.PNG",
                    current_price: 10000,
                    current_cogs: 6000,
                    status: "Tersedia"
                },
                {
                    category_id: 6,
                    name: "Lemon Squash",
                    description: "Lemon squash yang segar.",
                    image_url: "uploads/products/product-1759840603050-288626704.PNG",
                    current_price: 15000,
                    current_cogs: 8000,
                    status: "Tersedia"
                },
                {
                    category_id: 6,
                    name: "Es Teh Tarik",
                    description: "Es teh tarik yang creamy.",
                    image_url: "uploads/products/product-1759840609853-836874850.PNG",
                    current_price: 14000,
                    current_cogs: 9000,
                    status: "Tersedia"
                },
                {
                    category_id: 6,
                    name: "Wedang Gula Asem",
                    description: "Wedang gula asem yang hangat.",
                    image_url: "uploads/products/product-1759840615235-523634565.PNG",
                    current_price: 15000,
                    current_cogs: 9000,
                    status: "Tersedia"
                },
                {
                    category_id: 6,
                    name: "Wedang Kunir Asem",
                    description: "Wedang kunir asem yang hangat.",
                    image_url: "uploads/products/product-1759840646017-13510028.PNG",
                    current_price: 15000,
                    current_cogs: 9000,
                    status: "Tersedia"
                },
                {
                    category_id: 6,
                    name: "Wedang Beras Kencur",
                    description: "Wedang beras kencur yang hangat.",
                    image_url: "uploads/products/product-1759840652010-116857123.PNG",
                    current_price: 15000,
                    current_cogs: 9000,
                    status: "Tersedia"
                },
                {
                    category_id: 6,
                    name: "Wedang Bajigur",
                    description: "Wedang bajigur yang hangat.",
                    image_url: "uploads/products/product-1759840656523-870049685.PNG",
                    current_price: 15000,
                    current_cogs: 9000,
                    status: "Tersedia"
                },
                {
                    category_id: 6,
                    name: "Wedang Uwuh",
                    description: "Wedang uwuh yang hangat.",
                    image_url: "uploads/products/product-1759840660966-552347577.PNG",
                    current_price: 15000,
                    current_cogs: 9000,
                    status: "Tersedia"
                },
                {
                    category_id: 6,
                    name: "Orange Squash",
                    description: "Orange squash yang segar.",
                    image_url: "uploads/products/product-1759840666725-102768932.PNG",
                    current_price: 16000,
                    current_cogs: 9000,
                    status: "Tersedia"
                },
                {
                    category_id: 6,
                    name: "Blue Ocean Squash",
                    description: "Blue ocean squash yang segar.",
                    image_url: "uploads/products/product-1759840673200-47835899.PNG",
                    current_price: 16000,
                    current_cogs: 9000,
                    status: "Tersedia"
                },
                {
                    category_id: 6,
                    name: "Lychee Tea",
                    description: "Lychee tea yang segar.",
                    image_url: "uploads/products/product-1759840679019-375420745.PNG",
                    current_price: 20000,
                    current_cogs: 14000,
                    status: "Tersedia"
                },
                {
                    category_id: 7,
                    name: "Americano Iced",
                    description: "Kopi americano dingin yang menyegarkan.",
                    image_url: "uploads/products/product-1759840686826-222860406.PNG",
                    current_price: 18000,
                    current_cogs: 12000,
                    status: "Tersedia"
                },
                {
                    category_id: 7,
                    name: "Cappuccino Iced",
                    description: "Kopi cappuccino dingin yang creamy.",
                    image_url: "uploads/products/product-1759840691763-253976429.PNG",
                    current_price: 19000,
                    current_cogs: 13000,
                    status: "Tersedia"
                },
                {
                    category_id: 7,
                    name: "Coffee Latte Iced",
                    description: "Kopi coffee latte dingin yang creamy.",
                    image_url: "uploads/products/product-1759840696246-558882113.PNG",
                    current_price: 19000,
                    current_cogs: 14000,
                    status: "Tersedia"
                },
                {
                    category_id: 7,
                    name: "Mocha Latte Iced",
                    description: "Kopi mocha latte dingin yang creamy.",
                    image_url: "uploads/products/product-1759840705111-511945760.PNG",
                    current_price: 20000,
                    current_cogs: 14000,
                    status: "Tersedia"
                },
                {
                    category_id: 7,
                    name: "Es Kopi Susu Opak",
                    description: "Kopi susu dingin dengan cita rasa khas Opak.",
                    image_url: "uploads/products/product-1759840711779-712338654.PNG",
                    current_price: 20000,
                    current_cogs: 14000,
                    status: "Tersedia"
                },
                {
                    category_id: 7,
                    name: "Es Kopi Susu Gula Aren",
                    description: "Kopi susu dingin dengan gula aren yang manis.",
                    image_url: "uploads/products/product-1759840717431-46930459.PNG",
                    current_price: 20000,
                    current_cogs: 14000,
                    status: "Tersedia"
                },
                {
                    category_id: 7,
                    name: "Es Kopi Susu Pandan",
                    description: "Kopi susu dingin dengan aroma pandan yang harum.",
                    image_url: "uploads/products/product-1759840725693-210144587.PNG",
                    current_price: 20000,
                    current_cogs: 14000,
                    status: "Tersedia"
                },
                {
                    category_id: 7,
                    name: "Es Kopi Susu Caramel",
                    description: "Kopi susu dingin dengan rasa caramel yang manis.",
                    image_url: "uploads/products/product-1759840730601-596175746.PNG",
                    current_price: 20000,
                    current_cogs: 14000,
                    status: "Tersedia"
                },
                {
                    category_id: 7,
                    name: "Es Kopi Susu Hazelnut",
                    description: "Kopi susu dingin dengan rasa hazelnut yang lezat.",
                    image_url: "uploads/products/product-1759840737033-961153431.PNG",
                    current_price: 20000,
                    current_cogs: 14000,
                    status: "Tersedia"
                },
                {
                    category_id: 7,
                    name: "Es Kopi Susu Vanilla",
                    description: "Kopi susu dingin dengan rasa vanilla yang harum.",
                    image_url: "uploads/products/product-1759840742456-157772216.PNG",
                    current_price: 20000,
                    current_cogs: 14000,
                    status: "Tersedia"
                },
                {
                    category_id: 7,
                    name: "Es Kopi Susu Banana",
                    description: "Kopi susu dingin dengan rasa pisang yang manis.",
                    image_url: "uploads/products/product-1759840748000-691659502.PNG",
                    current_price: 20000,
                    current_cogs: 14000,
                    status: "Tersedia"
                },
                {
                    category_id: 7,
                    name: "Pastika",
                    description: "Kopi dengan campuran mocktail pastika.",
                    image_url: "uploads/products/product-1759840752801-277996882.PNG",
                    current_price: 20000,
                    current_cogs: 14000,
                    status: "Tersedia"
                },
                {
                    category_id: 7,
                    name: "Pelemsari",
                    description: "Kopi dengan campuran mocktail pelemsari.",
                    image_url: "uploads/products/product-1759840757171-600431733.PNG",
                    current_price: 20000,
                    current_cogs: 14000,
                    status: "Tersedia"
                },
                {
                    category_id: 8,
                    name: "Thai Tea Original Iced",
                    description: "Thai tea original dingin yang menyegarkan.",
                    image_url: "uploads/products/product-1759840769454-249540911.PNG",
                    current_price: 16000,
                    current_cogs: 10000,
                    status: "Tersedia"
                },
                {
                    category_id: 8,
                    name: "Thai Green Tea Iced",
                    description: "Thai green tea dingin yang menyegarkan.",
                    image_url: "uploads/products/product-1759840773668-610817459.PNG",
                    current_price: 16000,
                    current_cogs: 10000,
                    status: "Tersedia"
                },
                {
                    category_id: 8,
                    name: "Thai Tea Coffee Iced",
                    description: "Thai tea coffee dingin yang menyegarkan.",
                    image_url: "uploads/products/product-1759840778274-52681647.PNG",
                    current_price: 16000,
                    current_cogs: 10000,
                    status: "Tersedia"
                },
                {
                    category_id: 8,
                    name: "Thai Green Tea Milo Iced",
                    description: "Thai green tea milo dingin yang menyegarkan.",
                    image_url: "uploads/products/product-1759840786385-171548454.PNG",
                    current_price: 16000,
                    current_cogs: 10000,
                    status: "Tersedia"
                },
                {
                    category_id: 9,
                    name: "Taro Latte Iced",
                    description: "Taro latte dingin yang creamy.",
                    image_url: "uploads/products/product-1759840794377-837610357.PNG",
                    current_price: 17000,
                    current_cogs: 11000,
                    status: "Tersedia"
                },
                {
                    category_id: 9,
                    name: "Chocolate Iced",
                    description: "Chocolate dingin yang creamy.",
                    image_url: "uploads/products/product-1759840799202-727811370.PNG",
                    current_price: 17000,
                    current_cogs: 12000,
                    status: "Tersedia"
                },
                {
                    category_id: 9,
                    name: "Matcha Latte Iced",
                    description: "Matcha latte dingin yang creamy.",
                    image_url: "uploads/products/product-1759840804534-187653801.PNG",
                    current_price: 20000,
                    current_cogs: 14000,
                    status: "Tersedia"
                },
                {
                    category_id: 9,
                    name: "Banana Chocolate Iced",
                    description: "Banana chocolate dingin yang creamy.",
                    image_url: "uploads/products/product-1759840838709-893317394.PNG",
                    current_price: 20000,
                    current_cogs: 14000,
                    status: "Tersedia"
                },
                {
                    category_id: 9,
                    name: "Chocolate Hazelnut Iced",
                    description: "Chocolate hazelnut dingin yang creamy.",
                    image_url: "uploads/products/product-1759840844375-94011044.PNG",
                    current_price: 20000,
                    current_cogs: 14000,
                    status: "Tersedia"
                }
            ];
            yield prisma.menu.createMany({
                data: menu,
                skipDuplicates: true,
            });
        }
        catch (error) {
            console.error("❌ Error during seed:", error);
            throw error;
        }
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Disconnecting from database...");
    yield prisma.$disconnect();
    console.log("✅ Disconnected");
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error("❌ Fatal error:", e);
    yield prisma.$disconnect();
    process.exit(1);
}));
