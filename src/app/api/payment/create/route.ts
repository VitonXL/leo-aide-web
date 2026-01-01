"use server";

import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, orderId, email, description } = body;

    // ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ (Необходимо добавить в .env.local)
    const merchantId = process.env.FREEKASSA_MERCHANT_ID || "12345";
    const secret1 = process.env.FREEKASSA_SECRET_1 || "secret_key";
    const currency = "RUB";

    // 1. Генерация подписи (согласно документации FreeKassa)
    // Формула: md5(merchant_id:amount:secret_1:currency:order_id)
    const signString = `${merchantId}:${amount}:${secret1}:${currency}:${orderId}`;
    const signature = crypto.createHash('md5').update(signString).digest('hex');

    // 2. Формирование URL для редиректа
    const paymentUrl = new URL("https://pay.freekassa.ru/");
    paymentUrl.searchParams.append('m', merchantId);
    paymentUrl.searchParams.append('oa', amount);
    paymentUrl.searchParams.append('currency', currency);
    paymentUrl.searchParams.append('o', orderId);
    paymentUrl.searchParams.append('s', signature);
    paymentUrl.searchParams.append('em', email); // Email плательщика
    paymentUrl.searchParams.append('lang', 'ru');
    paymentUrl.searchParams.append('us_email', email);

    return NextResponse.json({ url: paymentUrl.toString() });
  } catch (error) {
    console.error("Payment Error:", error);
    return NextResponse.json({ error: "Ошибка создания платежа" }, { status: 500 });
  }
}