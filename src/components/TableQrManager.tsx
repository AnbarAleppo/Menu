'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Printer, ExternalLink, Download, Plus, Copy, Check } from 'lucide-react';

export default function TableQrManager() {
  const [origin, setOrigin] = useState('');
  const [selectedTableNumber, setSelectedTableNumber] = useState('1');
  const [tableType, setTableType] = useState('طاولة');
  const [customTableName, setCustomTableName] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const getFullTableName = () => {
    if (customTableName.trim()) return customTableName.trim();
    return `${tableType} رقم ${selectedTableNumber}`;
  };

  const currentTableName = getFullTableName();
  const qrUrl = `${origin}/?table=${encodeURIComponent(currentTableName)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const presetTables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold text-lg text-anbar-dark flex items-center gap-2">
          <QrCode className="w-5 h-5 text-anbar-amber" />
          <span>منشئ ومولد رموز QR لطاولات المطعم</span>
        </h3>
        <p className="text-xs text-anbar-dark/60 font-medium mt-1">
          قم بتوليد وطباعة بطاقات الـ QR المخصصة لكل طاولة. عند قيام الزبون بمسح الرمز، سيتم فتح قائمة الطعام وربط رقم طاولته تلقائياً بسلة الطلبات.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Generator Controls */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-anbar-subtle p-6 space-y-5 shadow-soft">
          <div>
            <label className="block text-xs font-bold text-anbar-dark/80 mb-2">
              اختر نوع الجلسة / الطاولة:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['طاولة', 'التراس', 'جلسة VIP'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setTableType(type);
                    setCustomTableName('');
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    tableType === type && !customTableName
                      ? 'bg-anbar-dark text-white border-anbar-dark shadow-xs'
                      : 'bg-anbar-bg text-anbar-dark/80 border-anbar-subtle hover:border-anbar-amber'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-anbar-dark/80 mb-2">
              رقم الطاولة السريع:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {presetTables.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setSelectedTableNumber(num.toString());
                    setCustomTableName('');
                  }}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border flex items-center justify-center ${
                    selectedTableNumber === num.toString() && !customTableName
                      ? 'bg-anbar-amber text-white border-anbar-amber shadow-xs'
                      : 'bg-anbar-bg text-anbar-dark/80 border-anbar-subtle hover:border-anbar-amber'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-anbar-dark/80 mb-1">
              أو اكتب اسماً أو رقماً مخصصاً:
            </label>
            <input
              type="text"
              value={customTableName}
              onChange={(e) => setCustomTableName(e.target.value)}
              placeholder="مثال: طاولة الشرفة 3 أو جناح 1"
              className="w-full px-3.5 py-2.5 rounded-xl border border-anbar-subtle text-xs bg-anbar-bg focus:outline-none focus:border-anbar-amber font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-anbar-dark/80 mb-1">
              الرابط السحابي الناتج (URL):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={qrUrl}
                className="w-full px-3 py-2 rounded-xl border border-anbar-subtle text-[11px] bg-stone-50 font-mono text-anbar-dark/80 select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-2 rounded-xl bg-anbar-bg hover:bg-anbar-amber hover:text-white border border-anbar-subtle text-xs font-bold transition-colors shrink-0 flex items-center gap-1"
                title="نسخ الرابط"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <a
              href={qrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-xl bg-white border border-anbar-subtle text-anbar-dark hover:border-anbar-amber hover:text-anbar-amber font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>تجربة مسح الرابط</span>
            </a>
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 py-2.5 rounded-xl bg-anbar-dark text-white hover:bg-anbar-rust font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة بطاقة الطاولة</span>
            </button>
          </div>
        </div>

        {/* Live Luxury Printable QR Card Preview */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            id="printable-qr-card"
            className="w-full max-w-sm bg-white rounded-3xl border-2 border-anbar-amber/30 p-8 shadow-elevated text-center space-y-6 relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-anbar-amber/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-anbar-rust/10 rounded-full blur-xl pointer-events-none"></div>

            {/* Restaurant Logo / Title */}
            <div>
              <span className="font-cairo font-black text-2xl text-anbar-dark tracking-wider block">
                مـطـعـم عـنـبـر
              </span>
              <span className="text-[11px] font-bold text-anbar-amber tracking-widest block mt-0.5">
                ANBAR RESTAURANT & CAFE
              </span>
            </div>

            {/* Table Badge */}
            <div className="inline-block px-5 py-1.5 rounded-full bg-anbar-dark text-white text-xs font-black shadow-md border border-anbar-amber/40">
              📍 {currentTableName}
            </div>

            {/* Crisp QR Code Frame */}
            <div className="p-4 bg-anbar-bg rounded-2xl border border-anbar-subtle inline-block shadow-inner">
              <QRCodeSVG
                value={qrUrl}
                size={190}
                level="H"
                includeMargin={true}
                fgColor="#1F1B16"
                bgColor="#FAF7F2"
              />
            </div>

            {/* Instructions */}
            <div className="space-y-1">
              <p className="text-xs font-bold text-anbar-dark">
                امسح الرمز بكاميرا هاتفك لاستعراض القائمة
              </p>
              <p className="text-[10px] text-anbar-dark/60 font-medium">
                سيتم إرسال طلبك مباشرة إلى هذه الطاولة من المطبخ
              </p>
            </div>

            <div className="pt-2 border-t border-anbar-subtle/80 flex items-center justify-center gap-1.5 text-[10px] font-bold text-anbar-dark/40">
              <span>أهلاً وسهلاً بكم في دار عنبر</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
