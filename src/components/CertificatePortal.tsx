import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Lock, Search, CheckCircle2, User, Info } from 'lucide-react';
import { students, Student } from '../data/students';
import { Course } from '../data/courses';

interface CertificatePortalProps {
  course: Course;
}

export default function CertificatePortal({ course }: CertificatePortalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [passwords, setPasswords] = useState<{ [key: number]: string }>({});
  const [unlockedIds, setUnlockedIds] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<{ [key: number]: string }>({});

  const [activeModal, setActiveModal] = useState<string | null>(null);

  const maskName = (name: string) => {
    if (name.length <= 1) return name;
    if (name.length === 2) return name[0] + '*';
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  };

  const modalContent: { [key: string]: { title: string, content: React.ReactNode } } = {
    guide: {
      title: "이용안내",
      content: (
        <div className="space-y-4 text-slate-600 text-sm">
          <p className="font-bold text-navy-brand">수료증 발급 방법:</p>
          <ol className="list-decimal pl-4 space-y-2">
            <li><strong>성함 확인:</strong> 목록에서 본인의 성함을 찾거나 상단 검색창을 이용해 검색하세요.</li>
            <li><strong>본인 인증:</strong> 카드 우측 상단의 'Locked'를 클릭하거나 카드 영역을 선택한 후, 본인의 <strong>핸드폰 번호 뒷자리 4자리</strong>를 입력하세요.</li>
            <li><strong>수료증 저장:</strong> 인증 완료 후 나타나는 <span className="text-amber-600 font-bold">금색 버튼</span>을 클릭하면 새 창에서 수료증이 열립니다. 브라우저의 저장/인쇄 아이콘을 사용하여 보관하세요.</li>
          </ol>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-4 text-[13px]">
            <p className="flex items-center gap-2 text-slate-500">
              <Info size={14} /> 모바일 환경의 경우 브라우저에 따라 '파일 다운로드'가 차단될 수 있으니 가급적 PC 환경 사용을 권장합니다.
            </p>
          </div>
        </div>
      )
    },
    privacy: {
      title: "개인정보처리방침",
      content: (
        <div className="space-y-4 text-slate-600 text-sm">
          <p>KOTRA-aSSIST 수료증 발급 시스템은 개인정보 보호법에 따라 수료생의 정보를 안전하게 관리합니다.</p>
          <div className="space-y-2">
            <p><strong>1. 수집 항목:</strong> 성명, 핸드폰 번호(본인 인증용)</p>
            <p><strong>2. 수집 목적:</strong> 교육과정 수료증 발급 및 대장 관리</p>
            <p><strong>3. 보존 및 파기:</strong> 개인정보 유출 방지를 위한 데이터 라이프사이클 관리 방침에 따라, 각 교육과정별로 설정된 '데이터 파기 예정일' 도래 시 시스템 및 서버에서 모든 수료생 정보와 수료증 PDF 파일이 즉시 영구 파기(영구 삭제)됩니다.</p>
          </div>
          <p className="text-[13px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
            * 본 시스템은 외부 검색 엔진에 노출되지 않으며, 성함 일부 마스킹 및 비밀번호 인증을 통해 타인의 정보 접근을 제한하고 있습니다.
          </p>
        </div>
      )
    }
  };

  const filteredStudents = students.filter(s => 
    s.courseId === course.id && s.name.includes(searchTerm)
  );

  const courseStudentsCount = students.filter(s => s.courseId === course.id).length;

  const handlePasswordChange = (studentId: number, value: string) => {
    setPasswords(prev => ({ ...prev, [studentId]: value }));
    setErrors(prev => ({ ...prev, [studentId]: '' }));
  };

  const handleUnlock = (student: Student) => {
    const pwd = passwords[student.id];
    if (pwd === student.password) {
      setUnlockedIds(prev => new Set(prev).add(student.id));
      setErrors(prev => ({ ...prev, [student.id]: '' }));
    } else {
      setErrors(prev => ({ ...prev, [student.id]: '비밀번호가 틀렸습니다.' }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col geometric-grid overflow-x-hidden">
      {/* Header */}
      <header className="bg-navy-brand h-20 flex items-center justify-between px-6 md:px-10 text-white shrink-0 shadow-lg relative z-20">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-navy-brand rounded-full"></div>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight leading-tight">{course.subtitle}</h1>
            <p className="text-[10px] opacity-80 uppercase tracking-widest hidden sm:block">{course.id.replace(/-/g, ' ')}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-sm md:text-lg font-medium leading-tight">{course.title} 수료증 발급</h2>
          <p className="text-[10px] opacity-70 hidden sm:block">Certificates Issuance Portal</p>
        </div>
      </header>

      {/* Subheader / Search */}
      <div className="bg-white border-b border-slate-200 px-6 md:px-10 py-4 flex flex-col md:flex-row items-center justify-between shadow-sm shrink-0 sticky top-0 z-10">
        <div className="flex items-center space-x-3 mb-4 md:mb-0 w-full md:w-auto">
          <div className="w-1.5 h-8 gold-gradient shrink-0"></div>
          <p className="text-slate-600 text-sm md:text-base font-medium">
            총 <span className="text-navy-brand font-bold">{courseStudentsCount}명</span>의 수료생 여러분, 축하드립니다. 성함 확인 후 비밀번호를 입력해 주세요.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="성함 검색..." 
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-navy-brand/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-slate-400" size={16} />
        </div>
      </div>

      {/* Main Grid Content */}
      <main className="flex-1 p-6 md:p-10">
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          {filteredStudents.map((student, i) => {
            const isUnlocked = unlockedIds.has(student.id);
            const isSelected = selectedStudentId === student.id;
            const error = errors[student.id];
            
            const courseStudents = students.filter(s => s.courseId === course.id);
            const studentIndex = courseStudents.findIndex(s => s.id === student.id) + 1;

            return (
              <motion.div
                key={student.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => !isSelected && setSelectedStudentId(student.id)}
                className={`bg-white border rounded-xl p-6 flex flex-col justify-between transition-all duration-300 group relative
                  ${isSelected ? 'ring-2 ring-navy-brand border-transparent shadow-xl' : 'border-slate-200 shadow-sm hover:border-navy-brand/30'}
                `}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black text-slate-300 tracking-tighter">0{(studentIndex).toString().padStart(2, '0')}</span>
                    {isUnlocked ? (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 size={10} /> Verified
                      </span>
                    ) : (
                      <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider
                        ${isSelected ? 'bg-navy-brand/10 text-navy-brand' : 'bg-slate-100 text-slate-500'}
                      `}>
                        {isSelected ? 'Active' : 'Locked'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg transition-colors ${isSelected ? 'bg-navy-brand text-white' : 'bg-slate-50 text-slate-400'}`}>
                      <User size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">
                      {maskName(student.name)}
                      <span className="block text-[11px] font-medium text-slate-400 mt-0.5">{course.subtitle} Training Participant</span>
                    </h3>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <AnimatePresence mode="wait">
                    {!isUnlocked ? (
                      isSelected ? (
                        <motion.div
                          key="form"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 pt-4 border-t border-slate-100"
                        >
                          <div className="relative">
                            <input 
                              type="password" 
                              placeholder="핸드폰 번호 뒷자리 입력" 
                              className={`w-full text-sm px-4 py-2.5 border rounded-lg focus:outline-none transition-all
                                ${error ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-navy-brand'}
                              `}
                              value={passwords[student.id] || ''}
                              onChange={(e) => handlePasswordChange(student.id, e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleUnlock(student)}
                              autoFocus
                            />
                            <Lock className="absolute right-3 top-3 text-slate-300" size={14} />
                          </div>
                          {error && <p className="text-[10px] text-red-500 font-bold px-1">{error}</p>}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnlock(student);
                            }}
                            className="w-full bg-navy-brand text-white text-xs font-bold py-3 rounded-lg shadow-md hover:bg-navy-brand/90 transition-all uppercase tracking-widest"
                          >
                            인증 확인
                          </button>
                        </motion.div>
                      ) : (
                        <div key="locked" className="h-12 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg">
                          <span className="text-[10px] text-slate-400 italic">핸드폰 번호 뒷자리 입력</span>
                        </div>
                      )
                    ) : (
                      <motion.div
                        key="unlocked"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="pt-4 border-t border-slate-100 text-center"
                      >
                        <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm mb-4">
                          <CheckCircle2 size={18} />
                          <span>본인 인증 완료</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <a 
                            href={encodeURI(student.certificateUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full gold-gradient text-white text-xs font-bold py-4 rounded-lg shadow-lg flex items-center justify-center space-x-2 hover:opacity-90 active:scale-95 transition-all uppercase tracking-widest"
                          >
                            <Download size={18} />
                            <span>{student.name}님 수료증 확인 및 저장</span>
                          </a>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-3 italic">
                          버튼 클릭 시 새 창에서 수료증(PDF)이 열립니다.<br />
                          파일 확인 후 브라우저의 [저장] 아이콘을 이용해 주세요.
                        </p>
                      </motion.div>
                    )
                  }
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-20">
            <Info className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium italic">검색 결과가 없습니다.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 px-6 md:px-10 py-5 flex flex-col md:flex-row justify-between items-center text-[10px] border-t border-slate-800 shrink-0 gap-4 mt-auto">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6">
          <span>© 2026 KOTRA-aSSIST 글로벌 비즈니스</span>
          <div className="flex items-center space-x-4 border-l border-slate-700 pl-4">
            <button onClick={() => setActiveModal('guide')} className="hover:text-white transition-colors cursor-pointer">이용안내</button>
            <button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors cursor-pointer font-bold">개인정보처리방침</button>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-slate-600 font-mono tracking-tighter uppercase">Secure Access Protocol v3.0</span>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
        </div>
      </footer>

      {/* Info Modal */}
      <AnimatePresence>
        {activeModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-white rounded-2xl shadow-2xl z-[101] overflow-hidden"
            >
              <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
                <h3 className="text-navy-brand font-bold uppercase tracking-widest text-xs">
                  {modalContent[activeModal].title}
                </h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors"
                >
                  <Lock size={16} />
                </button>
              </div>
              <div className="p-6">
                {modalContent[activeModal].content}
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full mt-6 bg-slate-800 text-white text-xs font-bold py-3 rounded-lg hover:bg-slate-700 transition-all uppercase tracking-widest"
                >
                  확인
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
