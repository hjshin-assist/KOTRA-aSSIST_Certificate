/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import CertificatePortal from './components/CertificatePortal';
import { courses, Course } from './data/courses';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, GraduationCap, Calendar, ArrowLeft, Lock } from 'lucide-react';

export default function App() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [pendingCourse, setPendingCourse] = useState<Course | null>(null);
  const [coursePassword, setCoursePassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [activeModal, setActiveModal] = useState<string | null>(null);

  const modalContent: { [key: string]: { title: string, content: React.ReactNode } } = {
    guide: {
      title: "이용안내",
      content: (
        <div className="space-y-4 text-slate-600 text-sm text-left">
          <p className="font-bold text-navy-brand">수료증 발급 방법:</p>
          <ol className="list-decimal pl-4 space-y-2">
            <li><strong>성함 확인:</strong> 목록에서 본인의 성함을 찾거나 상단 검색창을 이용해 검색하세요.</li>
            <li><strong>본인 인증:</strong> 카드 우측 상단의 'Locked'를 클릭하거나 카드 영역을 선택한 후, 본인의 <strong>핸드폰 번호 뒷자리 4자리</strong>를 입력하세요.</li>
            <li><strong>수료증 저장:</strong> 인증 완료 후 나타나는 <span className="text-amber-600 font-bold">금색 버튼</span>을 클릭하면 새 창에서 수료증이 열립니다. 브라우저의 저장/인쇄 아이콘을 사용하여 보관하세요.</li>
          </ol>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-4 text-[13px]">
            <p className="flex items-center gap-2 text-slate-500">
              <Calendar size={14} /> 모바일 환경의 경우 브라우저에 따라 '파일 다운로드'가 차단될 수 있으니 가급적 PC 환경 사용을 권장합니다.
            </p>
          </div>
        </div>
      )
    },
    privacy: {
      title: "개인정보처리방침",
      content: (
        <div className="space-y-4 text-slate-600 text-sm text-left">
          <p>KOTRA-aSSIST 수료증 발급 시스템은 개인정보 보호법에 따라 수료생의 정보를 안전하게 관리합니다.</p>
          <div className="space-y-2">
            <p><strong>1. 수집 항목:</strong> 성명, 핸드폰 번호(본인 인증용)</p>
            <p><strong>2. 수집 목적:</strong> 교육과정 수료증 발급 및 대장 관리</p>
            <p><strong>3. 보존 및 파기:</strong> 개인정보 유출 방지를 위한 데이터 라이프사이클 관리 방침에 따라, 각 교육과정별로 설정된 '데이터 파기 예정일' 도래 시 시스템 및 서버에서 모든 수료생 정보와 수료증 PDF 파일이 즉시 영구 파기(영구 삭제)됩니다.</p>
          </div>
          <p className="text-[13px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
            * 본 시스템은 외부 검색 엔진에 노출되지 않으며, 성합 일부 마스킹 및 비밀번호 인증을 통해 타인의 정보 접근을 제한하고 있습니다.
          </p>
        </div>
      )
    }
  };

  const handleVerifyPassword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pendingCourse) return;

    const passwords: { [key: string]: string } = {
      'export-first-2026': '260520',
      'usa-2026': '260610',
      'overseas-marketing-2026': '260611',
      'vietnam-2026': '260729',
    };
    const correctPassword = passwords[pendingCourse.id] || '999999';
    if (coursePassword === correctPassword) {
      setSelectedCourse(pendingCourse);
      setPendingCourse(null);
      setCoursePassword("");
      setPasswordError("");
    } else {
      setPasswordError("비밀번호가 올바르지 않습니다. 다시 확인해 주세요.");
    }
  };

  if (selectedCourse) {
    return (
      <div className="relative">
        <button 
          onClick={() => setSelectedCourse(null)}
          className="fixed top-4 left-4 z-50 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-all border border-white/20 shadow-xl group"
          title="과정 선택으로 돌아가기"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <CertificatePortal course={selectedCourse} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-8"
          >
            <GraduationCap size={16} className="text-blue-400" />
            <span className="text-xs font-bold text-blue-400 tracking-widest text-[#60A5FA]">KOTRA-aSSIST CERTIFICATE PORTAL</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
          >
            수료증 발급 통합
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium"
          >
            본인이 수강하신 과정을 선택해 주세요. <br className="hidden md:block" />
            성함 확인 및 개인 인증 후 수료증을 확인하실 수 있습니다.
          </motion.p>
        </div>
      </div>

      {/* Course List */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course, idx) => (
            <motion.button
              key={course.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
              onClick={() => {
                setPendingCourse(course);
                setCoursePassword("");
                setPasswordError("");
              }}
              className="group relative bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/50 p-8 rounded-2xl text-left transition-all hover:bg-slate-800/60 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden cursor-pointer"
            >
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-blue-400 text-xs font-bold tracking-widest">{course.subtitle}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8 whitespace-pre-line">
                    {course.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
                    <Calendar size={14} />
                    <span>{course.date}</span>
                  </div>
                  <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:px-4 transition-all duration-300 flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest hidden group-hover:block transition-all opacity-0 group-hover:opacity-100">입장하기</span>
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
              
              {/* Decorative side light */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors"></div>
            </motion.button>
          ))}
          
          {/* Add a placeholder for future courses */}
          <div className="border-2 border-dashed border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center text-center opacity-40">
             <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="text-slate-500" />
             </div>
             <p className="text-slate-500 text-sm font-medium">새로운 교육 과정이 곧 추가됩니다.</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
        <p className="text-xs">© 2026 KOTRA-aSSIST 글로벌 비즈니스</p>
        <div className="flex space-x-6 text-[10px] font-bold uppercase tracking-widest">
          <button onClick={() => setActiveModal('guide')} className="hover:text-white transition-colors cursor-pointer">이용안내</button>
          <button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors cursor-pointer">개인정보처리방침</button>
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
                <h3 className="text-[#0F172A] font-bold uppercase tracking-widest text-xs">
                  {modalContent[activeModal].title}
                </h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors"
                >
                   <ChevronRight size={16} />
                </button>
              </div>
              <div className="p-6">
                {modalContent[activeModal].content}
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full mt-6 bg-[#0F172A] text-white text-xs font-bold py-3 rounded-lg hover:bg-slate-700 transition-all uppercase tracking-widest"
                >
                  확인
                </button>
              </div>
            </motion.div>
          </>
        )}

        {pendingCourse && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setPendingCourse(null);
                setCoursePassword("");
                setPasswordError("");
              }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-[101] text-left"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Lock size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block font-mono">Security Authentication</span>
                  <h3 className="text-lg font-bold text-white tracking-tight leading-none mt-1">교육과정 비밀번호 입력</h3>
                </div>
              </div>

              <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                <strong className="text-slate-200 font-semibold">[{pendingCourse.title}]</strong>에 입장하기 위한
                <br />
                비밀번호를 입력해 주세요.
              </p>

              <form onSubmit={handleVerifyPassword} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="비밀번호 입력"
                    value={coursePassword}
                    onChange={(e) => {
                      setCoursePassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                    autoFocus
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-xl px-4 py-3 text-sm transition-all outline-none"
                  />
                  {passwordError && (
                    <p className="text-rose-500 text-[11px] mt-2 font-medium bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl">
                      {passwordError}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPendingCourse(null);
                      setCoursePassword("");
                      setPasswordError("");
                    }}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    닫기
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-blue-500/20 cursor-pointer"
                  >
                    입장하기
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
