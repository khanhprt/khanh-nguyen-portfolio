import { content } from './aiContent';
const bilingual = (vi, en) => ({ vi, en });
const project = (i) => {
  const vi = content.vi.items[i], en = content.en.items[i];
  return { title: vi.title, year: i === 2 ? '2024–2025' : '2025', category: bilingual(vi.type, en.type), role: 'AI Engineer', stack: vi.tags, problem: bilingual(vi.problem, en.problem), solution: bilingual(vi.solution, en.solution), result: bilingual(i === 0 ? 'Hệ thống cảnh báo được tích hợp vào quy trình EHS của nhà máy.' : 'Ứng dụng AI vào bài toán thực tế trong môi trường công nghiệp.', i === 0 ? 'Alerts are integrated into factory EHS workflows.' : 'Applying AI to real-world industrial challenges.'), colors: ['#dfead4','#253c34','#dc875d'], layout: 'b', url: 'AI VISION / SEVT', link: '', repo: '' };
};
export const portfolio = {
  name: 'Khanh Nguyen', role: 'AI Vision Engineer', contact: { email: 'you@example.com' },
  socials: [{ label: 'Facebook', icon: 'facebook', url: '' }],
  experience: [{ period: bilingual('03.2019 — Nay', 'Mar 2019 — Present'), role: 'Software Automation Engineer — AI & Vision', company: 'Samsung Electronics Vietnam Thai Nguyen', summary: bilingual(content.vi.expText, content.en.expText), stack: ['Computer Vision', 'Edge AI', 'EHS'], building: 'pod', scene: 'pod' }],
  hobbies: [
    { art: 'guitar', title: bilingual('Computer Vision', 'Computer Vision'), text: bilingual('Phát hiện đối tượng, nhận diện hành vi và kiểm tra chất lượng bằng thị giác máy tính.', 'Object detection, behavior recognition and visual quality inspection.'), tags: ['Object Detection', 'Vision'] },
    { art: 'dota', title: 'Edge AI', text: bilingual('Tối ưu và triển khai mô hình trên thiết bị biên trong môi trường công nghiệp.', 'Optimizing and deploying models on edge devices in industrial environments.'), tags: ['Jetson', 'Raspberry Pi 5', 'Hailo-8'] },
    { art: 'travel', title: bilingual('Nền tảng kỹ thuật', 'Engineering foundation'), text: bilingual('Kỹ sư Cơ điện tử, Đại học Kỹ thuật Công nghiệp Thái Nguyên (2013–2018).', 'B.Eng. in Mechatronics, Thai Nguyen University of Technology (2013–2018).'), tags: ['Mechatronics', 'Automation'] },
    { art: 'movies', title: bilingual('Học tập liên tục', 'Continued learning'), text: bilingual('Học Công nghệ phần mềm tại Học viện Công nghệ Bưu chính Viễn thông từ năm 2025.', 'Studying Software Engineering at the Posts and Telecommunications Institute of Technology since 2025.'), tags: ['Software Engineering', 'Python', 'C#', 'C++'] },
  ],
  projects: [project(0), project(1), project(2), project(3)],
};
