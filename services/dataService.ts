
import { Book, Question, User } from '../types';

// استخدام الـ Proxy المحلي لتجاوز مشاكل CORS في Netlify
const PROXY_ENDPOINT = '/.netlify/functions/gasProxy';

const BOOK_TAB_MAPPING: Record<string, string> = {
  [Book.ARD_AL_NIFAQ]: 'land_hypocrisy',
  [Book.THARTHARA]: 'nile_chitchat',
  [Book.MAGDOLINE]: 'madoline',
  [Book.AKHER_AYAM]: 'november_days'
};

/**
 * دالة مركزية للاتصال بالخادم عبر الـ Proxy
 */
async function apiCall(action: string, payload: any = {}, method: 'GET' | 'POST' = 'POST') {
  try {
    let url = PROXY_ENDPOINT;
    const options: RequestInit = {
      method: method,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (method === 'GET') {
      const params = new URLSearchParams({ action, ...payload });
      url += `?${params.toString()}`;
    } else {
      options.body = JSON.stringify({ action, ...payload });
    }

    console.log(`[Diagnostic] API ${method} request to: ${url}`);

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`API Error (${action}):`, error);
    throw error;
  }
}

export const fetchQuestionsByBook = async (book: Book): Promise<Question[]> => {
  const tabName = BOOK_TAB_MAPPING[book];
  
  try {
    const data = await apiCall('getQuestions', { tab: tabName }, 'GET');
    
    if (!data || !Array.isArray(data)) {
      console.warn("No data returned for tab:", tabName);
      return [];
    }
    
    return data.map((row: any, index: number) => ({
      id: index + 1,
      book,
      text: row.text,
      options: row.options,
      correctAnswer: String(row.correctAnswer),
      points: Number(row.points || 2.5)
    }));
  } catch (error) {
    console.error("fetchQuestionsByBook failed:", error);
    throw new Error("فشل في تحميل الأسئلة. يرجى التحقق من اتصال الإنترنت أو المحاولة لاحقاً.");
  }
};

export const saveParticipant = async (user: User): Promise<boolean> => {
  const payload = {
    fullName: user.fullName,
    nationalId: user.nationalId,
    phone: user.phone,
    center: user.center,
    totalScore: user.totalScore,
    scores: Object.entries(user.scores).map(([book, data]) => ({
      book,
      mcqScore: data?.mcqScore,
      essay: data?.essay
    })),
    registrationDate: user.registrationDate
  };

  try {
    const result = await apiCall('submitResult', payload, 'POST');
    return !!(result && result.success);
  } catch (error) {
    return false;
  }
};

export const verifyAdminLogin = async (username: string, password: string): Promise<boolean> => {
  try {
    const result = await apiCall('adminLogin', { user: username, pass: password }, 'GET');
    return !!(result && result.success);
  } catch (error) {
    return false;
  }
};

export const getParticipants = async (): Promise<any[]> => {
  try {
    const result = await apiCall('getParticipants', {}, 'GET');
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("getParticipants failed:", error);
    return [];
  }
};
