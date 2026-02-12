
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  // قراءة رابط GAS من متغيرات البيئة
  const GAS_URL = process.env.GAS_URL || process.env.VITE_APP_SCRIPT_URL;

  if (!GAS_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GAS_URL is not configured in environment variables' }),
    };
  }

  const { httpMethod, queryStringParameters, body } = event;
  
  // بناء الرابط النهائي مع المعاملات (Query Params)
  const url = new URL(GAS_URL);
  Object.keys(queryStringParameters || {}).forEach(key => {
    url.searchParams.append(key, queryStringParameters![key]!);
  });

  try {
    const fetchOptions: RequestInit = {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json',
      },
      // في حالة POST نقوم بتمرير الـ body المستلم
      body: httpMethod === 'POST' ? body : undefined,
      redirect: 'follow', // ضروري لطلبات Google Script
    };

    const response = await fetch(url.toString(), fetchOptions);
    const data = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: data,
    };
  } catch (error: any) {
    console.error('GAS Proxy Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch from Google Apps Script', details: error.message }),
    };
  }
};
