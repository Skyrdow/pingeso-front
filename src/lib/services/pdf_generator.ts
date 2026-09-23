import type {
	ConstantData,
	ImageGroup,
	OpcionModel,
	PresupuestoModel,
	VentanaModel
} from '$lib/types';
import { PDFDocument, PageSizes, rgb } from 'pdf-lib';
import type { PDFFont, PDFPage, RGB } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const PAGE_MARGIN = 38;
const BOTTOM_MARGIN = 42;
const LINE_HEIGHT = 12;

const palette = {
	ink: rgb(0.12, 0.18, 0.2),
	muted: rgb(0.38, 0.44, 0.46),
	petrol: rgb(0.06, 0.31, 0.29),
	petrolLight: rgb(0.91, 0.96, 0.95),
	amber: rgb(0.83, 0.6, 0.25),
	line: rgb(0.85, 0.89, 0.88),
	row: rgb(0.97, 0.98, 0.98),
	white: rgb(1, 1, 1)
};

type Column = { label: string; width: number; align?: 'left' | 'right' };

const columns: Column[] = [
	{ label: 'TIPO', width: 136 },
	{ label: 'COLOR', width: 52 },
	{ label: 'CRISTAL', width: 61 },
	{ label: 'ANCHO', width: 43, align: 'right' },
	{ label: 'ALTO', width: 43, align: 'right' },
	{ label: 'CANT.', width: 30, align: 'right' },
	{ label: 'PRECIO UNIT.', width: 68, align: 'right' },
	{ label: 'TOTAL', width: 70, align: 'right' }
];

function cleanText(value: string | null | undefined) {
	return (value ?? '').replace(/\\n/g, '\n').replace(/\r\n/g, '\n').trim();
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
	const lines: string[] = [];

	for (const paragraph of cleanText(text).split('\n')) {
		if (!paragraph.trim()) {
			lines.push('');
			continue;
		}

		let line = '';
		for (const word of paragraph.split(/\s+/)) {
			const candidate = line ? `${line} ${word}` : word;
			if (line && font.widthOfTextAtSize(candidate, size) > maxWidth) {
				lines.push(line);
				line = word;
			} else {
				line = candidate;
			}
		}
		if (line) lines.push(line);
	}

	return lines.length ? lines : [''];
}

function fitText(text: string, font: PDFFont, size: number, maxWidth: number) {
	if (font.widthOfTextAtSize(text, size) <= maxWidth) return text;
	let shortened = text;
	while (shortened.length && font.widthOfTextAtSize(`${shortened}...`, size) > maxWidth) {
		shortened = shortened.slice(0, -1);
	}
	return `${shortened}...`;
}

function drawRightText(
	page: PDFPage,
	text: string,
	x: number,
	y: number,
	maxWidth: number,
	font: PDFFont,
	size: number,
	color: RGB
) {
	const fitted = fitText(text, font, size, maxWidth);
	page.drawText(fitted, {
		x: x + maxWidth - font.widthOfTextAtSize(fitted, size),
		y,
		font,
		size,
		color
	});
}

function formatCurrency(value: number) {
	return new Intl.NumberFormat('es-CL', {
		style: 'currency',
		currency: 'CLP',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	})
		.format(Math.trunc(value))
		.replace(/\u00a0/g, ' ');
}

function formatDate(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '';
	return new Intl.DateTimeFormat('es-CL', {
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	}).format(date);
}

function getTypeLabel(window: VentanaModel, constants: ConstantData) {
	return constants.tipos.find((type) => type.id_tipo === window.id_tipo)?.descripcion_tipo ?? '';
}

function getColorLabel(window: VentanaModel, constants: ConstantData) {
	return constants.colores.find((color) => color.id_color === window.id_color)?.nombre_color ?? '';
}

function getGlassLabel(window: VentanaModel, constants: ConstantData) {
	return (
		constants.cristales.find((glass) => glass.id_cristal === window.id_cristal)?.desc_cristal ?? ''
	);
}

function optionMaterial(option: OpcionModel, constants: ConstantData) {
	const firstWindow = option.Ventanas[0];
	if (!firstWindow) return undefined;
	return constants.materiales.find((material) => material.id_material === firstWindow.id_material);
}

function drawWrappedText(
	page: PDFPage,
	text: string,
	x: number,
	top: number,
	maxWidth: number,
	font: PDFFont,
	size: number,
	color: RGB,
	lineHeight = LINE_HEIGHT
) {
	const lines = wrapText(text, font, size, maxWidth);
	lines.forEach((line, index) => {
		if (!line) return;
		page.drawText(line, { x, y: top - size - index * lineHeight, font, size, color });
	});
	return Math.max(lines.length, 1) * lineHeight;
}

function drawPageFooter(
	page: PDFPage,
	pageIndex: number,
	pageCount: number,
	width: number,
	regularFont: PDFFont,
	quoteId: number | undefined
) {
	page.drawLine({
		start: { x: PAGE_MARGIN, y: 30 },
		end: { x: width - PAGE_MARGIN, y: 30 },
		thickness: 0.6,
		color: palette.line
	});
	page.drawText(`Termoacústicos | Presupuesto ${quoteId ?? ''}`.trim(), {
		x: PAGE_MARGIN,
		y: 17,
		font: regularFont,
		size: 7,
		color: palette.muted
	});
	drawRightText(
		page,
		`${pageIndex + 1} / ${pageCount}`,
		PAGE_MARGIN,
		17,
		width - PAGE_MARGIN * 2,
		regularFont,
		7,
		palette.muted
	);
}

export const generatePDF = async (
	presupuesto: PresupuestoModel,
	imagenes: ImageGroup[],
	constantes: ConstantData
) => {
	const pdfDoc = await PDFDocument.create();
	pdfDoc.setTitle(`Cotización ${presupuesto.id_presupuesto ?? ''}`.trim());
	pdfDoc.setSubject('Presupuesto de ventanas');
	pdfDoc.setCreator('Termoacústicos');
	pdfDoc.registerFontkit(fontkit);
	const regularBytes = await fetch('/Archivo-Regular.ttf').then((response) =>
		response.arrayBuffer()
	);
	const regularFont = await pdfDoc.embedFont(regularBytes, { subset: true });
	const boldBytes = await fetch('/Archivo-Bold.ttf').then((response) => response.arrayBuffer());
	const boldFont = await pdfDoc.embedFont(boldBytes, { subset: true });

	const [width, height] = PageSizes.A4;
	const contentWidth = width - PAGE_MARGIN * 2;
	let page = pdfDoc.addPage(PageSizes.A4);
	let currentY = height - PAGE_MARGIN;

	const addPage = () => {
		page = pdfDoc.addPage(PageSizes.A4);
		page.drawRectangle({
			x: 0,
			y: height - 5,
			width,
			height: 5,
			color: palette.petrol
		});
		currentY = height - PAGE_MARGIN;
	};

	const ensureSpace = (needed: number) => {
		if (currentY - needed < BOTTOM_MARGIN) addPage();
	};

	page.drawRectangle({
		x: 0,
		y: height - 7,
		width,
		height: 7,
		color: palette.petrol
	});
	page.drawRectangle({
		x: PAGE_MARGIN,
		y: height - 7,
		width: 46,
		height: 7,
		color: palette.amber
	});

	page.drawText('COTIZACIÓN DE VENTANAS', {
		x: PAGE_MARGIN,
		y: currentY - 25,
		font: boldFont,
		size: 19,
		color: palette.petrol
	});
	drawRightText(
		page,
		`N.° ${String(presupuesto.id_presupuesto ?? 0).padStart(5, '0')}`,
		PAGE_MARGIN,
		currentY - 15,
		contentWidth,
		boldFont,
		10,
		palette.ink
	);
	drawRightText(
		page,
		formatDate(presupuesto.fecha),
		PAGE_MARGIN,
		currentY - 29,
		contentWidth,
		regularFont,
		8,
		palette.muted
	);
	currentY -= 43;

	const cardGap = 10;
	const cardWidth = (contentWidth - cardGap) / 2;
	const companyLines = [
		cleanText(constantes.constantes_pdf.texto_izquierda),
		cleanText(constantes.constantes_pdf.texto_derecha)
	];
	const companyLayouts = companyLines.map((text) => wrapText(text, regularFont, 8, cardWidth - 24));
	const companyCardHeight = Math.max(60, ...companyLayouts.map((lines) => lines.length * 10 + 25));
	ensureSpace(companyCardHeight + 20);

	companyLines.forEach((text, index) => {
		const x = PAGE_MARGIN + index * (cardWidth + cardGap);
		page.drawRectangle({
			x,
			y: currentY - companyCardHeight,
			width: cardWidth,
			height: companyCardHeight,
			color: palette.row,
			borderColor: palette.line,
			borderWidth: 0.5
		});
		page.drawText(index === 0 ? 'EMISOR' : 'CONTACTO COMERCIAL', {
			x: x + 12,
			y: currentY - 14,
			font: boldFont,
			size: 7,
			color: palette.petrol
		});
		drawWrappedText(
			page,
			text,
			x + 12,
			currentY - 20,
			cardWidth - 24,
			regularFont,
			8,
			palette.ink,
			10
		);
	});
	currentY -= companyCardHeight + 14;

	const clientMessage = cleanText(constantes.constantes_pdf.texto_cliente)
		.replaceAll('{nombre}', presupuesto.nombre_cliente)
		.replaceAll('{numero}', String(presupuesto.id_presupuesto ?? 0));
	const clientDetails = [
		presupuesto.Cliente?.rut_cliente ? `RUT ${presupuesto.Cliente.rut_cliente}` : '',
		presupuesto.Cliente?.telefono ?? '',
		presupuesto.Cliente?.email ?? '',
		presupuesto.Cliente?.direccion ?? ''
	].filter(Boolean);
	const messageLines = wrapText(clientMessage, regularFont, 8, contentWidth - 24);
	const detailsRows = Math.ceil(clientDetails.length / 2);
	const clientCardHeight = Math.max(76, 43 + messageLines.length * 10 + detailsRows * 12);
	ensureSpace(clientCardHeight + 20);

	page.drawRectangle({
		x: PAGE_MARGIN,
		y: currentY - clientCardHeight,
		width: contentWidth,
		height: clientCardHeight,
		color: palette.petrolLight
	});
	page.drawRectangle({
		x: PAGE_MARGIN,
		y: currentY - clientCardHeight,
		width: 3,
		height: clientCardHeight,
		color: palette.amber
	});
	page.drawText('PREPARADO PARA', {
		x: PAGE_MARGIN + 14,
		y: currentY - 15,
		font: boldFont,
		size: 7,
		color: palette.petrol
	});
	page.drawText(fitText(presupuesto.nombre_cliente || 'Cliente', boldFont, 12, contentWidth - 28), {
		x: PAGE_MARGIN + 14,
		y: currentY - 31,
		font: boldFont,
		size: 12,
		color: palette.ink
	});
	let clientY = currentY - 38;
	if (clientMessage && cleanText(clientMessage) !== presupuesto.nombre_cliente) {
		const messageHeight = drawWrappedText(
			page,
			clientMessage,
			PAGE_MARGIN + 14,
			clientY,
			contentWidth - 28,
			regularFont,
			8,
			palette.muted,
			10
		);
		clientY -= messageHeight;
	}
	clientDetails.forEach((detail, index) => {
		const col = index % 2;
		const row = Math.floor(index / 2);
		page.drawText(fitText(detail, regularFont, 7, (contentWidth - 32) / 2), {
			x: PAGE_MARGIN + 14 + col * (contentWidth / 2),
			y: clientY - 10 - row * 11,
			font: regularFont,
			size: 7,
			color: palette.ink
		});
	});
	currentY -= clientCardHeight + 20;

	async function drawImageGroup(group: ImageGroup | undefined) {
		if (!group?.imagenes.length) return;
		const imageHeight = Math.min(Math.max(group.height || 38, 26), 54);
		ensureSpace(imageHeight + 12);
		const gap = 10;
		const imageWidth = (contentWidth - gap * (group.imagenes.length - 1)) / group.imagenes.length;
		for (const [index, image] of group.imagenes.entries()) {
			const raw = image.bytes as unknown as string;
			const base64 = raw.includes(',') ? raw.slice(raw.indexOf(',') + 1) : raw;
			const imageBytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
			const embeddedImage = await pdfDoc.embedPng(imageBytes);
			const scaled = embeddedImage.scaleToFit(imageWidth, imageHeight);
			page.drawImage(embeddedImage, {
				x: PAGE_MARGIN + index * (imageWidth + gap) + (imageWidth - scaled.width) / 2,
				y: currentY - imageHeight + (imageHeight - scaled.height) / 2,
				width: scaled.width,
				height: scaled.height
			});
		}
		currentY -= imageHeight + 12;
	}

	await drawImageGroup(imagenes.find((group) => group.img_group === 1));
	await drawImageGroup(imagenes.find((group) => group.img_group === 2));

	function drawTableHeader() {
		const tableTop = currentY;
		const rowHeight = 22;
		page.drawRectangle({
			x: PAGE_MARGIN,
			y: tableTop - rowHeight,
			width: contentWidth,
			height: rowHeight,
			color: palette.petrol
		});
		let x = PAGE_MARGIN + 8;
		for (const column of columns) {
			if (column.align === 'right') {
				drawRightText(
					page,
					column.label,
					x,
					tableTop - 14,
					column.width - 8,
					boldFont,
					6.4,
					palette.white
				);
			} else {
				page.drawText(column.label, {
					x,
					y: tableTop - 14,
					font: boldFont,
					size: 6.4,
					color: palette.white
				});
			}
			x += column.width;
		}
		currentY -= rowHeight;
	}

	function drawWindowRow(window: VentanaModel, constants: ConstantData, rowIndex: number) {
		const values = [
			getTypeLabel(window, constants),
			getColorLabel(window, constants),
			getGlassLabel(window, constants),
			window.ancho.toLocaleString('es-CL'),
			window.alto.toLocaleString('es-CL'),
			String(window.cantidad),
			formatCurrency(window.precio_unitario),
			formatCurrency(window.precio_total)
		];
		const lineCounts = values.map((value, index) =>
			index < 3 ? wrapText(value, regularFont, 7.3, columns[index].width - 8).length : 1
		);
		const rowHeight = Math.max(25, Math.max(...lineCounts) * 9 + 10);
		if (rowIndex % 2 === 0) {
			page.drawRectangle({
				x: PAGE_MARGIN,
				y: currentY - rowHeight,
				width: contentWidth,
				height: rowHeight,
				color: palette.row
			});
		}
		page.drawLine({
			start: { x: PAGE_MARGIN, y: currentY - rowHeight },
			end: { x: width - PAGE_MARGIN, y: currentY - rowHeight },
			thickness: 0.45,
			color: palette.line
		});

		let x = PAGE_MARGIN + 8;
		values.forEach((value, index) => {
			const column = columns[index];
			if (index < 3) {
				const lines = wrapText(value, regularFont, 7.3, column.width - 8);
				lines.forEach((line, lineIndex) => {
					page.drawText(line, {
						x,
						y: currentY - 11 - lineIndex * 9,
						font: regularFont,
						size: 7.3,
						color: palette.ink
					});
				});
			} else {
				drawRightText(page, value, x, currentY - 15, column.width - 8, regularFont, 7, palette.ink);
			}
			x += column.width;
		});
		currentY -= rowHeight;
	}

	for (const [optionIndex, option] of presupuesto.Opciones.entries()) {
		const material = optionMaterial(option, constantes);
		const headingHeight = 31;
		ensureSpace(headingHeight + 22 + 25 + 66);
		page.drawRectangle({
			x: PAGE_MARGIN,
			y: currentY - headingHeight,
			width: contentWidth,
			height: headingHeight,
			color: palette.petrolLight
		});
		page.drawRectangle({
			x: PAGE_MARGIN,
			y: currentY - headingHeight,
			width: 3,
			height: headingHeight,
			color: palette.amber
		});
		page.drawText(`OPCIÓN ${optionIndex + 1}`, {
			x: PAGE_MARGIN + 12,
			y: currentY - 12,
			font: boldFont,
			size: 7,
			color: palette.petrol
		});
		page.drawText(fitText(material?.texto_libre ?? 'Ventanas', boldFont, 9, contentWidth - 24), {
			x: PAGE_MARGIN + 12,
			y: currentY - 25,
			font: boldFont,
			size: 9,
			color: palette.ink
		});
		const qualifiers = [material?.texto_calidad, material?.texto_termopanel]
			.filter(Boolean)
			.join('  |  ');
		if (qualifiers) {
			drawRightText(
				page,
				fitText(qualifiers, regularFont, 7, contentWidth - 180),
				PAGE_MARGIN + 180,
				currentY - 24,
				contentWidth - 192,
				regularFont,
				7,
				palette.muted
			);
		}
		currentY -= headingHeight + 5;
		drawTableHeader();

		for (const [windowIndex, window] of option.Ventanas.entries()) {
			const rowHeight = Math.max(
				25,
				Math.max(
					...[
						getTypeLabel(window, constantes),
						getColorLabel(window, constantes),
						getGlassLabel(window, constantes)
					].map(
						(value, index) => wrapText(value, regularFont, 7.3, columns[index].width - 8).length
					)
				) *
					9 +
					10
			);
			if (currentY - rowHeight < BOTTOM_MARGIN + 70) {
				addPage();
				page.drawText(`OPCIÓN ${optionIndex + 1} (continuación)`, {
					x: PAGE_MARGIN,
					y: currentY - 12,
					font: boldFont,
					size: 8,
					color: palette.petrol
				});
				currentY -= 18;
				drawTableHeader();
			}
			drawWindowRow(window, constantes, windowIndex);
		}

		ensureSpace(64);
		const subtotal = option.Ventanas.reduce((total, window) => total + window.precio_total, 0);
		const totals = [
			['Transporte', presupuesto.valor_despacho],
			['Instalación', presupuesto.valor_instalacion],
			['Total IVA incluido', subtotal + presupuesto.valor_despacho + presupuesto.valor_instalacion]
		] as const;
		const totalBoxWidth = 220;
		const totalRowHeight = 18;
		const totalBoxX = width - PAGE_MARGIN - totalBoxWidth;
		page.drawRectangle({
			x: totalBoxX,
			y: currentY - totalRowHeight * totals.length,
			width: totalBoxWidth,
			height: totalRowHeight * totals.length,
			color: palette.row,
			borderColor: palette.line,
			borderWidth: 0.6
		});
		totals.forEach(([label, value], index) => {
			const y = currentY - 12 - index * totalRowHeight;
			if (index === 2) {
				page.drawRectangle({
					x: totalBoxX,
					y: currentY - totalRowHeight * totals.length,
					width: totalBoxWidth,
					height: totalRowHeight,
					color: palette.petrolLight
				});
			}
			page.drawText(label.toUpperCase(), {
				x: totalBoxX + 10,
				y,
				font: index === 2 ? boldFont : regularFont,
				size: index === 2 ? 7.2 : 7,
				color: index === 2 ? palette.petrol : palette.muted
			});
			drawRightText(
				page,
				formatCurrency(value),
				totalBoxX + 10,
				y,
				totalBoxWidth - 20,
				index === 2 ? boldFont : regularFont,
				index === 2 ? 8 : 7,
				index === 2 ? palette.petrol : palette.ink
			);
		});
		currentY -= totalRowHeight * totals.length + 16;
	}

	await drawImageGroup(imagenes.find((group) => group.img_group === 3));
	const notes = cleanText(presupuesto.texto_libre);
	if (notes) {
		const noteLines = wrapText(notes, regularFont, 8, contentWidth - 24);
		const noteHeight = 28 + noteLines.length * 11;
		ensureSpace(noteHeight);
		page.drawRectangle({
			x: PAGE_MARGIN,
			y: currentY - noteHeight,
			width: contentWidth,
			height: noteHeight,
			color: palette.row,
			borderColor: palette.line,
			borderWidth: 0.5
		});
		page.drawText('NOTAS', {
			x: PAGE_MARGIN + 12,
			y: currentY - 14,
			font: boldFont,
			size: 7,
			color: palette.petrol
		});
		drawWrappedText(
			page,
			notes,
			PAGE_MARGIN + 12,
			currentY - 19,
			contentWidth - 24,
			regularFont,
			8,
			palette.ink,
			11
		);
	}

	const pages = pdfDoc.getPages();
	pages.forEach((pdfPage, index) =>
		drawPageFooter(pdfPage, index, pages.length, width, regularFont, presupuesto.id_presupuesto)
	);

	const bytes = await pdfDoc.save();
	return URL.createObjectURL(
		new Blob([bytes.slice().buffer as ArrayBuffer], { type: 'application/pdf' })
	);
};
