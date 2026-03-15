export interface AlphabetLetter {
  char: string;
  name: string;
  pronunciation: string;
  usage: string;
  examples: string[];
  story: string; // Story/Poem about the letter
  combinations: string[]; // Common combinations/spelling rules
}

export interface GrammarRule {
  title: string;
  description: string;
  examples: string[];
}

export interface Exercise {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
  tags?: string[]; // e.g., 'spelling', 'vocabulary', 'grammar', or specific letter 'A', 'B'
}

export interface DictionaryEntry {
  word: string;
  definition: string;
  context: string;
  story?: string;
}

export interface LearningDocument {
  id: string;
  title: string;
  content: string; // Markdown supported
  chapters: { title: string; content: string }[];
}

export const VIETNAMESE_ALPHABET: AlphabetLetter[] = [
  { 
    char: 'A', 
    name: 'A', 
    pronunciation: 'a', 
    usage: 'Nguyên âm chính, mở rộng miệng.', 
    examples: ['Ba', 'Ca', 'Xa'],
    story: 'Chữ A như mái nhà tranh\nChe mưa che nắng, cây xanh quanh vườn.\nBé học chữ A thân thương,\nBắt đầu câu chuyện, con đường tương lai.',
    combinations: ['a + n = an (bàn)', 'a + m = am (cam)', 'a + i = ai (mai)', 'a + o = ao (sao)']
  },
  { 
    char: 'Ă', 
    name: 'Á', 
    pronunciation: 'á', 
    usage: 'Nguyên âm ngắn của A, miệng mở rộng nhưng âm ngắn hơn.', 
    examples: ['Ăn', 'Bắt', 'Cắt'],
    story: 'Chữ Ă đội mũ trên đầu,\nNhư vầng trăng khuyết đêm thâu sáng ngời.\nBé học chữ Ă vui tươi,\nNhớ thêm cái mũ, nụ cười nở hoa.',
    combinations: ['ă + n = ăn (khăn)', 'ă + m = ăm (tăm)', 'ă + p = ắp (cặp)']
  },
  { 
    char: 'Â', 
    name: 'Ớ', 
    pronunciation: 'ớ', 
    usage: 'Nguyên âm, âm phát ra từ cổ họng, miệng hơi mở.', 
    examples: ['Âm', 'Cân', 'Sân'],
    story: 'Chữ Â đội nón giống ô,\nChe mưa cho bé, thầy cô dặn dò.\nHọc hành chăm chỉ, chẳng lo,\nChữ Â nhớ nhé, đừng so với A.',
    combinations: ['â + n = ân (sân)', 'â + m = âm (mâm)', 'â + u = âu (trâu)']
  },
  { 
    char: 'B', 
    name: 'Bê', 
    pronunciation: 'bờ', 
    usage: 'Phụ âm môi, mím môi lại rồi bật ra.', 
    examples: ['Bà', 'Bố', 'Bé'],
    story: 'Chữ B bụng bự tròn vo,\nGiống như bác Gấu ăn no ngủ khì.\nBé ơi nhớ lấy chữ B,\nBà, Bố, Bác, Bé... khắc ghi trong lòng.',
    combinations: ['b + a = ba', 'b + e = be', 'b + i = bi', 'b + o = bo', 'b + u = bu']
  },
  { 
    char: 'C', 
    name: 'Xê', 
    pronunciation: 'cờ', 
    usage: 'Phụ âm tắc, lưỡi chạm ngạc mềm.', 
    examples: ['Cá', 'Cơm', 'Cây'],
    story: 'Chữ C cong giống trăng liềm,\nSoi sáng ruộng lúa, êm đềm làng quê.\nCon Cò, Con Cá, Con Cua,\nChữ C đứng trước, bé đùa vui sao.',
    combinations: ['c + a = ca', 'c + o = co', 'c + u = cu', 'c + ư = cư']
  },
  { 
    char: 'D', 
    name: 'Dê', 
    pronunciation: 'dờ', 
    usage: 'Phụ âm, lưỡi chạm răng trên (miền Bắc) hoặc cong lưỡi (miền Nam).', 
    examples: ['Da', 'Dê', 'Dì'],
    story: 'Chữ D lưng thẳng, bụng tròn,\nGiống như quả Dứa thơm ngon ngọt lành.\nDì, Dượng, Dế mèn, trời xanh,\nChữ D đứng đó, hiền lành dễ thương.',
    combinations: ['d + a = da', 'd + e = de', 'd + i = di', 'd + o = do']
  },
  { 
    char: 'Đ', 
    name: 'Đê', 
    pronunciation: 'đờ', 
    usage: 'Phụ âm đầu lưỡi, bật hơi mạnh hơn D.', 
    examples: ['Đá', 'Đi', 'Đâu'],
    story: 'Chữ Đ có gạch ngang vai,\nGiống anh D đó, nhưng oai hơn nhiều.\nĐi đâu, Đứng đó, Đều đều,\nChữ Đ mạnh mẽ, bao điều hay ho.',
    combinations: ['đ + a = đa', 'đ + e = đe', 'đ + i = đi', 'đ + o = đo']
  },
  { 
    char: 'E', 
    name: 'E', 
    pronunciation: 'e', 
    usage: 'Nguyên âm, miệng mở vừa, lưỡi đưa ra trước.', 
    examples: ['Em', 'Xe', 'Me'],
    story: 'Chữ E cong giống con tôm,\nEm bé tập nói, miệng mồm xinh xinh.\nXe đạp, Quả Me, lung linh,\nChữ E đơn giản, chúng mình cùng tô.',
    combinations: ['e + n = en (sen)', 'e + m = em (kem)', 'e + o = eo (heo)']
  },
  { 
    char: 'Ê', 
    name: 'Ê', 
    pronunciation: 'ê', 
    usage: 'Nguyên âm, miệng hẹp hơn E, âm cao hơn.', 
    examples: ['Êm', 'Bê', 'Về'],
    story: 'Chữ Ê đội mũ trên đầu,\nGiống E nhưng lại có "lầu" che mưa.\nCon Bê, Quả Lê, say sưa,\nChữ Ê êm ái, như vừa giấc mơ.',
    combinations: ['ê + n = ên (tên)', 'ê + m = êm (đêm)', 'ê + u = êu (kêu)']
  },
  { 
    char: 'G', 
    name: 'Gê', 
    pronunciation: 'gờ', 
    usage: 'Phụ âm, cuống lưỡi chạm ngạc mềm.', 
    examples: ['Gà', 'Gỗ', 'Gần'],
    story: 'Chữ G móc ngược xuống dưới,\nCon Gà cục tác, sáng tươi gọi mời.\nGỗ quý, Gần gũi, Gương soi,\nChữ G gắn bó, trọn đời bên ta.',
    combinations: ['g + a = ga', 'g + o = go', 'g + u = gu', 'g + ư = gư']
  },
  { 
    char: 'H', 
    name: 'Hát', 
    pronunciation: 'hờ', 
    usage: 'Phụ âm thanh hầu, hơi thoát ra tự do.', 
    examples: ['Hà', 'Hồ', 'Hè'],
    story: 'Chữ H như chiếc ghế ngồi,\nCho bà, cho mẹ, nghỉ ngơi trưa hè.\nH hoa, H thường, lắng nghe,\nHọc hành chăm chỉ, bạn bè mến yêu.',
    combinations: ['h + a = ha', 'h + e = he', 'h + i = hi', 'h + o = ho']
  },
  { 
    char: 'I', 
    name: 'I ngắn', 
    pronunciation: 'i', 
    usage: 'Nguyên âm, miệng dẹt, âm cao.', 
    examples: ['Im', 'Bi', 'Đi'],
    story: 'Chữ I một nét thẳng tưng,\nThêm chấm trên đầu, sáng bừng mắt ai.\nĐi học, Viên bi, ngày mai,\nChữ I ngắn gọn, chẳng sai bao giờ.',
    combinations: ['i + n = in (tin)', 'i + t = it (mít)', 'i + m = im (chim)']
  },
  { 
    char: 'K', 
    name: 'Ca', 
    pronunciation: 'cờ', 
    usage: 'Phụ âm, giống C nhưng dùng trước i, e, ê.', 
    examples: ['Kéo', 'Kì', 'Kệ'],
    story: 'Chữ K dang tay đón chào,\nKéo co, Kể chuyện, biết bao vui vầy.\nKìa con Kiến nhỏ leo cây,\nChữ K đứng đó, sum vầy bên nhau.',
    combinations: ['k + e = ke', 'k + ê = kê', 'k + i = ki']
  },
  { 
    char: 'L', 
    name: 'El-lờ', 
    pronunciation: 'lờ', 
    usage: 'Phụ âm bên, đầu lưỡi chạm lợi trên.', 
    examples: ['Lá', 'Lê', 'Lúa'],
    story: 'Chữ L cao vút trời xanh,\nLá cây, Quả Lê, ngọt lành quê hương.\nLúa vàng trải rộng con đường,\nChữ L lấp lánh, tình thương dạt dào.',
    combinations: ['l + a = la', 'l + e = le', 'l + i = li', 'l + o = lo']
  },
  { 
    char: 'M', 
    name: 'Em-mờ', 
    pronunciation: 'mờ', 
    usage: 'Phụ âm mũi, môi mím lại.', 
    examples: ['Mẹ', 'Mơ', 'Mưa'],
    story: 'Chữ M hai núi nhấp nhô,\nMẹ yêu, Mơ ước, tuổi thơ ngọt ngào.\nMưa rơi tí tách bờ ao,\nChữ M mềm mại, đi vào lời ru.',
    combinations: ['m + a = ma', 'm + e = me', 'm + i = mi', 'm + o = mo']
  },
  { 
    char: 'N', 
    name: 'En-nờ', 
    pronunciation: 'nờ', 
    usage: 'Phụ âm mũi, đầu lưỡi chạm lợi trên.', 
    examples: ['Na', 'Nơ', 'Nụ'],
    story: 'Chữ N một núi thấp thôi,\nNụ hoa, Cái Nơ, xinh tươi rạng ngời.\nNắng vàng chiếu sáng muôn nơi,\nChữ N nắn nót, trọn đời không quên.',
    combinations: ['n + a = na', 'n + e = ne', 'n + i = ni', 'n + o = no']
  },
  { 
    char: 'O', 
    name: 'O', 
    pronunciation: 'o', 
    usage: 'Nguyên âm tròn môi.', 
    examples: ['To', 'Lo', 'Bo'],
    story: 'Chữ O tròn như quả trứng gà,\nÔng trăng tròn vạnh, sáng là sáng soi.\nCon Ong chăm chỉ tìm mòi,\nChữ O tròn trịa, bé coi nhớ liền.',
    combinations: ['o + n = on (con)', 'o + m = om (bom)', 'o + c = oc (sóc)']
  },
  { 
    char: 'Ô', 
    name: 'Ô', 
    pronunciation: 'ô', 
    usage: 'Nguyên âm tròn môi, hẹp hơn O.', 
    examples: ['Cô', 'Tô', 'Xô'],
    story: 'Chữ Ô đội mũ đi mưa,\nCô giáo, Cái Xô, sớm trưa chuyên cần.\nÔ tô chạy bánh xoay vần,\nChữ Ô ố ồ, thật gần thật xa.',
    combinations: ['ô + n = ôn (tôn)', 'ô + m = ôm (tôm)', 'ô + c = ốc (gốc)']
  },
  { 
    char: 'Ơ', 
    name: 'Ơ', 
    pronunciation: 'ơ', 
    usage: 'Nguyên âm, miệng mở tự nhiên, không tròn môi.', 
    examples: ['Bơ', 'Mơ', 'Cờ'],
    story: 'Chữ Ơ có râu bên mình,\nLá Cờ, Quả Mơ, thắm tình quê hương.\nBơ sáp béo ngậy, thơm lừng,\nChữ Ơ ở đó, xin đừng lãng quên.',
    combinations: ['ơ + n = ơn (sơn)', 'ơ + m =ơm (cơm)', 'ơ + i = ơi (chơi)']
  },
  { 
    char: 'P', 
    name: 'Pê', 
    pronunciation: 'pờ', 
    usage: 'Phụ âm môi, thường đứng đầu trong từ vay mượn hoặc cuối từ.', 
    examples: ['Pin', 'Đẹp', 'Hộp'],
    story: 'Chữ P đứng thẳng hiên ngang,\nĐèn Pin soi sáng, xóm làng bình yên.\nPhố phường tấp nập, đông vui,\nChữ P phấp phới, niềm vui ngập tràn.',
    combinations: ['p + i = pi (pin)', 'p + a = pa (pa-tê)', 'thường đi với h thành ph']
  },
  { 
    char: 'Q', 
    name: 'Quy', 
    pronunciation: 'quờ', 
    usage: 'Phụ âm, luôn đi kèm với u thành qu.', 
    examples: ['Quê', 'Qua', 'Quả'],
    story: 'Chữ Q chân thẳng, đầu tròn,\nQuả cam, Quê hương, sắt son một lòng.\nQua sông phải lụy đò ngang,\nChữ Q quyến luyến, mênh mang tình người.',
    combinations: ['q + u + a = qua', 'q + u + ê = quê', 'q + u + ả = quả']
  },
  { 
    char: 'R', 
    name: 'E-rờ', 
    pronunciation: 'rờ', 
    usage: 'Phụ âm rung, đầu lưỡi cong lên và rung.', 
    examples: ['Ra', 'Rổ', 'Rá'],
    story: 'Chữ R rung lưỡi thật kêu,\nCái Rổ, Con Rùa, sớm chiều chậm đi.\nRa vườn hái đóa hoa thi,\nChữ R rực rỡ, khắc ghi trong lòng.',
    combinations: ['r + a = ra', 'r + e = re', 'r + i = ri', 'r + o = ro']
  },
  { 
    char: 'S', 
    name: 'Ét-xì', 
    pronunciation: 'sờ', 
    usage: 'Phụ âm xát, lưỡi cong lên (miền Bắc phát âm nặng).', 
    examples: ['Sẻ', 'Sông', 'Sao'],
    story: 'Chữ S uốn lượn dòng sông,\nNgôi Sao lấp lánh, mênh mông bầu trời.\nSẻ nâu ríu rít gọi mời,\nChữ S sặc sỡ, rạng ngời sắc xuân.',
    combinations: ['s + a = sa', 's + e = se', 's + i = si', 's + o = so']
  },
  { 
    char: 'T', 
    name: 'Tê', 
    pronunciation: 'tờ', 
    usage: 'Phụ âm đầu lưỡi, chạm lợi trên.', 
    examples: ['Ta', 'Tô', 'Tư'],
    story: 'Chữ T gạch ngang trên đầu,\nCái Tô, Tủ sách, nhịp cầu bắc qua.\nTuổi thơ, Tình bạn, thiết tha,\nChữ T to lớn, bao la tình người.',
    combinations: ['t + a = ta', 't + e = te', 't + i = ti', 't + o = to']
  },
  { 
    char: 'U', 
    name: 'U', 
    pronunciation: 'u', 
    usage: 'Nguyên âm tròn môi, hẹp nhất.', 
    examples: ['U', 'Tu', 'Lu'],
    story: 'Chữ U như cái cốc sâu,\nCon Cua, Cái Tủ, ở đâu cũng dùng.\nUng dung tự tại vẫy vùng,\nChữ U uống nước, ta cùng nhớ ghi.',
    combinations: ['u + n = un (thun)', 'u + m = um (chum)', 'u + a = ua (cua)']
  },
  { 
    char: 'Ư', 
    name: 'Ư', 
    pronunciation: 'ư', 
    usage: 'Nguyên âm, miệng mở hẹp, không tròn môi.', 
    examples: ['Tư', 'Sư', 'Lư'],
    story: 'Chữ Ư thêm móc bên mình,\nSư tử oai vệ, rùng mình rừng xanh.\nLư hương khói tỏa vây quanh,\nChữ Ư ưng ý, bức tranh tuyệt vời.',
    combinations: ['ư + n = ưn (sưn)', 'ư + t = ưt (mứt)', 'ư + a = ưa (mưa)']
  },
  { 
    char: 'V', 
    name: 'Vê', 
    pronunciation: 'vờ', 
    usage: 'Phụ âm môi răng, răng trên chạm môi dưới.', 
    examples: ['Và', 'Về', 'Vui'],
    story: 'Chữ V hai nét gặp nhau,\nCon Vịt, Vở viết, trước sau vẹn toàn.\nVui vẻ, Vang vọng tiếng đàn,\nChữ V vẫy gọi, muôn vàn yêu thương.',
    combinations: ['v + a = va', 'v + e = ve', 'v + i = vi', 'v + o = vo']
  },
  { 
    char: 'X', 
    name: 'Ích-xì', 
    pronunciation: 'xờ', 
    usage: 'Phụ âm xát, lưỡi thẳng (nhẹ hơn S).', 
    examples: ['Xa', 'Xe', 'Xu'],
    story: 'Chữ X hai nét chéo nhau,\nXe đạp, Xa xôi, mau mau trở về.\nXinh xắn, Xao xuyến, say mê,\nChữ X xao động, lời thề sắt son.',
    combinations: ['x + a = xa', 'x + e = xe', 'x + i = xi', 'x + o = xo']
  },
  { 
    char: 'Y', 
    name: 'I dài', 
    pronunciation: 'i', 
    usage: 'Nguyên âm, giống i ngắn nhưng thường đứng một mình hoặc trong âm đệm.', 
    examples: ['Y tế', 'Yêu', 'Ly'],
    story: 'Chữ Y dài ngoẵng cái chân,\nY tá, Y sĩ, ân cần chăm lo.\nYêu thương, Ý chí, tự do,\nChữ Y yểu điệu, chẳng lo muộn phiền.',
    combinations: ['y + ê + u = yêu', 'y + ê + n = yên', 'l + y = ly']
  },
];

export const GRAMMAR_RULES: GrammarRule[] = [
  {
    title: "Quy tắc viết hoa",
    description: "Viết hoa chữ cái đầu câu, tên riêng (người, địa danh), và các trường hợp đặc biệt để thể hiện sự tôn trọng.",
    examples: ["Hà Nội", "Nguyễn Văn A", "Hôm nay trời đẹp."]
  },
  {
    title: "Quy tắc dấu thanh",
    description: "Tiếng Việt có 6 thanh: Ngang (không dấu), Huyền (`), Sắc (´), Hỏi (?), Ngã (~), Nặng (.). Dấu thanh đặt trên hoặc dưới nguyên âm chính.",
    examples: ["Ma (ngang)", "Mà (huyền)", "Má (sắc)", "Mả (hỏi)", "Mã (ngã)", "Mạ (nặng)"]
  },
  {
    title: "Phân biệt I và Y",
    description: "Dùng 'i' khi từ đó không có phụ âm đệm đứng trước (trừ một số trường hợp ngoại lệ như 'thú y'). Dùng 'y' khi đứng sau âm đệm (như 'uy', 'ay').",
    examples: ["Kĩ sư (thường dùng i)", "Yêu thương (đứng đầu)", "Tay (sau a)"]
  },
  {
    title: "Phân biệt D, GI và R",
    description: "D và GI trong tiếng miền Bắc phát âm giống nhau (z), R phát âm rung. Miền Nam phân biệt rõ hơn.",
    examples: ["Da dẻ", "Gia đình", "Rổ rá"]
  },
  {
    title: "Phân biệt S và X",
    description: "S thường đi với các vần: oa, oe, uân... X thường đi với các vần: oe, oa... (Cần học thuộc từ vựng).",
    examples: ["Sạch sẽ", "Xanh xao", "Sản xuất", "Xác suất"]
  },
  {
    title: "Phân biệt CH và TR",
    description: "TR thường là từ Hán Việt, mang sắc thái mạnh. CH thường là từ thuần Việt, chỉ đồ vật, hành động cụ thể.",
    examples: ["Trân trọng", "Chân thành", "Trái cây", "Chái bếp"]
  }
];

// Generating 20 sample exercises (expandable to 100)
export const EXERCISES: Exercise[] = [
  { id: 1, question: "Từ nào sau đây viết đúng chính tả?", options: ["Sắp xếp", "Sắp sếp", "Xắp xếp", "Xắp sếp"], correctAnswer: 0, explanation: "'Sắp xếp' là từ đúng. S dùng cho cả hai âm tiết." },
  { id: 2, question: "Điền vào chỗ trống: 'Con ... con đậu cành mềm'", options: ["sâu", "xâu", "sau", "xau"], correctAnswer: 0, explanation: "'Con sâu' là danh từ chỉ loài vật. 'Xâu' là động từ (xâu chuỗi)." },
  { id: 3, question: "Từ nào viết sai chính tả?", options: ["Dành dụm", "Tranh dành", "Để dành", "Dành thời gian"], correctAnswer: 1, explanation: "Đúng phải là 'Tranh giành'. 'Dành' dùng cho để dành, dành dụm." },
  { id: 4, question: "Chọn từ đúng: '... đẹp'", options: ["Xinh", "Sinh"], correctAnswer: 0, explanation: "'Xinh đẹp' chỉ vẻ đẹp. 'Sinh' dùng trong sinh đẻ, sinh sống." },
  { id: 5, question: "Điền từ: 'Chân ... đá mềm'", options: ["cứng", "cứn", "cứng", "cưng"], correctAnswer: 0, explanation: "Thành ngữ 'Chân cứng đá mềm'." },
  { id: 6, question: "Từ nào đúng?", options: ["Rượu", "Rựu", "Riệu", "Diệu"], correctAnswer: 0, explanation: "'Rượu' là đồ uống có cồn." },
  { id: 7, question: "Điền từ: 'Bánh ...'", options: ["chưng", "trưng"], correctAnswer: 0, explanation: "'Bánh chưng' là loại bánh truyền thống. 'Trưng' là trưng bày." },
  { id: 8, question: "Từ nào viết đúng?", options: ["Giúm đỡ", "Giúp đỡ", "Dúp đỡ", "Rúp đỡ"], correctAnswer: 1, explanation: "'Giúp đỡ' là hành động hỗ trợ." },
  { id: 9, question: "Chọn từ đúng:", options: ["Truyện cười", "Chuyện cười"], correctAnswer: 0, explanation: "'Truyện' thường chỉ tác phẩm văn học viết. 'Chuyện' là sự việc được kể lại (trò chuyện)." },
  { id: 10, question: "Điền từ: 'Cây ...'", options: ["tre", "che"], correctAnswer: 0, explanation: "'Cây tre' là loài cây. 'Che' là hành động che chắn." },
  { id: 11, question: "Từ nào sai?", options: ["Vô hình", "Vô tình", "Dô duyên", "Vui vẻ"], correctAnswer: 2, explanation: "Đúng phải là 'Vô duyên'." },
  { id: 12, question: "Điền từ: 'Con ...'", options: ["trâu", "châu"], correctAnswer: 0, explanation: "'Con trâu' là động vật. 'Châu' dùng trong châu báu, châu Á." },
  { id: 13, question: "Từ nào đúng?", options: ["Lãng mạng", "Lãng mạn", "Lãn mạn", "Lảng mạn"], correctAnswer: 1, explanation: "'Lãng mạn' (Romantic)." },
  { id: 14, question: "Điền từ: 'Sáng ...'", options: ["lạng", "lạn", "láng", "lạn"], correctAnswer: 2, explanation: "'Sáng láng' (thông minh, rạng rỡ)." },
  { id: 15, question: "Từ nào đúng?", options: ["Xúc tích", "Súc tích"], correctAnswer: 1, explanation: "'Súc tích' nghĩa là ngắn gọn, cô đọng." },
  { id: 16, question: "Điền từ: 'Dư ...'", options: ["dả", "giả"], correctAnswer: 0, explanation: "'Dư dả' nghĩa là có thừa." },
  { id: 17, question: "Từ nào đúng?", options: ["Chuẩn đoán", "Chẩn đoán"], correctAnswer: 1, explanation: "Trong y học dùng 'Chẩn đoán'." },
  { id: 18, question: "Điền từ: 'Tham ...'", options: ["quan", "quang"], correctAnswer: 0, explanation: "'Tham quan' (thăm viếng, xem xét)." },
  { id: 19, question: "Từ nào đúng?", options: ["Bàng quang", "Bàng quan"], correctAnswer: 1, explanation: "'Bàng quan' là thờ ơ. 'Bàng quang' là bọng đái." },
  { id: 20, question: "Điền từ: 'Kết ...'", options: ["cục", "cuộc"], correctAnswer: 0, explanation: "'Kết cục' (kết quả cuối cùng)." },
  { id: 21, question: "Từ nào đúng?", options: ["Giả thuyết", "Giả thiết"], correctAnswer: 0, explanation: "'Giả thuyết' là điều tạm nêu ra để chứng minh. 'Giả thiết' là điều cho trước." },
  { id: 22, question: "Điền từ: 'Chân ...'", options: ["thành", "trành"], correctAnswer: 0, explanation: "'Chân thành' là thật thà, hết lòng." },
  { id: 23, question: "Từ nào đúng?", options: ["Sơ xuất", "Sơ suất"], correctAnswer: 1, explanation: "'Sơ suất' là thiếu cẩn thận." },
  { id: 24, question: "Điền từ: 'Cọ ...'", options: ["xát", "sát"], correctAnswer: 0, explanation: "'Cọ xát' là va chạm vào nhau." },
  { id: 25, question: "Từ nào đúng?", options: ["Xán lạn", "Sán lạn", "Xán lạng", "Sán lạng"], correctAnswer: 0, explanation: "'Xán lạn' nghĩa là rực rỡ, sáng sủa." },
  { id: 26, question: "Điền từ: 'Dành ...'", options: ["dụm", "giụm"], correctAnswer: 0, explanation: "'Dành dụm' là tiết kiệm." },
  { id: 27, question: "Từ nào đúng?", options: ["Giấu giếm", "Dấu diếm"], correctAnswer: 0, explanation: "'Giấu giếm' là che đậy." },
  { id: 28, question: "Điền từ: 'Trân ...'", options: ["trọng", "chọng"], correctAnswer: 0, explanation: "'Trân trọng' là coi trọng." },
  { id: 29, question: "Từ nào đúng?", options: ["Chỉnh chu", "Chỉn chu"], correctAnswer: 1, explanation: "'Chỉn chu' là cẩn thận, chu đáo." },
  { id: 30, question: "Điền từ: 'Bổ ...'", options: ["sung", "xung"], correctAnswer: 0, explanation: "'Bổ sung' là thêm vào cho đủ." },
  { id: 31, question: "Từ nào đúng?", options: ["Vô vàn", "Vô vàng"], correctAnswer: 0, explanation: "'Vô vàn' là rất nhiều." },
  { id: 32, question: "Điền từ: 'Dông ...'", options: ["dài", "dày"], correctAnswer: 0, explanation: "'Dông dài' là nói chuyện lan man." },
  { id: 33, question: "Từ nào đúng?", options: ["Khuyến mãi", "Khuyến mại"], correctAnswer: 1, explanation: "Luật thương mại dùng 'Khuyến mại'. Tuy nhiên 'Khuyến mãi' cũng phổ biến." },
  { id: 34, question: "Điền từ: 'Xúi ...'", options: ["giục", "dục"], correctAnswer: 0, explanation: "'Xúi giục' là kích động làm việc xấu." },
  { id: 35, question: "Từ nào đúng?", options: ["Dữ dằn", "Giữ dằn"], correctAnswer: 0, explanation: "'Dữ dằn' là hung dữ." },
  { id: 36, question: "Điền từ: 'Giả ...'", options: ["dối", "giối"], correctAnswer: 0, explanation: "'Giả dối' là không thật." },
  { id: 61, question: "Từ nào đúng?", options: ["Giành giật", "Dành giật"], correctAnswer: 0, explanation: "'Giành giật' là tranh cướp." },
  { id: 62, question: "Điền từ: 'Chung ...'", options: ["cư", "kư"], correctAnswer: 0, explanation: "'Chung cư' là nhà ở tập thể." },
  { id: 63, question: "Từ nào đúng?", options: ["Bắt chước", "Bắt trước"], correctAnswer: 0, explanation: "'Bắt chước' là làm theo." },
  { id: 64, question: "Điền từ: 'Thủy ...'", options: ["triều", "chiều"], correctAnswer: 0, explanation: "'Thủy triều' là hiện tượng nước lên xuống." },
  { id: 65, question: "Từ nào đúng?", options: ["Cổ vũ", "Cổ võ"], correctAnswer: 0, explanation: "'Cổ vũ' là động viên." },
  { id: 66, question: "Điền từ: 'Phố ...'", options: ["xá", "sá"], correctAnswer: 0, explanation: "'Phố xá' là đường phố." },
  { id: 67, question: "Từ nào đúng?", options: ["Xoay sở", "Xoay xở"], correctAnswer: 1, explanation: "'Xoay xở' là tìm cách giải quyết." },
  { id: 68, question: "Điền từ: 'Đường ...'", options: ["sá", "xá"], correctAnswer: 0, explanation: "'Đường sá' là đường đi lại." },
  { id: 69, question: "Từ nào đúng?", options: ["Chẩn đoán", "Chuẩn đoán"], correctAnswer: 0, explanation: "'Chẩn đoán' bệnh." },
  { id: 70, question: "Điền từ: 'Cọ ...'", options: ["xát", "sát"], correctAnswer: 0, explanation: "'Cọ xát' va chạm." },
  { id: 71, question: "Từ nào đúng?", options: ["Sáp nhập", "Sát nhập"], correctAnswer: 0, explanation: "'Sáp nhập' là nhập vào làm một." },
  { id: 72, question: "Điền từ: 'Cọ ...'", options: ["xát", "sát"], correctAnswer: 0, explanation: "'Cọ xát' va chạm." },
  { id: 73, question: "Từ nào đúng?", options: ["Sản xuất", "Sản suất"], correctAnswer: 0, explanation: "'Sản xuất' tạo ra của cải." },
  { id: 74, question: "Điền từ: 'Năng ...'", options: ["suất", "xuất"], correctAnswer: 0, explanation: "'Năng suất' lao động." },
  { id: 75, question: "Từ nào đúng?", options: ["Xuất sắc", "Suất sắc"], correctAnswer: 0, explanation: "'Xuất sắc' là giỏi vượt trội." },
  { id: 76, question: "Điền từ: 'Xác ...'", options: ["suất", "xuất"], correctAnswer: 0, explanation: "'Xác suất' thống kê." },
  { id: 77, question: "Từ nào đúng?", options: ["Xổ số", "Sổ số"], correctAnswer: 0, explanation: "'Xổ số' kiến thiết." },
  { id: 78, question: "Điền từ: 'Sổ ...'", options: ["sách", "xách"], correctAnswer: 0, explanation: "'Sổ sách' ghi chép." },
  { id: 79, question: "Từ nào đúng?", options: ["Xứ sở", "Sứ sở"], correctAnswer: 0, explanation: "'Xứ sở' quê hương." },
  { id: 80, question: "Điền từ: 'Sứ ...'", options: ["giả", "xả"], correctAnswer: 0, explanation: "'Sứ giả' hòa bình." },
  { id: 81, question: "Từ nào đúng?", options: ["Sử dụng", "Xử dụng"], correctAnswer: 0, explanation: "'Sử dụng' đồ vật." },
  { id: 82, question: "Điền từ: 'Xử ...'", options: ["lý", "lý"], correctAnswer: 0, explanation: "'Xử lý' công việc." },
  { id: 83, question: "Từ nào đúng?", options: ["Xét xử", "Sét xử"], correctAnswer: 0, explanation: "'Xét xử' vụ án." },
  { id: 84, question: "Điền từ: 'Sét ...'", options: ["đánh", "đánh"], correctAnswer: 0, explanation: "'Sét đánh' ngang tai." },
  { id: 85, question: "Từ nào đúng?", options: ["Giả thuyết", "Giả thiết"], correctAnswer: 0, explanation: "'Giả thuyết' là điều tạm nêu ra để chứng minh. 'Giả thiết' là điều cho trước." },
  { id: 86, question: "Điền từ: 'Chân ...'", options: ["thành", "trành"], correctAnswer: 0, explanation: "'Chân thành' là thật thà, hết lòng." },
  { id: 87, question: "Từ nào đúng?", options: ["Sơ xuất", "Sơ suất"], correctAnswer: 1, explanation: "'Sơ suất' là thiếu cẩn thận." },
  { id: 88, question: "Điền từ: 'Cọ ...'", options: ["xát", "sát"], correctAnswer: 0, explanation: "'Cọ xát' là va chạm vào nhau." },
  { id: 89, question: "Từ nào đúng?", options: ["Xán lạn", "Sán lạn", "Xán lạng", "Sán lạng"], correctAnswer: 0, explanation: "'Xán lạn' nghĩa là rực rỡ, sáng sủa." },
  { id: 90, question: "Điền từ: 'Dành ...'", options: ["dụm", "giụm"], correctAnswer: 0, explanation: "'Dành dụm' là tiết kiệm." },
  { id: 91, question: "Từ nào đúng?", options: ["Giấu giếm", "Dấu diếm"], correctAnswer: 0, explanation: "'Giấu giếm' là che đậy." },
  { id: 92, question: "Điền từ: 'Trân ...'", options: ["trọng", "chọng"], correctAnswer: 0, explanation: "'Trân trọng' là coi trọng." },
  { id: 93, question: "Từ nào đúng?", options: ["Chỉnh chu", "Chỉn chu"], correctAnswer: 1, explanation: "'Chỉn chu' là cẩn thận, chu đáo." },
  { id: 94, question: "Điền từ: 'Bổ ...'", options: ["sung", "xung"], correctAnswer: 0, explanation: "'Bổ sung' là thêm vào cho đủ." },
  { id: 95, question: "Từ nào đúng?", options: ["Vô vàn", "Vô vàng"], correctAnswer: 0, explanation: "'Vô vàn' là rất nhiều." },
  { id: 96, question: "Điền từ: 'Dông ...'", options: ["dài", "dày"], correctAnswer: 0, explanation: "'Dông dài' là nói chuyện lan man." },
  { id: 97, question: "Từ nào đúng?", options: ["Khuyến mãi", "Khuyến mại"], correctAnswer: 1, explanation: "Luật thương mại dùng 'Khuyến mại'. Tuy nhiên 'Khuyến mãi' cũng phổ biến." },
  { id: 98, question: "Điền từ: 'Xúi ...'", options: ["giục", "dục"], correctAnswer: 0, explanation: "'Xúi giục' là kích động làm việc xấu." },
  { id: 99, question: "Từ nào đúng?", options: ["Dữ dằn", "Giữ dằn"], correctAnswer: 0, explanation: "'Dữ dằn' là hung dữ." },
  { id: 100, question: "Điền từ: 'Giả ...'", options: ["dối", "giối"], correctAnswer: 0, explanation: "'Giả dối' là không thật." },
  { id: 101, question: "Từ nào đúng?", options: ["Dành giật", "Giành giật"], correctAnswer: 1, explanation: "'Giành giật' là tranh cướp." },
  { id: 102, question: "Điền từ: 'Chung ...'", options: ["cư", "kư"], correctAnswer: 0, explanation: "'Chung cư' là nhà ở tập thể." },
  { id: 103, question: "Từ nào đúng?", options: ["Bắt chước", "Bắt trước"], correctAnswer: 0, explanation: "'Bắt chước' là làm theo." },
  { id: 104, question: "Điền từ: 'Thủy ...'", options: ["triều", "chiều"], correctAnswer: 0, explanation: "'Thủy triều' là hiện tượng nước lên xuống." },
  { id: 105, question: "Từ nào đúng?", options: ["Cổ vũ", "Cổ võ"], correctAnswer: 0, explanation: "'Cổ vũ' là động viên." },
  { id: 106, question: "Điền từ: 'Phố ...'", options: ["xá", "sá"], correctAnswer: 0, explanation: "'Phố xá' là đường phố." },
  { id: 107, question: "Từ nào đúng?", options: ["Xoay sở", "Xoay xở"], correctAnswer: 1, explanation: "'Xoay xở' là tìm cách giải quyết." },
  { id: 108, question: "Điền từ: 'Đường ...'", options: ["sá", "xá"], correctAnswer: 0, explanation: "'Đường sá' là đường đi lại." },
  { id: 109, question: "Từ nào đúng?", options: ["Chẩn đoán", "Chuẩn đoán"], correctAnswer: 0, explanation: "'Chẩn đoán' bệnh." },
  { id: 110, question: "Điền từ: 'Cọ ...'", options: ["xát", "sát"], correctAnswer: 0, explanation: "'Cọ xát' va chạm." },
  { id: 111, question: "Từ nào đúng?", options: ["Sáp nhập", "Sát nhập"], correctAnswer: 0, explanation: "'Sáp nhập' là nhập vào làm một." },
  { id: 112, question: "Điền từ: 'Cọ ...'", options: ["xát", "sát"], correctAnswer: 0, explanation: "'Cọ xát' va chạm." },
  { id: 113, question: "Từ nào đúng?", options: ["Sản xuất", "Sản suất"], correctAnswer: 0, explanation: "'Sản xuất' tạo ra của cải." },
  { id: 114, question: "Điền từ: 'Năng ...'", options: ["suất", "xuất"], correctAnswer: 0, explanation: "'Năng suất' lao động." },
  { id: 115, question: "Từ nào đúng?", options: ["Xuất sắc", "Suất sắc"], correctAnswer: 0, explanation: "'Xuất sắc' là giỏi vượt trội." },
  { id: 116, question: "Điền từ: 'Xác ...'", options: ["suất", "xuất"], correctAnswer: 0, explanation: "'Xác suất' thống kê." },
  { id: 117, question: "Từ nào đúng?", options: ["Xổ số", "Sổ số"], correctAnswer: 0, explanation: "'Xổ số' kiến thiết." },
  { id: 118, question: "Điền từ: 'Sổ ...'", options: ["sách", "xách"], correctAnswer: 0, explanation: "'Sổ sách' ghi chép." },
  { id: 119, question: "Từ nào đúng?", options: ["Xứ sở", "Sứ sở"], correctAnswer: 0, explanation: "'Xứ sở' quê hương." },
  { id: 120, question: "Điền từ: 'Sứ ...'", options: ["giả", "xả"], correctAnswer: 0, explanation: "'Sứ giả' hòa bình." },
  { id: 121, question: "Từ nào đúng?", options: ["Sử dụng", "Xử dụng"], correctAnswer: 0, explanation: "'Sử dụng' đồ vật." },
  { id: 122, question: "Điền từ: 'Xử ...'", options: ["lý", "lý"], correctAnswer: 0, explanation: "'Xử lý' công việc." },
  { id: 123, question: "Từ nào đúng?", options: ["Xét xử", "Sét xử"], correctAnswer: 0, explanation: "'Xét xử' vụ án." },
  { id: 124, question: "Điền từ: 'Sét ...'", options: ["đánh", "đánh"], correctAnswer: 0, explanation: "'Sét đánh' ngang tai." },
  { id: 125, question: "Từ nào đúng?", options: ["Giả thuyết", "Giả thiết"], correctAnswer: 0, explanation: "'Giả thuyết' là điều tạm nêu ra để chứng minh. 'Giả thiết' là điều cho trước." },
  { id: 126, question: "Điền từ: 'Chân ...'", options: ["thành", "trành"], correctAnswer: 0, explanation: "'Chân thành' là thật thà, hết lòng." },
  { id: 127, question: "Từ nào đúng?", options: ["Sơ xuất", "Sơ suất"], correctAnswer: 1, explanation: "'Sơ suất' là thiếu cẩn thận." },
  { id: 128, question: "Điền từ: 'Cọ ...'", options: ["xát", "sát"], correctAnswer: 0, explanation: "'Cọ xát' là va chạm vào nhau." },
  { id: 129, question: "Từ nào đúng?", options: ["Xán lạn", "Sán lạn", "Xán lạng", "Sán lạng"], correctAnswer: 0, explanation: "'Xán lạn' nghĩa là rực rỡ, sáng sủa." },
  { id: 130, question: "Điền từ: 'Dành ...'", options: ["dụm", "giụm"], correctAnswer: 0, explanation: "'Dành dụm' là tiết kiệm." },
  { id: 131, question: "Từ nào đúng?", options: ["Giấu giếm", "Dấu diếm"], correctAnswer: 0, explanation: "'Giấu giếm' là che đậy." },
  { id: 132, question: "Điền từ: 'Trân ...'", options: ["trọng", "chọng"], correctAnswer: 0, explanation: "'Trân trọng' là coi trọng." },
  { id: 133, question: "Từ nào đúng?", options: ["Chỉnh chu", "Chỉn chu"], correctAnswer: 1, explanation: "'Chỉn chu' là cẩn thận, chu đáo." },
  { id: 134, question: "Điền từ: 'Bổ ...'", options: ["sung", "xung"], correctAnswer: 0, explanation: "'Bổ sung' là thêm vào cho đủ." },
  { id: 135, question: "Từ nào đúng?", options: ["Vô vàn", "Vô vàng"], correctAnswer: 0, explanation: "'Vô vàn' là rất nhiều." },
  { id: 136, question: "Điền từ: 'Dông ...'", options: ["dài", "dày"], correctAnswer: 0, explanation: "'Dông dài' là nói chuyện lan man." },
  { id: 137, question: "Từ nào đúng?", options: ["Khuyến mãi", "Khuyến mại"], correctAnswer: 1, explanation: "Luật thương mại dùng 'Khuyến mại'. Tuy nhiên 'Khuyến mãi' cũng phổ biến." },
  { id: 138, question: "Điền từ: 'Xúi ...'", options: ["giục", "dục"], correctAnswer: 0, explanation: "'Xúi giục' là kích động làm việc xấu." },
  { id: 139, question: "Từ nào đúng?", options: ["Dữ dằn", "Giữ dằn"], correctAnswer: 0, explanation: "'Dữ dằn' là hung dữ." },
  { id: 140, question: "Điền từ: 'Giả ...'", options: ["dối", "giối"], correctAnswer: 0, explanation: "'Giả dối' là không thật." },
  { id: 141, question: "Từ nào đúng?", options: ["Dành giật", "Giành giật"], correctAnswer: 1, explanation: "'Giành giật' là tranh cướp." },
  { id: 142, question: "Điền từ: 'Chung ...'", options: ["cư", "kư"], correctAnswer: 0, explanation: "'Chung cư' là nhà ở tập thể." },
  { id: 143, question: "Từ nào đúng?", options: ["Bắt chước", "Bắt trước"], correctAnswer: 0, explanation: "'Bắt chước' là làm theo." },
  { id: 144, question: "Điền từ: 'Thủy ...'", options: ["triều", "chiều"], correctAnswer: 0, explanation: "'Thủy triều' là hiện tượng nước lên xuống." },
  { id: 145, question: "Từ nào đúng?", options: ["Cổ vũ", "Cổ võ"], correctAnswer: 0, explanation: "'Cổ vũ' là động viên." },
  { id: 146, question: "Điền từ: 'Phố ...'", options: ["xá", "sá"], correctAnswer: 0, explanation: "'Phố xá' là đường phố." },
  { id: 147, question: "Từ nào đúng?", options: ["Xoay sở", "Xoay xở"], correctAnswer: 1, explanation: "'Xoay xở' là tìm cách giải quyết." },
  { id: 148, question: "Điền từ: 'Đường ...'", options: ["sá", "xá"], correctAnswer: 0, explanation: "'Đường sá' là đường đi lại." },
  { id: 149, question: "Từ nào đúng?", options: ["Chẩn đoán", "Chuẩn đoán"], correctAnswer: 0, explanation: "'Chẩn đoán' bệnh." },
  { id: 150, question: "Điền từ: 'Cọ ...'", options: ["xát", "sát"], correctAnswer: 0, explanation: "'Cọ xát' va chạm." },
  { id: 151, question: "Từ nào đúng?", options: ["Sáp nhập", "Sát nhập"], correctAnswer: 0, explanation: "'Sáp nhập' là nhập vào làm một." },
  { id: 152, question: "Điền từ: 'Cọ ...'", options: ["xát", "sát"], correctAnswer: 0, explanation: "'Cọ xát' va chạm." },
  { id: 153, question: "Từ nào đúng?", options: ["Sản xuất", "Sản suất"], correctAnswer: 0, explanation: "'Sản xuất' tạo ra của cải." },
  { id: 154, question: "Điền từ: 'Năng ...'", options: ["suất", "xuất"], correctAnswer: 0, explanation: "'Năng suất' lao động." },
  { id: 155, question: "Từ nào đúng?", options: ["Xuất sắc", "Suất sắc"], correctAnswer: 0, explanation: "'Xuất sắc' là giỏi vượt trội." },
  { id: 156, question: "Điền từ: 'Xác ...'", options: ["suất", "xuất"], correctAnswer: 0, explanation: "'Xác suất' thống kê." },
  { id: 157, question: "Từ nào đúng?", options: ["Xổ số", "Sổ số"], correctAnswer: 0, explanation: "'Xổ số' kiến thiết." },
  { id: 158, question: "Điền từ: 'Sổ ...'", options: ["sách", "xách"], correctAnswer: 0, explanation: "'Sổ sách' ghi chép." },
  { id: 159, question: "Từ nào đúng?", options: ["Xứ sở", "Sứ sở"], correctAnswer: 0, explanation: "'Xứ sở' quê hương." },
  { id: 160, question: "Điền từ: 'Sứ ...'", options: ["giả", "xả"], correctAnswer: 0, explanation: "'Sứ giả' hòa bình." },
  { id: 161, question: "Từ nào đúng?", options: ["Sử dụng", "Xử dụng"], correctAnswer: 0, explanation: "'Sử dụng' đồ vật." },
  { id: 162, question: "Điền từ: 'Xử ...'", options: ["lý", "lý"], correctAnswer: 0, explanation: "'Xử lý' công việc." },
  { id: 163, question: "Từ nào đúng?", options: ["Xét xử", "Sét xử"], correctAnswer: 0, explanation: "'Xét xử' vụ án." },
  { id: 164, question: "Điền từ: 'Sét ...'", options: ["đánh", "đánh"], correctAnswer: 0, explanation: "'Sét đánh' ngang tai." },
  { id: 165, question: "Từ nào đúng?", options: ["Giả thuyết", "Giả thiết"], correctAnswer: 0, explanation: "'Giả thuyết' là điều tạm nêu ra để chứng minh. 'Giả thiết' là điều cho trước." },
  { id: 166, question: "Điền từ: 'Chân ...'", options: ["thành", "trành"], correctAnswer: 0, explanation: "'Chân thành' là thật thà, hết lòng." },
  { id: 167, question: "Từ nào đúng?", options: ["Sơ xuất", "Sơ suất"], correctAnswer: 1, explanation: "'Sơ suất' là thiếu cẩn thận." },
  { id: 168, question: "Điền từ: 'Cọ ...'", options: ["xát", "sát"], correctAnswer: 0, explanation: "'Cọ xát' là va chạm vào nhau." },
  { id: 169, question: "Từ nào đúng?", options: ["Xán lạn", "Sán lạn", "Xán lạng", "Sán lạng"], correctAnswer: 0, explanation: "'Xán lạn' nghĩa là rực rỡ, sáng sủa." },
  { id: 170, question: "Điền từ: 'Dành ...'", options: ["dụm", "giụm"], correctAnswer: 0, explanation: "'Dành dụm' là tiết kiệm." },
  { id: 171, question: "Từ nào đúng?", options: ["Giấu giếm", "Dấu diếm"], correctAnswer: 0, explanation: "'Giấu giếm' là che đậy." },
  { id: 172, question: "Điền từ: 'Trân ...'", options: ["trọng", "chọng"], correctAnswer: 0, explanation: "'Trân trọng' là coi trọng." },
  { id: 173, question: "Từ nào đúng?", options: ["Chỉnh chu", "Chỉn chu"], correctAnswer: 1, explanation: "'Chỉn chu' là cẩn thận, chu đáo." },
  { id: 174, question: "Điền từ: 'Bổ ...'", options: ["sung", "xung"], correctAnswer: 0, explanation: "'Bổ sung' là thêm vào cho đủ." },
  { id: 175, question: "Từ nào đúng?", options: ["Vô vàn", "Vô vàng"], correctAnswer: 0, explanation: "'Vô vàn' là rất nhiều." },
  { id: 176, question: "Điền từ: 'Dông ...'", options: ["dài", "dày"], correctAnswer: 0, explanation: "'Dông dài' là nói chuyện lan man." },
  { id: 177, question: "Từ nào đúng?", options: ["Khuyến mãi", "Khuyến mại"], correctAnswer: 1, explanation: "Luật thương mại dùng 'Khuyến mại'. Tuy nhiên 'Khuyến mãi' cũng phổ biến." },
  { id: 178, question: "Điền từ: 'Xúi ...'", options: ["giục", "dục"], correctAnswer: 0, explanation: "'Xúi giục' là kích động làm việc xấu." },
  { id: 179, question: "Từ nào đúng?", options: ["Dữ dằn", "Giữ dằn"], correctAnswer: 0, explanation: "'Dữ dằn' là hung dữ." },
  { id: 180, question: "Điền từ: 'Giả ...'", options: ["dối", "giối"], correctAnswer: 0, explanation: "'Giả dối' là không thật." },
  { id: 181, question: "Từ nào đúng?", options: ["Dành giật", "Giành giật"], correctAnswer: 1, explanation: "'Giành giật' là tranh cướp." },
  { id: 182, question: "Điền từ: 'Chung ...'", options: ["cư", "kư"], correctAnswer: 0, explanation: "'Chung cư' là nhà ở tập thể." },
  { id: 183, question: "Từ nào đúng?", options: ["Bắt chước", "Bắt trước"], correctAnswer: 0, explanation: "'Bắt chước' là làm theo." },
  { id: 184, question: "Điền từ: 'Thủy ...'", options: ["triều", "chiều"], correctAnswer: 0, explanation: "'Thủy triều' là hiện tượng nước lên xuống." },
  { id: 185, question: "Từ nào đúng?", options: ["Cổ vũ", "Cổ võ"], correctAnswer: 0, explanation: "'Cổ vũ' là động viên." },
  { id: 186, question: "Điền từ: 'Phố ...'", options: ["xá", "sá"], correctAnswer: 0, explanation: "'Phố xá' là đường phố." },
  { id: 187, question: "Từ nào đúng?", options: ["Xoay sở", "Xoay xở"], correctAnswer: 1, explanation: "'Xoay xở' là tìm cách giải quyết." },
  { id: 188, question: "Điền từ: 'Đường ...'", options: ["sá", "xá"], correctAnswer: 0, explanation: "'Đường sá' là đường đi lại." },
  { id: 189, question: "Từ nào đúng?", options: ["Chẩn đoán", "Chuẩn đoán"], correctAnswer: 0, explanation: "'Chẩn đoán' bệnh." },
  { id: 190, question: "Điền từ: 'Cọ ...'", options: ["xát", "sát"], correctAnswer: 0, explanation: "'Cọ xát' va chạm." },
  { id: 191, question: "Từ nào đúng?", options: ["Sáp nhập", "Sát nhập"], correctAnswer: 0, explanation: "'Sáp nhập' là nhập vào làm một." },
  { id: 192, question: "Điền từ: 'Cọ ...'", options: ["xát", "sát"], correctAnswer: 0, explanation: "'Cọ xát' va chạm." },
  { id: 193, question: "Từ nào đúng?", options: ["Sản xuất", "Sản suất"], correctAnswer: 0, explanation: "'Sản xuất' tạo ra của cải." },
  { id: 194, question: "Điền từ: 'Năng ...'", options: ["suất", "xuất"], correctAnswer: 0, explanation: "'Năng suất' lao động." },
  { id: 195, question: "Từ nào đúng?", options: ["Xuất sắc", "Suất sắc"], correctAnswer: 0, explanation: "'Xuất sắc' là giỏi vượt trội." },
  { id: 196, question: "Điền từ: 'Xác ...'", options: ["suất", "xuất"], correctAnswer: 0, explanation: "'Xác suất' thống kê." },
  { id: 197, question: "Từ nào đúng?", options: ["Xổ số", "Sổ số"], correctAnswer: 0, explanation: "'Xổ số' kiến thiết." },
  { id: 198, question: "Điền từ: 'Sổ ...'", options: ["sách", "xách"], correctAnswer: 0, explanation: "'Sổ sách' ghi chép." },
  { id: 199, question: "Từ nào đúng?", options: ["Xứ sở", "Sứ sở"], correctAnswer: 0, explanation: "'Xứ sở' quê hương." },
  { id: 200, question: "Điền từ: 'Sứ ...'", options: ["giả", "xả"], correctAnswer: 0, explanation: "'Sứ giả' hòa bình." },
];

export const LEARNING_DOCUMENTS: LearningDocument[] = [
  {
    id: "doc-1",
    title: "Nguồn gốc chữ Quốc ngữ",
    content: "Chữ Quốc ngữ là hệ thống chữ viết dùng các ký tự Latinh để ghi âm tiếng Việt.",
    chapters: [
      {
        title: "Lịch sử hình thành",
        content: "Chữ Quốc ngữ được hình thành từ thế kỷ 17, do các giáo sĩ phương Tây (nổi bật là Alexandre de Rhodes) phối hợp với người Việt tạo ra để truyền giáo. Ban đầu, nó chỉ là công cụ ghi âm, chưa phải văn tự chính thức."
      },
      {
        title: "Quá trình phát triển",
        content: "Đến thế kỷ 19, dưới thời Pháp thuộc, chữ Quốc ngữ bắt đầu được phổ biến rộng rãi thay thế chữ Nôm và chữ Hán. Các phong trào Duy Tân, Đông Kinh Nghĩa Thục đã góp phần quan trọng trong việc truyền bá chữ Quốc ngữ."
      },
      {
        title: "Vai trò hiện nay",
        content: "Ngày nay, chữ Quốc ngữ là văn tự chính thức của Việt Nam, được sử dụng trong mọi lĩnh vực đời sống, giáo dục, hành chính. Nó dễ học, dễ nhớ, giúp xóa mù chữ nhanh chóng."
      }
    ]
  },
  {
    id: "doc-2",
    title: "Hệ thống Nguyên âm và Phụ âm",
    content: "Tiếng Việt có hệ thống âm vị phong phú, bao gồm nguyên âm đơn, nguyên âm đôi và các phụ âm.",
    chapters: [
      {
        title: "Nguyên âm đơn",
        content: "Tiếng Việt có 12 nguyên âm đơn: a, ă, â, e, ê, i, o, ô, ơ, u, ư, y. Các nguyên âm này có thể đứng một mình hoặc kết hợp với phụ âm để tạo thành tiếng."
      },
      {
        title: "Nguyên âm đôi",
        content: "Có 3 nguyên âm đôi chính: ia/iê (như trong 'kia', 'tiên'), ua/uô (như trong 'mua', 'muôn'), ưa/ươ (như trong 'mưa', 'mượn'). Cách viết thay đổi tùy thuộc vào việc có âm cuối hay không."
      },
      {
        title: "Phụ âm đầu",
        content: "Tiếng Việt có nhiều phụ âm đầu như: b, c, d, đ, g, h, k, l, m, n, p, q, r, s, t, v, x. Ngoài ra còn có các phụ âm ghép: ch, gh, gi, kh, ng, ngh, nh, ph, qu, th, tr."
      }
    ]
  },
  {
    id: "doc-3",
    title: "Quy tắc Dấu thanh (6 thanh)",
    content: "Thanh điệu là yếu tố quan trọng để phân biệt nghĩa của từ trong tiếng Việt.",
    chapters: [
      {
        title: "Thanh Ngang (Không dấu)",
        content: "Ký hiệu: không có. Ví dụ: ma, ba, ca. Giọng điệu bằng phẳng, không lên không xuống."
      },
      {
        title: "Thanh Huyền (` )",
        content: "Ký hiệu: dấu huyền. Ví dụ: mà, bà, cà. Giọng điệu trầm, xuống thấp."
      },
      {
        title: "Thanh Sắc (´ )",
        content: "Ký hiệu: dấu sắc. Ví dụ: má, bá, cá. Giọng điệu cao, lên giọng."
      },
      {
        title: "Thanh Hỏi (?)",
        content: "Ký hiệu: dấu hỏi. Ví dụ: mả, bả, cả. Giọng điệu xuống thấp rồi lên cao nhẹ."
      },
      {
        title: "Thanh Ngã (~)",
        content: "Ký hiệu: dấu ngã. Ví dụ: mã, bã, cã. Giọng điệu lên cao, có sự gãy khúc ở giữa (ngắt giọng)."
      },
      {
        title: "Thanh Nặng (.)",
        content: "Ký hiệu: dấu nặng. Ví dụ: mạ, bạ, cạ. Giọng điệu xuống thấp đột ngột, ngắn."
      }
    ]
  },
  {
    id: "doc-4",
    title: "Các lỗi chính tả thường gặp",
    content: "Tổng hợp các lỗi sai phổ biến và cách khắc phục.",
    chapters: [
      {
        title: "Lỗi L/N",
        content: "Thường gặp ở miền Bắc. Mẹo: L thường xuất hiện trong từ láy (long lanh, lấp lánh). N thường không láy âm với từ bắt đầu bằng phụ âm khác (trừ 'n' như no nê)."
      },
      {
        title: "Lỗi CH/TR",
        content: "TR thường mang sắc thái mạnh, nặng (trung thành, trọng trách). CH mang sắc thái nhẹ hơn, chỉ vật dụng (chai, chổi, chén). TR không đi với các vần: oa, oă, oe (trừ ngoại lệ). CH thì có (choáng, chéo)."
      },
      {
        title: "Lỗi S/X",
        content: "S thường đi với các vần: uân, uât... (sản xuất, mùa xuân). X thường đi với các vần: oe, oa... (xoay xở, xoa dịu). Tên thức ăn, đồ dùng thường là X (xôi, xúc xích, xe, xuồng, xoong)."
      },
      {
        title: "Lỗi D/R/GI",
        content: "R thường dùng cho từ có âm rung (rung rinh, rầm rộ). GI thường dùng cho từ có nghĩa liên quan đến gia đình, dòng họ (gia giáo, giống nòi). D thường dùng cho từ còn lại (da dẻ, dặn dò)."
      }
    ]
  },
  {
    id: "doc-5",
    title: "Văn hóa và Tiếng Việt",
    content: "Tiếng Việt không chỉ là ngôn ngữ mà còn chứa đựng văn hóa ứng xử của người Việt.",
    chapters: [
      {
        title: "Xưng hô trong gia đình",
        content: "Hệ thống xưng hô phong phú: Ông, bà, cha, mẹ, cô, dì, chú, bác, anh, chị, em, con, cháu... Thể hiện tôn ti trật tự và tình cảm thân mật."
      },
      {
        title: "Xưng hô ngoài xã hội",
        content: "Người Việt thường dùng từ xưng hô gia đình để xưng hô ngoài xã hội (gọi người lớn tuổi là bác, cô, chú...) để tạo sự gần gũi."
      },
      {
        title: "Thành ngữ, Tục ngữ",
        content: "Kho tàng tri thức dân gian: 'Uống nước nhớ nguồn', 'Ăn quả nhớ kẻ trồng cây', 'Lá lành đùm lá rách'... dạy đạo lý làm người."
      }
    ]
  }
];


export const DICTIONARY: DictionaryEntry[] = [
  { 
    word: "An nhiên", 
    definition: "Trạng thái thư thái, bình yên trong tâm hồn, không lo âu.", 
    context: "Sống một đời an nhiên.",
    story: "An nhiên là khi lòng ta tĩnh lặng như mặt hồ phẳng lặng, không gợn sóng lo âu. Giữa cuộc sống bộn bề, tìm được sự an nhiên là tìm được hạnh phúc đích thực."
  },
  { 
    word: "Bâng khuâng", 
    definition: "Cảm giác nhớ nhung, luyến tiếc, buồn vui lẫn lộn mơ hồ.", 
    context: "Lòng bâng khuâng nhớ về kỷ niệm cũ.",
    story: "Chiều thu, lá vàng rơi xào xạc, lòng người bỗng thấy bâng khuâng. Nhớ về những ngày xưa cũ, những kỷ niệm đẹp đẽ đã qua đi không bao giờ trở lại."
  },
  { 
    word: "Cà phê", 
    definition: "Đồ uống làm từ hạt cây cà phê rang xay.", 
    context: "Đi uống cà phê sáng.",
    story: "Hạt cà phê đắng nhưng hậu vị ngọt ngào, giống như cuộc đời vậy. Phải trải qua gian nan mới nếm được trái ngọt thành công."
  },
  { 
    word: "Duyên dáng", 
    definition: "Vẻ đẹp mềm mại, uyển chuyển, gây cảm tình.", 
    context: "Cô gái cười duyên dáng.",
    story: "Duyên dáng không chỉ ở vẻ bề ngoài mà còn ở lời ăn tiếng nói, cử chỉ dịu dàng. Nét duyên thầm làm say đắm lòng người hơn cả sắc đẹp rực rỡ."
  },
  { 
    word: "Êm đềm", 
    definition: "Yên tĩnh, nhẹ nhàng, không có tiếng ồn ào hay xáo trộn.", 
    context: "Dòng sông trôi êm đềm.",
    story: "Tuổi thơ trôi qua êm đềm như dòng sông quê hương. Những trưa hè oi ả, tiếng ve kêu râm ran, giấc ngủ trưa êm đềm trong vòng tay mẹ."
  },
  { 
    word: "Gia đình", 
    definition: "Tập hợp những người gắn bó với nhau do hôn nhân, quan hệ huyết thống.", 
    context: "Gia đình là số một.",
    story: "Gia đình là nơi bão dừng sau cánh cửa. Dù đi đâu, về đâu, gia đình vẫn là nơi ấm áp nhất, là điểm tựa vững chắc nhất cho mỗi chúng ta."
  },
  { 
    word: "Hạnh phúc", 
    definition: "Trạng thái sung sướng vì cảm thấy hoàn toàn đạt được ý nguyện.", 
    context: "Chúc bạn trăm năm hạnh phúc.",
    story: "Hạnh phúc không phải là đích đến mà là hành trình. Hạnh phúc nằm trong những điều giản dị nhất: một bữa cơm ngon, một nụ cười, một cái nắm tay."
  },
  { 
    word: "Khoan dung", 
    definition: "Rộng lượng tha thứ cho người khác.", 
    context: "Hãy có lòng khoan dung.",
    story: "Khoan dung là món quà quý giá nhất mà ta có thể trao tặng cho người khác và cho chính mình. Tha thứ là cởi bỏ gánh nặng trong lòng."
  },
  { 
    word: "Lạc quan", 
    definition: "Có thái độ tin tưởng ở tương lai tốt đẹp.", 
    context: "Luôn giữ tinh thần lạc quan.",
    story: "Người lạc quan nhìn thấy cơ hội trong khó khăn. Giữa màn đêm u tối, họ vẫn tin rằng bình minh sẽ rạng rỡ vào ngày mai."
  },
  { 
    word: "Mênh mông", 
    definition: "Rộng lớn đến mức không nhìn thấy giới hạn.", 
    context: "Biển lúa mênh mông.",
    story: "Đứng trước biển cả mênh mông, con người thấy mình thật nhỏ bé. Nhưng chính sự mênh mông ấy lại khơi dậy khát vọng vươn xa, chinh phục những chân trời mới."
  },
  { 
    word: "Nỗ lực", 
    definition: "Cố gắng hết sức để làm việc gì đó.", 
    context: "Nỗ lực học tập.",
    story: "Thành công không tự nhiên mà đến, nó là kết quả của sự nỗ lực không ngừng nghỉ. Mỗi giọt mồ hôi rơi xuống là một viên gạch xây nên đài vinh quang."
  },
  { 
    word: "Ôn hòa", 
    definition: "Nhã nhặn, không gay gắt.", 
    context: "Khí hậu ôn hòa.",
    story: "Tính cách ôn hòa giúp ta dễ dàng kết bạn và giải quyết mâu thuẫn. Như dòng nước mát lành, sự ôn hòa làm dịu đi những cơn nóng giận."
  },
  { 
    word: "Phản biện", 
    definition: "Dùng lý lẽ để bác bỏ hoặc làm rõ một ý kiến.", 
    context: "Tư duy phản biện.",
    story: "Phản biện không phải là cãi vã, mà là cùng nhau tìm ra chân lý. Tư duy phản biện giúp ta nhìn nhận vấn đề đa chiều và sâu sắc hơn."
  },
  { 
    word: "Quê hương", 
    definition: "Nơi mình sinh ra và lớn lên, có tình cảm gắn bó.", 
    context: "Quê hương là chùm khế ngọt.",
    story: "Quê hương mỗi người chỉ một, như là chỉ một mẹ thôi. Dù đi xa đến đâu, hình bóng quê hương vẫn luôn in đậm trong trái tim mỗi người con xa xứ."
  },
  { 
    word: "Rực rỡ", 
    definition: "Có màu sắc tươi sáng, đẹp đẽ nổi bật.", 
    context: "Cờ hoa rực rỡ.",
    story: "Mùa xuân về, muôn hoa đua nở rực rỡ. Sắc màu của hoa lá làm bừng sáng cả không gian, mang lại niềm vui và hy vọng cho mọi người."
  },
  { 
    word: "Sẻ chia", 
    definition: "Cùng chịu đựng hoặc hưởng thụ với người khác.", 
    context: "Sẻ chia nỗi buồn.",
    story: "Niềm vui khi được sẻ chia sẽ nhân đôi, nỗi buồn khi được sẻ chia sẽ vơi đi một nửa. Sẻ chia là sợi dây gắn kết tình người."
  },
  { 
    word: "Tự do", 
    definition: "Không bị ràng buộc, hạn chế, được làm theo ý mình.", 
    context: "Độc lập - Tự do - Hạnh phúc.",
    story: "Tự do là khát vọng ngàn đời của nhân loại. Nhưng tự do đích thực phải đi kèm với trách nhiệm. Tự do trong khuôn khổ của đạo đức và pháp luật."
  },
  { 
    word: "Uy tín", 
    definition: "Sự tín nhiệm mà người khác dành cho mình.", 
    context: "Giữ chữ tín.",
    story: "Một lần bất tín, vạn lần bất tin. Uy tín là tài sản vô giá của mỗi người, phải mất cả đời để xây dựng nhưng có thể mất đi trong chốc lát."
  },
  { 
    word: "Vô tư", 
    definition: "Không lo nghĩ, hoặc không thiên vị.", 
    context: "Cười vô tư.",
    story: "Sống vô tư cho đời thanh thản. Đừng toan tính thiệt hơn, hãy cứ cho đi rồi sẽ nhận lại. Tâm hồn vô tư như đứa trẻ, luôn tìm thấy niềm vui trong mọi hoàn cảnh."
  },
  { 
    word: "Xao xuyến", 
    definition: "Cảm xúc rung động mạnh mẽ, bồi hồi.", 
    context: "Lòng xao xuyến khi mùa thu về.",
    story: "Tiếng trống trường vang lên làm lòng người xao xuyến. Nhớ về thời áo trắng ngây thơ, những rung động đầu đời trong sáng và đẹp đẽ."
  },
  { 
    word: "Yêu thương", 
    definition: "Có tình cảm thắm thiết, quan tâm chăm sóc.", 
    context: "Trao gửi yêu thương.",
    story: "Yêu thương là cội nguồn của hạnh phúc. Hãy yêu thương mọi người như yêu thương chính bản thân mình. Thế giới sẽ tốt đẹp hơn biết bao nếu ai cũng biết yêu thương."
  },
  { 
    word: "Ý chí", 
    definition: "Khả năng tự xác định mục đích và kiên trì thực hiện.", 
    context: "Ý chí sắt đá.",
    story: "Không có việc gì khó, chỉ sợ lòng không bền. Ý chí kiên cường sẽ giúp ta vượt qua mọi chông gai thử thách để vươn tới thành công."
  }
];
