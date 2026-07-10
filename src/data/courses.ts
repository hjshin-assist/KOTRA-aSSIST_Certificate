export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  expiryDate: string; // 데이터 파기 예정일 (YYYY-MM-DD)
  bannerImage?: string;
}

export const courses: Course[] = [
  {
    id: "export-first-2026",
    title: "수출 첫 걸음 과정",
    subtitle: "KOTRA-aSSIST",
    description: "수출 초보 기업을 위한 실무 기초 및 수출 첫 걸음 역량 강화 과정",
    date: "2026.05.20",
    expiryDate: "2026-06-25",
  },
  {
    id: "usa-2026",
    title: "미국 시장 진출 과정",
    subtitle: "KOTRA-aSSIST",
    description: "미국 현지 비즈니스 법률, 통관 실무 및 유통 채널 입점을 위한\n진출 전략 수립 과정",
    date: "2026.06.10",
    expiryDate: "2026-08-31",
  },
  {
    id: "overseas-marketing-2026",
    title: "해외전시 마케팅 과정",
    subtitle: "KOTRA-aSSIST",
    description: "해외 박람회 참가 기획부터 효과적인 바이어 발굴 및\n글로벌 마케팅 실무 과정",
    date: "2026.06.11 - 06.12",
    expiryDate: "2026-09-15",
  },
  // 앞으로 여기에 신규 과정을 추가하면 됩니다.
];
