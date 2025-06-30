// src/utils/geminiExtractor.util.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config';

if (!config.google.apiKey) {
  throw new Error('Google API key is not configured');
}
const genAI = new GoogleGenerativeAI(config.google.apiKey);

interface ExtractedPage {
  loaiTrang: 'NOI_DUNG' | 'CAU_HOI';
  tieuDe: string;
  noiDung?: string;
  loaiCauTraLoi?: 'SINGLE_SELECT' | 'MULTI_SELECT' | 'TRUE_FALSE';
  danhSachLuaChon?: Array<{
    noiDung: string;
    ketQua: boolean;
  }>;
}

interface ExtractedRoomData {
  tenPhong: string;
  moTa: string;
  danhSachTrang: ExtractedPage[];
}

const systemPrompt = `
Bạn là một AI chuyên gia trong việc tạo nội dung học tập từ tài liệu. 
Nhiệm vụ của bạn là phân tích nội dung được cung cấp và tạo ra một cấu trúc phòng học bao gồm:

1. Các slide kiến thức (loaiTrang: "NOI_DUNG")
2. Các câu hỏi kiểm tra (loaiTrang: "CAU_HOI") với các lựa chọn

HƯỚNG DẪN CHI TIẾT:

📚 SLIDE NỘI DUNG (loaiTrang: "NOI_DUNG"):
- Mỗi slide PHẢI có tiêu đề rõ ràng (1-300 ký tự)
- Nội dung chi tiết nhưng súc tích (tối đa 5000 ký tự)
- Mỗi slide tập trung vào MỘT ý chính
- Chia nhỏ nội dung phức tạp thành nhiều slide
- KHÔNG có danhSachLuaChon cho loại này

❓ CÂU HỎI KIỂM TRA (loaiTrang: "CAU_HOI"):
- Tiêu đề là câu hỏi (1-300 ký tự)
- PHẢI có loaiCauTraLoi: "SINGLE_SELECT", "MULTI_SELECT", hoặc "TRUE_FALSE"
- Số lượng lựa chọn:
  * SINGLE_SELECT: 2-10 lựa chọn, CHỈ 1 đáp án đúng
  * MULTI_SELECT: 2-10 lựa chọn, ít nhất 1 đáp án đúng
  * TRUE_FALSE: CHÍNH XÁC 2 lựa chọn (Đúng/Sai)
- Mỗi lựa chọn: noiDung (1-500 ký tự), ketQua (true/false)
- Thời gian mặc định: 30 giây (sẽ được hệ thống tự động thêm)

📊 SỐ LƯỢNG VÀ CÂN BẰNG:
- Tối thiểu 3-5 câu hỏi, có thể nhiều hơn tùy độ dài tài liệu
- Tỷ lệ đề xuất: 70% nội dung, 30% câu hỏi
- Đa dạng loại câu hỏi (không chỉ dùng SINGLE_SELECT)
- Câu hỏi phải kiểm tra được kiến thức quan trọng

🎯 YÊU CẦU BẮT BUỘC:
1. Mỗi trang PHẢI có tiêu đề khác nhau
2. Câu hỏi PHẢI liên quan trực tiếp đến nội dung đã học
3. PHẢI có ít nhất 1 câu hỏi cho mỗi khái niệm quan trọng
4. Sử dụng tiếng Việt rõ ràng, dễ hiểu
5. Tránh lặp lại nội dung giữa các slide

📋 CẤU TRÚC JSON TRẢ VỀ:
{
  "moTa": "Mô tả ngắn gọn về nội dung phòng học (tối đa 1000 ký tự)",
  "danhSachTrang": [
    {
      "loaiTrang": "NOI_DUNG",
      "tieuDe": "Tiêu đề slide kiến thức",
      "noiDung": "Nội dung chi tiết của slide"
    },
    {
      "loaiTrang": "CAU_HOI",
      "tieuDe": "Câu hỏi cần trả lời?",
      "loaiCauTraLoi": "SINGLE_SELECT",
      "danhSachLuaChon": [
        {"noiDung": "Lựa chọn A", "ketQua": false},
        {"noiDung": "Lựa chọn B", "ketQua": true},
        {"noiDung": "Lựa chọn C", "ketQua": false},
        {"noiDung": "Lựa chọn D", "ketQua": false}
      ]
    },
    {
      "loaiTrang": "CAU_HOI",
      "tieuDe": "Chọn TẤT CẢ đáp án đúng:",
      "loaiCauTraLoi": "MULTI_SELECT",
      "danhSachLuaChon": [
        {"noiDung": "Đáp án 1", "ketQua": true},
        {"noiDung": "Đáp án 2", "ketQua": false},
        {"noiDung": "Đáp án 3", "ketQua": true},
        {"noiDung": "Đáp án 4", "ketQua": false}
      ]
    },
    {
      "loaiTrang": "CAU_HOI",
      "tieuDe": "Khẳng định này đúng hay sai?",
      "loaiCauTraLoi": "TRUE_FALSE",
      "danhSachLuaChon": [
        {"noiDung": "Đúng", "ketQua": true},
        {"noiDung": "Sai", "ketQua": false}
      ]
    }
  ]
}

⚠️ LƯU Ý QUAN TRỌNG:
- KHÔNG thêm các trường không cần thiết như thuTu, diem, thoiGianGioiHan
- ĐỪNG tạo danhSachLuaChon cho loaiTrang "NOI_DUNG"
- KIỂM TRA kỹ số lượng lựa chọn cho từng loại câu hỏi
- ĐẢM BẢO mỗi câu hỏi có ít nhất 1 đáp án đúng
`;

// Enhanced prompt function with better context
export const generateRoomDataFromContent = async (
  content: string,
  roomName: string,
  userPrompt: string
): Promise<ExtractedRoomData | null> => {
  try {
    console.log('Starting room data generation with Gemini...');
    console.log('Content length:', content.length);
    console.log('Room name:', roomName);
    console.log('User prompt:', userPrompt);

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json'
      }
    });

    // Enhanced prompt with better structure
    const prompt = `
${systemPrompt}

🎯 YÊU CẦU CỤ THỂ TỪ NGƯỜI DÙNG:
${userPrompt}

📌 THÔNG TIN PHÒNG HỌC:
- Tên phòng: ${roomName}
- Mục tiêu: Tạo nội dung học tập có cấu trúc, dễ hiểu và có câu hỏi kiểm tra phù hợp

📄 NỘI DUNG TÀI LIỆU CẦN PHÂN TÍCH:
${content}

⚡ HÀNH ĐỘNG:
Hãy phân tích tài liệu trên và tạo cấu trúc phòng học theo format JSON đã chỉ định.
Ưu tiên yêu cầu từ người dùng trong việc tạo nội dung và câu hỏi.
Đảm bảo tất cả các quy tắc validation được tuân thủ.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const parsedData = JSON.parse(text);

      // Enhanced validation and data cleaning
      const roomData: ExtractedRoomData = {
        tenPhong: roomName,
        moTa: parsedData.moTa?.substring(0, 1000) || 'Phòng học được tạo từ tài liệu',
        danhSachTrang: parsedData.danhSachTrang.map((trang: any, index: number) => {
          // Basic validation
          if (!trang.loaiTrang || !['NOI_DUNG', 'CAU_HOI'].includes(trang.loaiTrang)) {
            throw new Error(`Invalid loaiTrang at index ${index}`);
          }

          // Clean and validate title
          const tieuDe = (trang.tieuDe || '').trim().substring(0, 300);
          if (!tieuDe) {
            throw new Error(`Empty title at index ${index}`);
          }

          // Build page object
          const pageData: any = {
            loaiTrang: trang.loaiTrang,
            tieuDe: tieuDe,
            thuTu: index + 1,
            diem: 'BINH_THUONG'
          };

          if (trang.loaiTrang === 'NOI_DUNG') {
            // Content page
            pageData.noiDung = (trang.noiDung || '').substring(0, 5000);
            // Ensure no choices for content pages
            pageData.danhSachLuaChon = [];
          } else {
            // Question page
            pageData.thoiGianGioiHan = 30;
            pageData.loaiCauTraLoi = trang.loaiCauTraLoi || 'SINGLE_SELECT';

            // Validate question type
            if (!['SINGLE_SELECT', 'MULTI_SELECT', 'TRUE_FALSE'].includes(pageData.loaiCauTraLoi)) {
              pageData.loaiCauTraLoi = 'SINGLE_SELECT';
            }

            // Validate choices
            if (!Array.isArray(trang.danhSachLuaChon) || trang.danhSachLuaChon.length < 2) {
              throw new Error(`Invalid choices for question at index ${index}`);
            }

            // Clean and validate each choice
            pageData.danhSachLuaChon = trang.danhSachLuaChon.map((luaChon: any) => ({
              noiDung: (luaChon.noiDung || '').trim().substring(0, 500),
              ketQua: Boolean(luaChon.ketQua)
            }));

            // Validate choice count based on type
            const choiceCount = pageData.danhSachLuaChon.length;
            if (pageData.loaiCauTraLoi === 'TRUE_FALSE' && choiceCount !== 2) {
              throw new Error(`TRUE_FALSE question must have exactly 2 choices at index ${index}`);
            }
            if (choiceCount > 10) {
              pageData.danhSachLuaChon = pageData.danhSachLuaChon.slice(0, 10);
            }

            // Validate correct answers
            const correctAnswers = pageData.danhSachLuaChon.filter((c: any) => c.ketQua).length;
            if (correctAnswers === 0) {
              // Force at least one correct answer
              pageData.danhSachLuaChon[0].ketQua = true;
            }

            // For SINGLE_SELECT, ensure only one correct answer
            if (pageData.loaiCauTraLoi === 'SINGLE_SELECT' && correctAnswers > 1) {
              // Keep only the first correct answer
              let foundFirst = false;
              pageData.danhSachLuaChon = pageData.danhSachLuaChon.map((c: any) => {
                if (c.ketQua && foundFirst) {
                  return { ...c, ketQua: false };
                }
                if (c.ketQua) {
                  foundFirst = true;
                }
                return c;
              });
            }
          }

          return pageData;
        })
      };

      // Final validation
      if (roomData.danhSachTrang.length === 0) {
        throw new Error('No pages generated');
      }

      // Check if we have at least one question
      const questionCount = roomData.danhSachTrang.filter(t => t.loaiTrang === 'CAU_HOI').length;
      if (questionCount === 0) {
        console.warn('Warning: No questions generated. Consider adjusting the prompt.');
      }

      return roomData;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.error('Raw response:', text);
      return null;
    }
  } catch (error) {
    console.error('Error generating room data with Gemini:', error);
    return null;
  }
};