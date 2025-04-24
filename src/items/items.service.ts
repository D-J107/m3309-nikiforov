import { BadRequestException, Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Item } from './items.model';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { UpdateItemDto } from './dto/update-item.dto';
import { CloudinaryService } from 'src/database/cloudinary.service';
import { Purchase } from 'src/purchase/purchase.model';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ItemsService implements OnModuleInit{
    private readonly ALL_ITEMS_KEY = 'items:all';
    private readonly ITEM_KEY_PREFIX = 'items:id:';

    constructor(
        @InjectRepository(Item) private itemRepository: Repository<Item>,
        private readonly cloudinaryService: CloudinaryService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

    async saveFile(file: Express.Multer.File): Promise<string> {
        if (!file) {
            throw new BadRequestException('Файл не загружен!');
        }
        // const uniqueName = `${path.parse(file.originalname).name}.${Date.now()}${path.extname(file.originalname)}`;
        console.log("items.service.ts saveFile file.originalname:", file.originalname);
        const result = await this.cloudinaryService.uploadImageBuffer(file.buffer, file.originalname);
        return result.secure_url;
    }

    async save(title: string, price: number, imagePath: string,
                specialOffer: string, discount: number) {
        const item = this.itemRepository.create({
            title,
            price,
            imagePath,
            specialOffer,
            discount
        });
        const saved = await this.itemRepository.save(item);
        // делаем кэш невалидным тк он неверный тк добавили новый айтем
        await this.cacheManager.del(this.ALL_ITEMS_KEY);
        // но для конкретного предмета кэш обновляем
        await this.cacheManager.set(this.ITEM_KEY_PREFIX + saved.id, saved);
        return saved;
    }

    async getAll() {
        const cached: Item[] | null = await this.cacheManager.get(this.ALL_ITEMS_KEY);
        if (cached) {
            console.log('items getAll: returned from cache');
            return cached;
        }

        const items = await this.itemRepository.find({
            relations: ['purchase']
        });
        const itemsForHtmlOutput = items.map(item => ({
            ...item,
            specialOffer: item.specialOffer ?? '',
            discount: item.discount ?? 0,
        }))

        function compare(a, b) {
            if (a.id < b.id) {
                return -1;
            }
            if (a.id > b.id) {
                return 1;
            }
            return 0;
        }
        const output = itemsForHtmlOutput.sort(compare);
        await this.cacheManager.set(this.ALL_ITEMS_KEY, output);
        return output;
    }
    async getById(id: number) {
        const key = this.ITEM_KEY_PREFIX + id;

        const cached: Item | null = await this.cacheManager.get(key);
        if (cached) {
            console.log(`items service getById ${id} returned from cache`)
            return cached;
        }


        const item = await this.itemRepository.findOneBy({id});
        await this.cacheManager.set(key, item);
        return item;
    }

    async getByTitle(title: string) {
        return await this.itemRepository.findOneBy({title});
    }
    
    async updateItem(id: number, dto: UpdateItemDto, newFile: Express.Multer.File) {
        let item = await this.itemRepository.findOneBy({id});
        if (!item) {
            throw new NotFoundException(`Предмет с айди ${id} не найден!`);
        }
        let imagePath = item.imagePath;

        if (newFile) {
            // удаляем предыдущее изображение 
            const uploadFolder = path.join(__dirname, '../../public/webp-images/');
            const previousFilePath = path.join(uploadFolder, imagePath);
            fs.unlinkSync(previousFilePath);

            // Затем сохраняем новое
            imagePath = await this.saveFile(newFile);
        }

        const updatedFields = {
            title: dto.title || item.title,
            price: dto.price || item.price,
            specialOffer: dto.specialOffer || item.specialOffer,
            discount: dto.discount || item.discount,
            imagePath
        }

        await this.itemRepository.update(id, updatedFields);
        
        const newItem = await this.itemRepository.findOneBy({ id });
        const previousTitle = item.title;

        // поскольку хотя бы 1 предмет обновился то предыдущий кэш не актуален
        await this.cacheManager.del(this.ALL_ITEMS_KEY);
        await this.cacheManager.del(this.ITEM_KEY_PREFIX + id);

        return { newItem, previousTitle };
    }

    async purchaseItem(itemId: number, purchase:  Purchase) {
        let item = await this.itemRepository.findOneBy({id: itemId});
        if (!item) {
            throw new NotFoundException(`Предмет с айди ${itemId} для покупки не найден!`);
        }
        item.purchase = purchase;
        await this.itemRepository.update(itemId, item);

        this.cacheManager.del(this.ALL_ITEMS_KEY)
        this.cacheManager.del(this.ITEM_KEY_PREFIX + itemId);

        return item
    }

    async deleteById(id: number) {
        const item = await this.itemRepository.findOneBy({id});
        if (!item) {
            throw new NotFoundException(`Предмет с айди ${id} не найдена`);
        }
        await this.itemRepository.delete({id});

        this.cacheManager.del(this.ALL_ITEMS_KEY)
        this.cacheManager.del(this.ITEM_KEY_PREFIX + id)

        return item;
    }

    async deleteByTitle(title: string) {
        const item = await this.itemRepository.findOneBy({title});
        if (!item) {
            throw new NotFoundException(`Предмет с названием ${title} не найден!`);
        }
        await this.itemRepository.delete({title});

        this.cacheManager.del(this.ALL_ITEMS_KEY)
        this.cacheManager.del(this.ITEM_KEY_PREFIX + item.id)

        return item;
    }
    

    async onModuleInit() {
        this.ensureBaseStuffExists();
    }

    private async ensureBaseStuffExists() {
        const predefinedItems: Omit<Item, 'id'>[] = [
            {
                title: 'Горбуша',
                price: 234,
                imagePath: 'Горбуша Дальневосточная замороженная без головы~800г.webp',
                specialOffer: 'Распродажа',
                discount: 17
            },
            {
                title: 'Кета',
                price: 5220,
                imagePath: 'Кета Дальневосточная замороженная~1.5кг.webp',
                specialOffer: undefined,
                discount: 12
            },
            {
                title: 'Кета холодного копчения',
                price: 234,
                imagePath: 'Кета холодного копчения филе~400г.webp',
                specialOffer: 'Распродажа',
                discount: 17
            },
            {
                title: 'Кижуч',
                price: 5220,
                imagePath: 'Кижуч Дальневосточный замороженный~2.5кг.webp',
                specialOffer: undefined,
                discount: undefined
            },
            {
                title: 'Лосось',
                price: 9999,
                imagePath: 'Лосось Дальневосточный хвостовая часть~300г.webp',
                specialOffer: undefined,
                discount: undefined
            },
            {
                title: 'Нерка',
                price: 2722,
                imagePath: 'Нерка Дальневосточная замороженная~1.2кг.webp',
                specialOffer: undefined,
                discount: undefined
            },
            {
                title: 'Осетр',
                price: 1940,
                imagePath: 'Осетр стейк горячего копчения~250г.webp',
                specialOffer: undefined,
                discount: undefined
            },
            {
                title: 'Сибас',
                price: 1818,
                imagePath: 'Сибас без головы замороженный~700г.webp',
                specialOffer: 'Распродажа',
                discount: undefined
            },
            {
                title: 'Филе нерки',
                price: 3567,
                imagePath: 'Филе Дальневосточной нерки порционное~400г.webp',
                specialOffer: undefined,
                discount: undefined
            },
            {
                title: 'Филе форели',
                price: 1577,
                imagePath: 'Филе форели горячего копчения ФЕРМЕРСКАЯ~500г.webp',
                specialOffer: undefined,
                discount: undefined
            },
            {
                title: 'Форель горячего копчения',
                price: 1983,
                imagePath: 'Форель горячего копчения ФЕРМЕРСКАЯ~600г.webp',
                specialOffer: undefined,
                discount: undefined
            },
            {
                title: 'Щука',
                price: 2515,
                imagePath: 'Щука суповой набор замороженный~1кг.webp',
                specialOffer: undefined,
                discount: undefined
            }
        ];

        for (let item of predefinedItems) {
            const exists = await this.itemRepository.findOneBy({ title: item.title });
            if (!exists) {
                // также нужно сначала сохранить изображение на удаленную БДшку
                const localFilePath = path.join(__dirname, "..", "..", "public", "basic-webp-images", item.imagePath);
                try {
                    const buffer = fs.readFileSync(localFilePath);
                    const localFilePathWithoutExtension = path.parse(localFilePath).name;
                    const cloudinaryResult  = await this.cloudinaryService.uploadImageBuffer(buffer, localFilePathWithoutExtension);
                    item.imagePath = cloudinaryResult.secure_url;
                } catch(err) {
                    console.log("❌ items.service.ts ensureBaseStuffExists err:", err);
                    continue;
                }
                const saved = await this.itemRepository.save(item);

                this.cacheManager.del(this.ALL_ITEMS_KEY)
                this.cacheManager.set(this.ITEM_KEY_PREFIX + saved.id, saved)
            }
        }
        console.log("✅ Base stuff added to store DB.")
    }
    
}