import { GOOGLE_CONFIG, OPENAI_CONFIG } from '../config';

const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';
const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3/files';

const KNOWN_DOMAIN_HEADERS = ['dominio', 'domain', 'patente', 'placa', 'matricula', 'dominiodelauto', 'dominioauto'];
const KNOWN_STOCK_HEADERS = ['stock', 'cantidad', 'unidades', 'disponibles'];
const KNOWN_PRICE_HEADERS = ['precio', 'price', 'valor'];
const KNOWN_STATUS_HEADERS = ['estado', 'status'];
const KNOWN_DESCRIPTION_HEADERS = ['descripcion', 'description', 'detalle'];

const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

const descriptionCache = {};
let cachedSheetData = null;
let cachedDriveData = null;
let sheetCacheTimestamp = 0;
let driveCacheTimestamp = 0;

const getCacheTtl = () => {
    if (typeof GOOGLE_CONFIG?.CACHE_TTL_MS === 'number') {
        return GOOGLE_CONFIG.CACHE_TTL_MS;
    }
    return DEFAULT_CACHE_TTL;
};

const normalizeHeader = (value) => {
    if (value === undefined || value === null) return '';
    return value.toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
};

export const normalizeDomain = (value) => {
    if (value === undefined || value === null) return null;
    const clean = value
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
    return clean || null;
};

const parseNumericCell = (value) => {
    if (value === undefined || value === null || value === '') return null;
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
    }

    const raw = value.toString().trim();
    if (!raw) return null;

    const normalized = raw
        .replace(/\s+/g, '')
        .replace(/\./g, '')
        .replace(/,/g, '.')
        .replace(/[^0-9.-]/g, '');

    if (!normalized) return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
};

const formatNumber = (value) => {
    if (value === undefined || value === null || value === '') return null;
    const numeric = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numeric)) return null;
    try {
        return numeric.toLocaleString('es-AR');
    } catch (error) {
        return numeric.toString();
    }
};

const formatCurrency = (value) => {
    const formatted = formatNumber(value);
    return formatted ? `$${formatted}` : null;
};

const safeFetchJson = async (url, init) => {
    const response = await fetch(url, init);
    if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Request failed (${response.status}): ${text || response.statusText}`);
    }
    return response.json();
};

const fetchSheetRange = async (range) => {
    const sheetId = GOOGLE_CONFIG?.SHEET_ID;
    const apiKey = GOOGLE_CONFIG?.API_KEY;

    if (!sheetId || !apiKey) {
        throw new Error('Google Sheets configuration incompleta');
    }

    const url = `${SHEETS_API_BASE}/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
    return safeFetchJson(url);
};

const loadSheetStock = async ({ forceRefresh = false } = {}) => {
    const now = Date.now();
    const ttl = getCacheTtl();

    if (!GOOGLE_CONFIG?.SHEET_ID || !GOOGLE_CONFIG?.API_KEY) {
        return { range: null, headers: [], normalizedHeaders: [], stockByDomain: {} };
    }

    if (!forceRefresh && cachedSheetData && now - sheetCacheTimestamp < ttl) {
        return cachedSheetData;
    }

    const ranges = Array.isArray(GOOGLE_CONFIG.SHEET_RANGES) && GOOGLE_CONFIG.SHEET_RANGES.length > 0
        ? GOOGLE_CONFIG.SHEET_RANGES
        : ['Sheet1!A:Z'];

    let selectedRange = null;
    let values = null;

    for (const range of ranges) {
        try {
            const data = await fetchSheetRange(range);
            if (Array.isArray(data.values) && data.values.length > 0) {
                selectedRange = range;
                values = data.values;
                break;
            }
        } catch (error) {
            console.warn('[syncService] No se pudo leer la hoja', range, error);
        }
    }

    if (!values || values.length <= 1) {
        const emptyResult = { range: selectedRange || ranges[0], headers: [], normalizedHeaders: [], stockByDomain: {} };
        cachedSheetData = emptyResult;
        sheetCacheTimestamp = now;
        return emptyResult;
    }

    const rawHeaders = values[0];
    const normalizedHeaders = rawHeaders.map(normalizeHeader);

    const domainIndex = normalizedHeaders.findIndex((header) => KNOWN_DOMAIN_HEADERS.includes(header));
    if (domainIndex === -1) {
        console.warn('[syncService] La hoja no contiene una columna de dominio reconocida. Se usará la primera columna.');
    }

    const stockIndex = normalizedHeaders.findIndex((header) => KNOWN_STOCK_HEADERS.includes(header));
    const priceIndex = normalizedHeaders.findIndex((header) => KNOWN_PRICE_HEADERS.includes(header));
    const statusIndex = normalizedHeaders.findIndex((header) => KNOWN_STATUS_HEADERS.includes(header));
    const descriptionIndex = normalizedHeaders.findIndex((header) => KNOWN_DESCRIPTION_HEADERS.includes(header));

    const stockByDomain = {};

    for (let i = 1; i < values.length; i++) {
        const row = values[i];
        const domainRaw = row[domainIndex !== -1 ? domainIndex : 0];
        const domainKey = normalizeDomain(domainRaw);
        if (!domainKey) continue;

        const entry = {
            domain: domainKey,
            rawDomain: domainRaw || '',
            row,
            rowNumber: i + 1,
            stock: stockIndex !== -1 ? parseNumericCell(row[stockIndex]) : null,
            price: priceIndex !== -1 ? parseNumericCell(row[priceIndex]) : null,
            status: statusIndex !== -1 ? (row[statusIndex] || '').toString().trim() : null,
            description: descriptionIndex !== -1 ? (row[descriptionIndex] || '').toString().trim() : null,
            values: {},
            labels: {}
        };

        normalizedHeaders.forEach((header, idx) => {
            if (!header) return;
            entry.values[header] = row[idx] ?? '';
            entry.labels[header] = rawHeaders[idx] ?? header;
        });

        stockByDomain[domainKey] = entry;
    }

    cachedSheetData = {
        range: selectedRange,
        headers: rawHeaders,
        normalizedHeaders,
        stockByDomain
    };
    sheetCacheTimestamp = now;

    return cachedSheetData;
};

const listDriveItems = async (query, { pageSize = 200, orderBy = 'name', fields = 'files(id,name,mimeType,parents,modifiedTime,thumbnailLink,webViewLink),nextPageToken' } = {}) => {
    if (!GOOGLE_CONFIG?.API_KEY) return [];

    const items = [];
    let pageToken;

    do {
        const params = new URLSearchParams({
            key: GOOGLE_CONFIG.API_KEY,
            q: query,
            fields,
            pageSize: pageSize.toString(),
            orderBy,
            supportsAllDrives: 'true',
            includeItemsFromAllDrives: 'true'
        });
        if (pageToken) params.set('pageToken', pageToken);

        try {
            const data = await safeFetchJson(`${DRIVE_API_BASE}?${params.toString()}`);
            if (Array.isArray(data.files)) {
                items.push(...data.files);
            }
            pageToken = data.nextPageToken;
        } catch (error) {
            console.warn('[syncService] Falló la consulta a Google Drive', query, error);
            break;
        }
    } while (pageToken);

    return items;
};

const buildDriveImageUrl = (fileId) => `https://drive.google.com/uc?export=view&id=${fileId}`;

const loadDriveImages = async ({ forceRefresh = false } = {}) => {
    const now = Date.now();
    const ttl = getCacheTtl();

    if (!GOOGLE_CONFIG?.DRIVE_FOLDER_ID || !GOOGLE_CONFIG?.API_KEY) {
        return { imagesByDomain: {}, foldersCount: 0, totalImages: 0 };
    }

    if (!forceRefresh && cachedDriveData && now - driveCacheTimestamp < ttl) {
        return cachedDriveData;
    }

    const folderQuery = `'${GOOGLE_CONFIG.DRIVE_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
    const folders = await listDriveItems(folderQuery, { pageSize: 200 });

    const imagesByDomain = {};
    let totalImages = 0;

    for (const folder of folders) {
        const domainKey = normalizeDomain(folder.name);
        if (!domainKey) continue;

        const imageQuery = `'${folder.id}' in parents and mimeType contains 'image/' and trashed = false`;
        const images = await listDriveItems(imageQuery, { pageSize: 200, orderBy: 'name', fields: 'files(id,name),nextPageToken' });
        if (!images.length) continue;

        imagesByDomain[domainKey] = images.map((file) => buildDriveImageUrl(file.id));
        totalImages += images.length;
    }

    cachedDriveData = {
        imagesByDomain,
        foldersCount: folders.length,
        totalImages
    };
    driveCacheTimestamp = now;

    return cachedDriveData;
};

const getCarDomain = (car) => {
    if (!car || typeof car !== 'object') return null;
    const candidates = [
        car.domain,
        car.dominio,
        car.license_plate,
        car.licensePlate,
        car.patente,
        car.placa,
        car.matricula,
        car.plate,
        car.slug,
        car.folder,
        car.folder_name,
        car.vin
    ];

    for (const candidate of candidates) {
        const normalized = normalizeDomain(candidate);
        if (normalized) return normalized;
    }

    return null;
};

const buildDescriptionPrompt = (car, sheetEntry) => {
    if (!car) return null;

    const lines = [];
    const pushLine = (label, value) => {
        if (value === undefined || value === null || value === '') return;
        lines.push(`${label}: ${value}`);
    };

    pushLine('Marca', car.brand);
    pushLine('Modelo', car.model);
    pushLine('Versión', car.version || car.specs);
    pushLine('Año', car.year);
    pushLine('Kilometraje', car.km ? `${formatNumber(car.km)} km` : null);
    pushLine('Precio', formatCurrency(car.price));
    pushLine('Ciudad', car.city);
    pushLine('Stock disponible', sheetEntry?.stock ?? car.stock);
    pushLine('Estado', sheetEntry?.status || car.status);

    if (sheetEntry?.values) {
        const blockedKeys = new Set([...KNOWN_DOMAIN_HEADERS, ...KNOWN_STOCK_HEADERS, ...KNOWN_PRICE_HEADERS, ...KNOWN_STATUS_HEADERS, ...KNOWN_DESCRIPTION_HEADERS]);
        const extraKeys = Object.keys(sheetEntry.values)
            .filter((key) => key && !blockedKeys.has(key))
            .slice(0, 6);

        extraKeys.forEach((key) => {
            const value = sheetEntry.values[key];
            if (!value) return;
            const label = sheetEntry.labels?.[key] || key;
            const formattedLabel = label
                .toString()
                .replace(/_/g, ' ')
                .replace(/\s+/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase());
            pushLine(formattedLabel, value);
        });
    }

    const highlightBlock = lines.filter(Boolean).join('\n');

    return [
        'Redacta una descripción comercial breve (máximo 90 palabras) para un vehículo usado en Argentina.',
        'Tono profesional, entusiasta y confiable. Destaca estado, kilometraje, mantenimiento, garantías o financiación disponible.',
        'Evita repetir la marca más de dos veces y finaliza con un llamado a la acción breve.',
        '',
        'Datos del vehículo:',
        highlightBlock
    ].filter(Boolean).join('\n');
};

const resolveDescription = async ({ car, sheetEntry, domainKey, allowGeneration }) => {
    if (!domainKey) {
        return sheetEntry?.description || null;
    }

    if (sheetEntry?.description) {
        const text = sheetEntry.description.trim();
        if (text) {
            descriptionCache[domainKey] = text;
            return text;
        }
    }

    if (descriptionCache[domainKey]) {
        return descriptionCache[domainKey];
    }

    if (!allowGeneration || !OPENAI_CONFIG?.API_KEY) {
        return null;
    }

    const prompt = buildDescriptionPrompt(car, sheetEntry);
    if (!prompt) return null;

    try {
        const body = JSON.stringify({
            model: OPENAI_CONFIG.MODEL || 'gpt-4.1-mini',
            messages: [
                {
                    role: 'system',
                    content: 'Eres un copywriter automotriz argentino. Redactas descripciones breves, convincentes y claras para autos usados.'
                },
                { role: 'user', content: prompt }
            ],
            temperature: OPENAI_CONFIG.TEMPERATURE ?? 0.7,
            max_tokens: OPENAI_CONFIG.MAX_TOKENS ?? 320
        });

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENAI_CONFIG.API_KEY}`
            },
            body
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => response.statusText);
            throw new Error(`OpenAI error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) {
            descriptionCache[domainKey] = text;
            return text;
        }
    } catch (error) {
        console.error('[syncService] Error generando descripción con OpenAI:', error);
    }

    return null;
};

export const applyDealershipSync = async (cars, options = {}) => {
    if (!Array.isArray(cars)) {
        return { cars: [], updates: [], meta: { matched: 0, total: 0 } };
    }

    const {
        forceRefresh = false,
        generateDescriptions = false,
        includeDescriptions = true
    } = options;

    let sheetData = { range: null, headers: [], normalizedHeaders: [], stockByDomain: {} };
    let driveData = { imagesByDomain: {}, foldersCount: 0, totalImages: 0 };

    try {
        sheetData = await loadSheetStock({ forceRefresh });
    } catch (error) {
        console.error('[syncService] No se pudo cargar el stock desde Google Sheets:', error);
    }

    try {
        driveData = await loadDriveImages({ forceRefresh });
    } catch (error) {
        console.error('[syncService] No se pudo cargar las imágenes desde Google Drive:', error);
    }

    const updates = [];
    const updatedCars = [];
    let matched = 0;

    for (const car of cars) {
        const domainKey = getCarDomain(car);
        const sheetEntry = domainKey ? sheetData.stockByDomain[domainKey] : undefined;
        const imageUrls = domainKey ? driveData.imagesByDomain[domainKey] : undefined;

        if (!sheetEntry && (!imageUrls || imageUrls.length === 0) && !(includeDescriptions && descriptionCache[domainKey || ''])) {
            updatedCars.push(car);
            continue;
        }

        matched++;
        const newCar = { ...car };

        if (sheetEntry) {
            if (sheetEntry.stock !== null && sheetEntry.stock !== undefined) {
                newCar.stock = sheetEntry.stock;
            }
            if (sheetEntry.price !== null && sheetEntry.price !== undefined) {
                newCar.price = sheetEntry.price;
            }
            if (sheetEntry.status) {
                newCar.status = sheetEntry.status;
            }
        }

        if (imageUrls && imageUrls.length > 0) {
            newCar.images = imageUrls;
        }

        let description = null;

        if (includeDescriptions) {
            description = await resolveDescription({
                car: newCar,
                sheetEntry,
                domainKey,
                allowGeneration: generateDescriptions
            });

            if (description) {
                newCar.description = description;
                if (!newCar.specs || newCar.specs.toString().trim().length < 8) {
                    const firstSentence = description.split('.').map((sentence) => sentence.trim()).find(Boolean);
                    if (firstSentence) newCar.specs = firstSentence;
                }
            }
        } else if (domainKey && descriptionCache[domainKey]) {
            newCar.description = descriptionCache[domainKey];
        }

        updatedCars.push(newCar);
        updates.push({
            id: car.id,
            domain: domainKey,
            stock: newCar.stock,
            price: newCar.price,
            images: imageUrls,
            description,
            sheetRow: sheetEntry?.rowNumber
        });
    }

    const meta = {
        matched,
        total: cars.length,
        sheetRange: sheetData.range,
        sheetDomains: Object.keys(sheetData.stockByDomain || {}).length,
        driveFolders: driveData.foldersCount,
        totalImages: driveData.totalImages,
        descriptions: Object.keys(descriptionCache).length,
        refreshedAt: Date.now()
    };

    return { cars: updatedCars, updates, meta };
};

export const syncDealershipInventory = async (cars, options = {}) => {
    return applyDealershipSync(cars, {
        forceRefresh: options.forceRefresh !== undefined ? options.forceRefresh : true,
        generateDescriptions: options.generateDescriptions !== undefined ? options.generateDescriptions : true,
        includeDescriptions: options.includeDescriptions !== undefined ? options.includeDescriptions : true
    });
};

export const clearSyncCaches = () => {
    cachedSheetData = null;
    cachedDriveData = null;
    sheetCacheTimestamp = 0;
    driveCacheTimestamp = 0;
    Object.keys(descriptionCache).forEach((key) => delete descriptionCache[key]);
};
